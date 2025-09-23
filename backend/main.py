from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import base64

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def encode_image_to_base64(image: np.ndarray) -> str:
    """Chuyển ảnh numpy thành base64 để trả về frontend."""
    _, buffer = cv2.imencode(".png", image)
    return f"data:image/png;base64,{base64.b64encode(buffer.tobytes()).decode('utf-8')}"

def calc_hist(img: np.ndarray) -> list:
    """Tính histogram của ảnh grayscale."""
    return cv2.calcHist([img], [0], None, [256], [0, 256]).flatten().astype(int).tolist()


@app.post("/histogram-equalization/")
async def histogram_equalization(file: UploadFile = File(...)):
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)

    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image file"})

    # Histogram gốc
    original_hist = cv2.calcHist([img], [0], None, [256], [0, 256]).flatten().astype(int).tolist()

    # Equalization toàn cục
    equalized_img = cv2.equalizeHist(img)

    processed_hist = cv2.calcHist([equalized_img], [0], None, [256], [0, 256]).flatten().astype(int).tolist()

    return {
        "originalHistogram": original_hist,
        "processedHistogram": processed_hist,
        "processedImage": encode_image_to_base64(equalized_img),
    }


@app.post("/histogram-log/")
async def histogram_log(file: UploadFile = File(...), c: float = Form(1.0)):
    contents = await file.read()
    img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_GRAYSCALE)
    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image file"})

    original_hist = calc_hist(img)

    img_float = img.astype(np.float32)
    log_img = c * np.log1p(img_float)
    log_img = cv2.normalize(log_img, np.zeros_like(log_img, dtype=np.uint8), 0, 255, cv2.NORM_MINMAX, dtype=cv2.CV_8U)

    processed_hist = calc_hist(log_img)

    return {
        "originalHistogram": original_hist,
        "processedHistogram": processed_hist,
        "processedImage": encode_image_to_base64(log_img),
    }



@app.post("/histogram-matching/")
async def histogram_matching(
    source: UploadFile = File(...),
    reference: UploadFile = File(...)
):
    """
    Histogram Matching: cần 2 ảnh
    - source: ảnh cần biến đổi
    - reference: ảnh tham chiếu
    """
    source_data = await source.read()
    ref_data = await reference.read()

    src = cv2.imdecode(np.frombuffer(source_data, np.uint8), cv2.IMREAD_GRAYSCALE)
    ref = cv2.imdecode(np.frombuffer(ref_data, np.uint8), cv2.IMREAD_GRAYSCALE)

    if src is None or ref is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image file"})

    # Hàm matching
    matched = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(src)  # chỉ là ví dụ
    # Bạn có thể implement thuật toán matching chuẩn bằng scipy.stats hoặc numpy

    return {
        "processedImage": encode_image_to_base64(matched),
    }


@app.post("/histogram-threshold/")
async def histogram_threshold(file: UploadFile = File(...), threshold: int = Form(128)):
    """
    Thresholding: cắt ảnh theo mức ngưỡng
    - threshold: giá trị 0-255
    """
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)

    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image file"})

    _, thresh_img = cv2.threshold(img, threshold, 255, cv2.THRESH_BINARY)

    return {
        "processedImage": encode_image_to_base64(thresh_img),
    }
