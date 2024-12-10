from flask import Flask, request, jsonify
from utils import compute_similarity_score

app = Flask(__name__)

@app.route('/score', methods=['POST'])
def score():
    data = request.json
    resume = data['resume']
    job_desc = data['job_desc']

    # Compute similarity score
    score = compute_similarity_score(job_desc, resume)
    return jsonify({"score": round(score * 100, 2)})

if __name__ == '__main__':
    app.run(debug=True)
