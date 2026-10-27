import numpy as np
import cv2
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from insightface.app import FaceAnalysis

app = FastAPI()
POSE = {
    "front": lambda yaw: abs(yaw) <= 15,
    "left": lambda yaw: 20 <= yaw <= 90,
    "right": lambda yaw: -90 <= yaw <= -20,
    "any": lambda yaw: abs(yaw) <= 45
}

fa = FaceAnalysis(
    name="buffalo_l",
    allowed_modules=["detection", "landmark_3d_68", "recognition"],
    providers=["CPUExecutionProvider"],
)
fa.prepare(ctx_id=1, det_size=(640, 640))


@app.post("/embed")
def embed(image: UploadFile = File(...), angle: str = Form("front")):
    data = np.frombuffer(image.file.read(), np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(400, "Imagem inválida ou não suportada.")

    faces = fa.get(img)
    if len(faces) == 0:
        raise HTTPException(404, "Nenhum rosto detectado na imagem.")
    if len(faces) > 1:
        raise HTTPException(400, "Mais de um rosto detectado na imagem.")

    f = faces[0]
    pitch, yaw, roll = [float(x) for x in f.pose]

    if float(f.det_score) < 0.6:
        raise HTTPException(400, "Rosto detectado com baixa confiança.")
    if abs(pitch) > 25:
        raise HTTPException(400, "Mantenha a cabeça alinhada.")
    if not POSE[angle](yaw):
        raise HTTPException(400, f"Ângulo incorreto (yaw: {yaw:.1f}°). Por favor, ajuste a posição da cabeça.")

    return {
        "embedding": f.normed_embedding.tolist(),
        "yaw": yaw,
        "pitch": pitch,
        "det_score": float(f.det_score),
        "model_ver": "buffalo_l",
    }