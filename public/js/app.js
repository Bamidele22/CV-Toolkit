const jdInput  = document.getElementById('jdInput');
const charCount = document.getElementById('charCount');

jdInput.addEventListener('input', () => {
  charCount.textContent = jdInput.value.length.toLocaleString();
});

async function tailorSummary() {
  const jd = jdInput.value.trim();

  if (!jd) {
    showError('Please paste a job description first.');
    return;
  }
  if (jd.length < 80) {
    showError('The job description seems too short. Please paste the full JD for best results.');
    return;
  }

  const btn      = document.getElementById('tailorBtn');
  const errorMsg = document.getElementById('errorMsg');

  errorMsg.classList.remove('visible');
  btn.classList.add('loading');
  btn.disabled = true;
  document.getElementById('resultSection').classList.remove('visible');

  try {
    const response = await fetch('/api/tailor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription: jd }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${response.status}`);
    }

    const { summary, keywords } = await response.json();

    document.getElementById('resultText').textContent = summary;

    const kwContainer = document.getElementById('keywordsContainer');
    kwContainer.innerHTML = '';
    keywords.forEach(kw => {
      const span = document.createElement('span');
      span.className = 'keyword';
      span.textContent = kw;
      kwContainer.appendChild(span);
    });

    document.getElementById('resultSection').classList.add('visible');
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (err) {
    showError('Something went wrong: ' + err.message);
  } finally {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

function copySummary() {
  const text = document.getElementById('resultText').textContent;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.classList.add('copied');
    btn.innerHTML = `
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M20 6L9 17l-5-5"/>
      </svg> Copied!`;

    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg> Copy`;
    }, 2000);
  });
}

function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.classList.add('visible');
}