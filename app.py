from flask import Flask, render_template, request, jsonify
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)

analyzer = SentimentIntensityAnalyzer()

def analyze_text(text):
    # VADER analysis
    vader_scores = analyzer.polarity_scores(text)
    compound = vader_scores['compound']

    # TextBlob analysis
    blob = TextBlob(text)
    polarity    = round(blob.sentiment.polarity, 2)
    subjectivity = round(blob.sentiment.subjectivity, 2)

    # Determine sentiment label
    if compound >= 0.05:
        sentiment = 'Positive'
    elif compound <= -0.05:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'

    return {
        'sentiment':     sentiment,
        'compound':      round(compound, 2),
        'polarity':      polarity,
        'subjectivity':  subjectivity,
        'positive':      round(vader_scores['pos'] * 100, 1),
        'negative':      round(vader_scores['neg'] * 100, 1),
        'neutral':       round(vader_scores['neu'] * 100, 1),
    }

# ── ROUTES ──
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '').strip()

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    result = analyze_text(text)
    return jsonify(result)

@app.route('/analyze-multiple', methods=['POST'])
def analyze_multiple():
    data = request.get_json()
    texts = data.get('texts', [])

    if not texts:
        return jsonify({'error': 'No texts provided'}), 400

    results = []
    for text in texts:
        if text.strip():
            result = analyze_text(text)
            result['text'] = text[:80] + '...' if len(text) > 80 else text
            results.append(result)

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)