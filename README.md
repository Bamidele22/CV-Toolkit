# CV-Toolkit
Tailor your summary to any job description.

This is a personal web tool that rewrites your CV summary to mirror the exact language of any job description — powered by Google Gemini AI.

No more manually rewriting your summary for every application. Paste the job description, get a tailored summary in seconds.

---
## How It Works

1. Paste a job description into the text area
2. Click **"Tailor my summary"**
3. The app sends your CV profile + the JD to Gemini AI
4. Gemini rewrites your summary to mirror the JD's language — truthfully .
5. Matched keywords are highlighted so you can see what was pulled in
6. Copy the result straight into your CV

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express |
| AI | Google Gemini 2.0 Flash |
| Environment | dotenv |

---

## Project Structure

```
CV-Toolkit/
├── public/
│   ├── index.html        # Main page
│   ├── css/
│   │   └── styles.css    # All styles
│   └── js/
│       └── app.js        # Frontend logic
├── server.js             # Express backend + Gemini API call
├── package.json
├── .env                  # API key (never committed)
└── .gitignore
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A free [Google Gemini API key](https://aistudio.google.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/cv-toolkit.git
cd cv-toolkit
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up your environment variable**

Create a `.env` file in the root folder:

```
GEMINI_API_KEY=your_api_key_here
```

Get your free API key at [aistudio.google.com](https://aistudio.google.com/) → Get API Key → Create API Key.

**4. Start the server**

```bash
npm start
```

**5. Open in your browser**

```
http://localhost:3000
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `PORT` | Server port (optional, defaults to 3000) |

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the production server |
| `npm run dev` | Start with auto-reload (nodemon) |

---

## Security

- The Gemini API key is stored in `.env` and never exposed to the browser
- All AI requests are proxied through the Express backend
- `.env` and `node_modules` are excluded from version control via `.gitignore`

---

## Author

**Ayodeji Bamidele**
- LinkedIn: [Ayodeji Bamidele](https://linkedin.com/in/ayodeji-bamidele)
- GitHub: [@Bamidele22](https://github.com/Bamidele22)

---

## License

This project is for personal use.


