import cv2
import time

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
if not cap.isOpened():
    print("Cannot open camera")
else:
    time.sleep(2)  # Wait 2 seconds for camera to adjust
    ret, frame = cap.read()
    if ret:
        cv2.imwrite("test_capture.png", frame)
        print("Captured image saved as test_capture.png")
    else:
        print("Failed to read frame")
cap.release()
