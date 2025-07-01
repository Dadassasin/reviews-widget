# sentiment_service.py
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from predict import predict_emotion, predict_sentiment

app = FastAPI()


class TextPayload(BaseModel):
    texts: list[str]


@app.post("/analyze")
async def analyze(payload: TextPayload):
    # передаём список текстов сразу
    em_results = predict_emotion(payload.texts, model_dir="./models/emotion_predict", thresholds_path="thresholds.json")
    sent_results = predict_sentiment(payload.texts, model_dir="./models/sentiment_predict")
    # объединим парами
    combined = []
    for emo, sent in zip(em_results, sent_results):
        combined.append({**emo, **sent})
    return {"results": combined}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9000)
