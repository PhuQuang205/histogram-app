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
async def histogram_log(file: UploadFile = File(...)):
    contents = await file.read()
    img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_GRAYSCALE)
    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image file"})

    original_hist = calc_hist(img)

    # log transform
    c = 255 / np.log1p(np.max(img))
    log_img = c * np.log1p(img.astype(np.float32))
    log_img = log_img.astype(np.uint8)  # ✅ tránh cảnh báo Pylance

    processed_hist = calc_hist(log_img)

    return {
        "originalHistogram": original_hist,
        "processedHistogram": processed_hist,
        "processedImage": encode_image_to_base64(log_img),
    }

@app.post("/histogram-matching/")
async def histogram_matching(
    file: UploadFile = File(...),        # FE gửi "file"
    reference: UploadFile = File(...),   # FE gửi "reference"
):
    """
    Histogram Matching: 
    - file: ảnh gốc (source)
    - reference: ảnh tham chiếu
    """

    source_data = await file.read()
    ref_data = await reference.read()

    src = cv2.imdecode(np.frombuffer(source_data, np.uint8), cv2.IMREAD_GRAYSCALE)
    ref = cv2.imdecode(np.frombuffer(ref_data, np.uint8), cv2.IMREAD_GRAYSCALE)

    if src is None or ref is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image file"})

    # --- B1: Histogram và CDF ---
    src_hist = cv2.calcHist([src], [0], None, [256], [0, 256]).flatten()
    ref_hist = cv2.calcHist([ref], [0], None, [256], [0, 256]).flatten()

    src_cdf = np.cumsum(src_hist) / np.sum(src_hist)
    ref_cdf = np.cumsum(ref_hist) / np.sum(ref_hist)

    # --- B2: Tạo mapping từ src -> ref ---
    mapping = np.zeros(256, dtype=np.uint8)
    ref_values = np.arange(256)
    for i in range(256):
        j = np.argmin(np.abs(ref_cdf - src_cdf[i]))
        mapping[i] = ref_values[j]

    # --- B3: Ánh xạ giá trị mức xám ---
    matched = mapping[src.astype(np.uint8)]

    matched_hist = cv2.calcHist([matched], [0], None, [256], [0, 256]).flatten().astype(int).tolist()

    return {
        "originalHistogram": src_hist.astype(int).tolist(),
        "referenceHistogram": ref_hist.astype(int).tolist(),
        "processedHistogram": matched_hist,
        "processedImage": encode_image_to_base64(matched),
    }




# @app.post("/histogram-threshold/")
# async def histogram_threshold(file: UploadFile = File(...), threshold: int = Form(128)):
#     """
#     Thresholding: cắt ảnh theo mức ngưỡng
#     - threshold: giá trị 0-255
#     """
#     contents = await file.read()
#     np_arr = np.frombuffer(contents, np.uint8)
#     img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)

#     if img is None:
#         return JSONResponse(status_code=400, content={"error": "Invalid image file"})

#     _, thresh_img = cv2.threshold(img, threshold, 255, cv2.THRESH_BINARY)

#     return {
#         "processedImage": encode_image_to_base64(thresh_img),
#     }


@app.post("/histogram-slicing/")
async def histogram_slicing(
    file: UploadFile = File(...),
    a: int = Form(...),   # ngưỡng dưới
    b: int = Form(...),   # ngưỡng trên
    keep_background: bool = Form(False)  # True = giữ nền, False = không giữ nền
):
    """
    Gray-level slicing (cắt theo mức xám):
    - a, b: ngưỡng dưới và ngưỡng trên (0–255)
    - keep_background:
        + False: ngoài khoảng [a, b] gán về 0 (đen)
        + True: ngoài khoảng [a, b] giữ nguyên giá trị gốc
    """

    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)

    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image file"})

    if keep_background:
        # Giữ nền: copy ảnh gốc, vùng [a, b] -> 255
        sliced_img = img.copy()
        sliced_img[(img >= a) & (img <= b)] = 255
    else:
        # Không giữ nền: vùng [a, b] -> 255, ngoài [a, b] -> 0
        sliced_img = np.zeros_like(img)
        sliced_img[(img >= a) & (img <= b)] = 255

    # Tính histogram
    original_hist = cv2.calcHist([img], [0], None, [256], [0, 256]).flatten().astype(int).tolist()
    processed_hist = cv2.calcHist([sliced_img], [0], None, [256], [0, 256]).flatten().astype(int).tolist()

    return {
        "processedImage": encode_image_to_base64(sliced_img),
        "originalHistogram": original_hist,
        "processedHistogram": processed_hist,
    }
