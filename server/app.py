from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_input = request.json["content"]
        stream = ollama.chat(
            model="mistral",
            messages=[{"role": "user", "content": user_input}],
            stream=True,
        )

        full_response = ""
        for chunk in stream:
            if "content" in chunk["message"]:
                print(chunk["message"]["content"], end="", flush=True)
                full_response += chunk["message"]["content"]

        return full_response, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
