import cv2
import numpy as np

def auto_scan_document(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Step 1: Apply Gaussian blur and edge detection
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)

    # Step 2: Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

    # Step 3: Sort by area and filter based on shape
    height, width = gray.shape
    image_area = height * width

    best_candidate = None
    best_score = -1

    for cnt in contours:
        # Approximate contour to polygon
        epsilon = 0.02 * cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, epsilon, True)

        if len(approx) == 4 and cv2.isContourConvex(approx):
            area = cv2.contourArea(approx)

            # Ignore very small or too large contours
            if area < 0.05 * image_area or area > 0.95 * image_area:
                continue

            # Compute aspect ratio
            x, y, w, h = cv2.boundingRect(approx)
            aspect_ratio = float(w) / h if h > 0 else 0

            # Penalize distorted shapes — ideal is 1:1 (QR-like) or 3:4 (A4-like)
            target_ratio = 1.0  # You can tweak this to 1.3 or so if you're scanning A4s
            ratio_score = 1.0 - abs(aspect_ratio - target_ratio)

            # Combine with area score
            score = ratio_score * area

            if score > best_score:
                best_candidate = approx
                best_score = score

    if best_candidate is None:
        return None

    # Step 4: Apply perspective transform
    pts = best_candidate.reshape(4, 2)
    rect = order_points(pts)
    (tl, tr, br, bl) = rect

    # Compute new width and height
    widthA = np.linalg.norm(br - bl)
    widthB = np.linalg.norm(tr - tl)
    maxWidth = max(int(widthA), int(widthB))

    heightA = np.linalg.norm(tr - br)
    heightB = np.linalg.norm(tl - bl)
    maxHeight = max(int(heightA), int(heightB))

    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]
    ], dtype="float32")

    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))

    return warped


def order_points(pts):
    """Return consistent top-left, top-right, bottom-right, bottom-left order"""
    rect = np.zeros((4, 2), dtype="float32")

    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]  # Top-left
    rect[2] = pts[np.argmax(s)]  # Bottom-right

    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]  # Top-right
    rect[3] = pts[np.argmax(diff)]  # Bottom-left

    return rect
