"""
FastAPI 서버 실행 스크립트
"""

import uvicorn
import os

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))

    print("=" * 60)
    print("🚀 Pet Disease Prediction API Server")
    print("=" * 60)
    print(f"📍 서버 주소: http://{host}:{port}")
    print(f"📚 API 문서: http://localhost:{port}/docs")
    print(f"🏥 Health Check: http://localhost:{port}/health")
    print("=" * 60)
    print("\n서버를 중지하려면 Ctrl+C를 누르세요.\n")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )