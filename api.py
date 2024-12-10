from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

@app.route('/score', methods=['POST'])
def score():
    data = request.json
    job_desc = data['job_desc']
    resume = data['resume']

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([job_desc, resume])
    score = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

    return jsonify({"score": score})

if __name__ == '__main__':
    app.run(debug=True)
