import cv2
import os

# --- Configuration ---
VIDEO_PATH = "videos/test_video.mp4"
OUTPUT_FOLDER = "frames"
FRAME_RATE = 1


# --- Main Logic ---
def extract_frames(video_path, output_folder, frame_rate):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Open the video file
    video_capture = cv2.VideoCapture(video_path)

    # Get the video's frames per second (fps)
    fps = video_capture.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps / frame_rate)

    print(f"Video FPS: {fps}, saving one frame every {frame_interval} frames.")

    frame_count = 0
    saved_frame_count = 0

    # Loop through the video frames
    while True:
        # Read a single frame
        success, frame = video_capture.read()

        # If the frame was not read, we've reached the end of the video
        if not success:
            break

        # Save a frame at the specified interval
        if frame_count % frame_interval == 0:
            frame_filename = os.path.join(
                output_folder, f"frame_{saved_frame_count:04d}.jpg"
            )
            cv2.imwrite(frame_filename, frame)
            saved_frame_count += 1

        frame_count += 1

    # Release the video capture object
    video_capture.release()
    print(
        f"Done! Saved {saved_frame_count} frames to the "
        f"'{output_folder}' folder."
    )


# --- Run the script ---
if __name__ == "__main__":
    extract_frames(VIDEO_PATH, OUTPUT_FOLDER, FRAME_RATE)
