import faiss
from sentence_transformers import SentenceTransformer
from PIL import Image
import sys

# --- Configuration ---
INDEX_FILE = "video_index.faiss"
FRAME_MAP_FILE = "frame_map.txt"
TOP_K = 3


# --- Load AI Model ---
print("Loading AI model...")
model = SentenceTransformer('clip-ViT-B-32')


# --- Main Search Logic ---
def search(query_image_path):
    # Load the FAISS index and frame map
    try:
        index = faiss.read_index(INDEX_FILE)
        with open(FRAME_MAP_FILE, 'r') as f:
            frame_map = [line.strip() for line in f.readlines()]
    except Exception as e:
        print(f"Error loading index files: {e}")
        print(
            "Please make sure you have run 'main.py' to create the index."
        )
        return

    # Load and preprocess the query image
    print(f"Processing query image: {query_image_path}")
    query_image = Image.open(query_image_path)
    query_embedding = model.encode(
        [query_image], convert_to_tensor=True, show_progress_bar=False
    )

    # Perform the search
    print(f"Searching for the top {TOP_K} most similar frames...")
    distances, indices = index.search(query_embedding.cpu().numpy(), TOP_K)

    # Print the results
    print("\n--- Search Results ---")
    for i, idx in enumerate(indices[0]):
        distance = distances[0][i]
        filename = frame_map[idx]
        print(
            (
                f"Rank {i+1}: Match found in frame '{filename}' "
                f"(Distance: {distance:.4f})"
            )
        )


# --- Run the script from the command line ---
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python search.py <query_image_path>")
    else:
        query_image_path = sys.argv[1]
        search(query_image_path)
