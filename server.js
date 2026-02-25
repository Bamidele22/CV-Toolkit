const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fetch   = require('node-fetch');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const CV_PROFILE = `
Name: Ayodeji Bamidele
Role: DevOps Engineer
Experience: 3+ years
Location: Lagos, Nigeria

Current Summary:
Results-driven DevOps Engineer with 3+ years of experience designing, deploying, and optimizing cloud-native infrastructure at scale. Proven track record of reducing infrastructure costs, improving deployment velocity, and driving system reliability across distributed environments. Skilled in Kubernetes, Docker, CI/CD automation, and cloud platforms (AWS, GCP, Azure). Experienced collaborating cross-functionally in agile teams to align engineering solutions with business objectives.

Key Experience & Achievements:
- Homlify (Jan 2025 – Jun 2025): Reduced EC2 costs by 40% via Instance Scheduler. Integrated SonarQube with GitHub for code quality. Migrated 5 repos and CI/CD pipelines from Bamboo to GitLab.
- Xapic Technologies (Feb 2023 – Dec 2024): Led team of 2 to deploy scalable microservices API on AWS EC2 with 99.9% uptime. Optimised Docker images by 80% with multi-stage builds, cutting deployment time by 60%. Built Prometheus + Thanos + Grafana observability stack.
- Mitu AI (Aug 2022 – Jan 2023): Kubernetes troubleshooting, Kyverno policy enforcement, Istio/Tetrate zero-trust networking.

Skills: AWS, GCP, Azure, Docker, Kubernetes, Helm, Kyverno, Istio, GitHub Actions, Jenkins, GitLab CI, Terraform, Ansible, Prometheus, Thanos, Grafana, New Relic, SonarQube, Bash, Python, JavaScript.

Certifications: KCNA (May 2025), Kubernetes and Cloud Native Essentials (May 2025), AWS Cloud Practitioner (May 2024).
`.trim();

app.post('/api/tailor', async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription || jobDescription.trim().length < 80) {
    return res.status(400).json({ error: 'Job description is too short or missing.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not set in your .env file.' });
  }

  const prompt = `You are a professional CV writer helping a DevOps Engineer tailor their CV summary for a specific job.

Here is the candidate's profile:
${CV_PROFILE}

Here is the job description they are applying to:
${jobDescription}

Your task:
1. Write a tailored professional summary (3-4 sentences, ~80-100 words) that:
   - Mirrors the exact language and keywords from the job description
   - Stays 100% truthful to the candidate's real experience above
   - Reads naturally — not like a keyword dump
   - Positions the candidate as an ideal fit for THIS specific role
   - Uses an active, confident tone

2. List 5-10 key phrases/terms you pulled from the JD and wove into the summary.

Format your response EXACTLY like this — no extra text:
SUMMARY:
[the tailored summary text]

KEYWORDS:
[keyword1, keyword2, keyword3, ...]`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
      }),
    });

    if (!apiResponse.ok) {
      const errBody = await apiResponse.text();
      console.error('Gemini API error:', errBody);
      return res.status(502).json({ error: 'Gemini API returned an error. Check your API key.' });
    }

    const data = await apiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const summaryMatch  = text.match(/SUMMARY:\s*([\s\S]*?)(?:\n\nKEYWORDS:|$)/i);
    const keywordsMatch = text.match(/KEYWORDS:\s*([\s\S]*?)$/i);

    if (!summaryMatch) {
      return res.status(500).json({ error: 'Could not parse the model response. Please try again.' });
    }

    const summary  = summaryMatch[1].trim();
    const keywords = keywordsMatch
      ? keywordsMatch[1].trim().split(',').map(k => k.trim()).filter(Boolean)
      : [];

    return res.json({ summary, keywords });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅  CV Tailor running at http://localhost:${PORT}`);
});
