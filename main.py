import cv2
import os
import faiss
from sentence_transformers import SentenceTransformer
from PIL import Image

# --- Configuration ---
VIDEO_PATH = "videos/test_video.mp4"
OUTPUT_FOLDER = "frames"
INDEX_FILE = "video_index.faiss"
FRAME_MAP_FILE = "frame_map.txt"
FRAME_RATE = 1


# --- AI Model ---
model = SentenceTransformer('clip-ViT-B-32')


# --- Part 1: Video Frame Extraction ---
def extract_frames(video_path, output_folder, frame_rate):
    print("--- Step 1: Extracting Frames ---")
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    video_capture = cv2.VideoCapture(video_path)
    fps = video_capture.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps / frame_rate)

    print(f"Video FPS: {fps}, saving one frame every {frame_interval} frames.")

    frame_count = 0
    saved_frame_count = 0

    while True:
        success, frame = video_capture.read()
        if not success:
            break

        if frame_count % frame_interval == 0:
            frame_filename = os.path.join(
                output_folder, f"frame_{saved_frame_count:04d}.jpg"
            )
            cv2.imwrite(frame_filename, frame)
            saved_frame_count += 1

        frame_count += 1

    video_capture.release()
    print(
        f"Done! Saved {saved_frame_count} frames to the "
        f"'{output_folder}' folder."
    )
    return saved_frame_count > 0


# --- Part 2: AI Index Creation ---
def create_index(frames_folder, index_file, frame_map_file):
    print("\n--- Step 2: Creating AI Index ---")
    frame_files = sorted(
        [
            os.path.join(frames_folder, f)
            for f in os.listdir(frames_folder)
            if f.endswith(('.jpg'))
        ]
    )

    if not frame_files:
        print("No frames found to index.")
        return

    print(
        f"Found {len(frame_files)} frames to index. This may take a moment..."
    )

    # Generate embeddings for each frame
    embeddings = model.encode(
        [Image.open(f) for f in frame_files],
        batch_size=16,
        convert_to_tensor=True,
        show_progress_bar=True
    )

    # Create a FAISS index
    embedding_dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(embedding_dim)
    index.add(embeddings.cpu().numpy())

    # Save the index and the mapping of frame file names
    faiss.write_index(index, index_file)
    with open(frame_map_file, 'w') as f:
        for item in frame_files:
            f.write(f"{item}\n")

    print(f"Done! Index with {index.ntotal} vectors saved to '{index_file}'.")


# --- Run the script ---
if __name__ == "__main__":
    if extract_frames(VIDEO_PATH, OUTPUT_FOLDER, FRAME_RATE):
        create_index(OUTPUT_FOLDER, INDEX_FILE, FRAME_MAP_FILE)
