import cv2
import os
import faiss
from sentence_transformers import SentenceTransformer
from PIL import Image
import json
import glob
import numpy as np
import re


# --- Sanitizer Helper ---
def sanitize_filename(filename):
    """Removes special characters from a filename."""
    # Keep letters, numbers, underscores, hyphens, and spaces
    sanitized = re.sub(r'[^\w\s-]', '', filename).strip()
    # Replace spaces with underscores
    sanitized = re.sub(r'\s+', '_', sanitized)
    return sanitized


# --- Configuration ---
VIDEOS_FOLDER = "videos/"
FRAMES_FOLDER = "frames/"
INDEX_FILE = "video_index.faiss"
FRAME_MAP_FILE = "frame_map.json"
FRAME_RATE = 1


# --- AI Model ---
model = SentenceTransformer('clip-ViT-B-32')


# --- Main Indexing Logic ---
def create_full_index():
    print("--- Starting Full Indexing Process ---")

    # Create the output folder if it doesn't exist
    if not os.path.exists(FRAMES_FOLDER):
        os.makedirs(FRAMES_FOLDER)

    # Find all files in the videos folder and filter for common video types
    all_files = glob.glob(os.path.join(VIDEOS_FOLDER, '*'))
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv']
    video_files = [
        f for f in all_files
        if os.path.splitext(f)[1].lower() in video_extensions
    ]
    print(f"Found {len(video_files)} videos to process.")

    all_frames_data = []

    for video_path in video_files:
        print(f"\n--- Processing Video: {video_path} ---")
        video_filename = os.path.basename(video_path)
        video_name_without_ext = sanitize_filename(
            os.path.splitext(video_filename)[0]
        )

        video_capture = cv2.VideoCapture(video_path)
        fps = video_capture.get(cv2.CAP_PROP_FPS)
        frame_interval = int(fps / FRAME_RATE) if FRAME_RATE > 0 else 1

        frame_count = 0
        saved_frame_count = 0

        while True:
            success, frame = video_capture.read()
            if not success:
                break

            if frame_count % frame_interval == 0:
                # New frame naming scheme to avoid collisions
                frame_filename = os.path.join(
                    FRAMES_FOLDER,
                    (
                        f"{video_name_without_ext}_frame_"
                        f"{saved_frame_count:04d}.jpg"
                    )
                )
                cv2.imwrite(frame_filename, frame)

                # Store frame information
                all_frames_data.append({
                    "frame_path": frame_filename,
                    "video_source": video_path,
                    "timestamp": frame_count / fps
                })
                saved_frame_count += 1

            frame_count += 1

        video_capture.release()
        print(f"Done! Saved {saved_frame_count} frames from {video_filename}.")

    # --- AI Index Creation ---
    if not all_frames_data:
        print("No frames were extracted. Exiting.")
        return

    print(
        f"\n--- Creating AI Index for {len(all_frames_data)} total frames ---"
    )

    # Get just the frame paths for the model
    frame_paths = [data["frame_path"] for data in all_frames_data]

    # --- BATCH PROCESSING LOGIC ---
    batch_size = 256
    all_embeddings = []

    for i in range(0, len(frame_paths), batch_size):
        batch_paths = frame_paths[i:i + batch_size]

        # Open, process, and close images within this batch
        batch_images = [Image.open(f) for f in batch_paths]
        embeddings = model.encode(
            batch_images,
            batch_size=len(batch_images),
            convert_to_tensor=True,
            show_progress_bar=True
        )
        all_embeddings.append(embeddings.cpu().numpy())

        # Explicitly close images to be safe
        for img in batch_images:
            img.close()

        batch_num = i // batch_size + 1
        total_batches = len(frame_paths) // batch_size + 1
        print(f"Processed batch {batch_num} / {total_batches}")

    # Concatenate embeddings from all batches
    final_embeddings = np.concatenate(all_embeddings)

    # --- NORMALIZE THE EMBEDDINGS ---
    faiss.normalize_L2(final_embeddings)

    embedding_dim = final_embeddings.shape[1]
    index = faiss.IndexFlatIP(embedding_dim)
    index.add(final_embeddings)

    faiss.write_index(index, INDEX_FILE)

    # Save the new structured frame map as a JSON file
    with open(FRAME_MAP_FILE, 'w') as f:
        json.dump(all_frames_data, f, indent=4)

    print(f"Done! Index with {index.ntotal} vectors saved to '{INDEX_FILE}'.")
    print(f"Frame map saved to '{FRAME_MAP_FILE}'.")


# --- Run the script ---
if __name__ == "__main__":
    create_full_index()
