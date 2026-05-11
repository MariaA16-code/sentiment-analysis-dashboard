// ── ANALYZE SINGLE TEXT ──
function analyzeSingle() {
  const text = document.getElementById('inputText').value.trim();

  if (!text) {
    alert('Please enter some text first.');
    return;
  }

  fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
  .then(res => res.json())
  .then(data => {
    showResult(data);
  });
}

// ── SHOW SINGLE RESULT ──
function showResult(data) {
  const card = document.getElementById('resultCard');
  card.style.display = 'block';

  // Badge
  const badge = document.getElementById('sentimentBadge');
  badge.textContent = data.sentiment === 'Positive' ? '😊 Positive'
                    : data.sentiment === 'Negative' ? '😞 Negative'
                    : '😐 Neutral';
  badge.className = 'sentiment-badge';
  badge.classList.add(
    data.sentiment === 'Positive' ? 'badge-positive'
    : data.sentiment === 'Negative' ? 'badge-negative'
    : 'badge-neutral'
  );

  // Scores
  document.getElementById('compound').textContent    = data.compound;
  document.getElementById('polarity').textContent    = data.polarity;
  document.getElementById('subjectivity').textContent = data.subjectivity;

  // Bars
  document.getElementById('posBar').style.width = data.positive + '%';
  document.getElementById('neuBar').style.width = data.neutral  + '%';
  document.getElementById('negBar').style.width = data.negative + '%';

  document.getElementById('posVal').textContent = data.positive + '%';
  document.getElementById('neuVal').textContent = data.neutral  + '%';
  document.getElementById('negVal').textContent = data.negative + '%';

  // Scroll to result
  card.scrollIntoView({ behavior: 'smooth' });
}

// ── ANALYZE MULTIPLE TEXTS ──
function analyzeMultiple() {
  const raw   = document.getElementById('multiText').value.trim();
  const texts = raw.split('\n').filter(t => t.trim() !== '');

  if (texts.length === 0) {
    alert('Please enter at least one line of text.');
    return;
  }

  fetch('/analyze-multiple', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts })
  })
  .then(res => res.json())
  .then(data => {
    showMultipleResults(data);
  });
}

// ── SHOW MULTIPLE RESULTS ──
function showMultipleResults(results) {
  const card = document.getElementById('multiResultCard');
  const container = document.getElementById('multiResults');

  card.style.display = 'block';
  container.innerHTML = '';

  results.forEach(item => {
    const color = item.sentiment === 'Positive' ? '#34d399'
                : item.sentiment === 'Negative' ? '#f87171'
                : '#fbbf24';

    const div = document.createElement('div');
    div.className = 'multi-item';
    div.innerHTML = `
      <span class="multi-text">${item.text}</span>
      <span class="multi-badge" style="
        background: ${color}22;
        border: 1px solid ${color}55;
        color: ${color};
      ">${item.sentiment}</span>
    `;
    container.appendChild(div);
  });

  card.scrollIntoView({ behavior: 'smooth' });
}