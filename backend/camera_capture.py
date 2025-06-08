# camera_capture.py
import cv2
import time
from PIL import Image
import io
from fastapi.responses import StreamingResponse

def capture_high_res_image():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

    if not cap.isOpened():
        raise IOError("Cannot access camera.")

    time.sleep(2)  # Let camera adjust lighting/focus

    ret, frame = cap.read()
    cap.release()

    if not ret:
        raise ValueError("Failed to capture image.")

    rgb_image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb_image)

    # Prepare image for response
    buffer = io.BytesIO()
    pil_img.save(buffer, format='PNG')
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="image/png")
