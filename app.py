from flask import Flask, request, jsonify
import openai
import os
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()
# Load OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/solve_error", methods=["POST"])
def solve_error():
    data = request.json
    error_message = data.get("error", "")

    if not error_message:
        return jsonify({"error": "No error message provided"}), 400

    # Call OpenAI API to get a possible solution
    try:
        client = openai.OpenAI()  # New API format
        response = client.chat.completions.create(  # Updated API method
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful programming assistant."},
                {"role": "user", "content": f"Fix this programming error: {error_message}"}
            ]
        )
        solution = response.choices[0].message.content  # Corrected response parsing

    except Exception as e:
        return jsonify({"error": f"Failed to get solution: {str(e)}"}), 500

    return jsonify({"solution": solution})

if __name__ == "__main__":
    app.run(port=8000, debug=True)  # Run Flask API on port 8000
