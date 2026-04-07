🎭 Hasmukh — The Global Laughter Engine
Hasmukh is a premium, AI-powered multilingual joke platform built to bridge cultural gaps through humor.
It combines a high-performance Next.js 14 frontend with a sophisticated recursive no-repeat engine and Google Gemini AI for real-time cultural context.

🚀 Key Features
Infinite Engine: Dynamic fetching with a custom recursive logic filter to ensure users never see the same joke twice in a session.
Smart Explainer: Integrated Google Gemini 1.5 Flash API to explain regional puns and cultural nuances in real-time.
Premium SaaS UI: Modern Glassmorphism design using Tailwind CSS with "Aura" lighting and fluid transitions.
Multilingual Support: Native support for English, Hindi, Marathi, Tamil, Telugu, and Malayalam.
Cinematic UX: Custom SVG splash screens and high-fidelity "hand-drawn" transitions.

📂 Project Structure
├── src/
│   ├── app/            # Next.js App Router (Pages & API Routes)
│   ├── components/     # Reusable UI (Splash, Card, Explainer)
│   ├── lib/            # Core logic (Fetch Engine, AI Utils)
│   └── data/           # Local joke repository & Type definitions
├── public/             # Static assets & SVG animations
└── next.config.mjs     # Build & optimization settings

⚙️ Installation & Setup
1.Clone the repository:
git clone https://github.com/NehaPatil2610/Hasmukh--Random-Joke-Generator.git

2.Install dependencies:
npm install

3.Run Development Server:
npm run dev

🛡️ Deployment
This project is optimized for Vercel.
CI/CD: Automatically deploys on every push to the master or main branch.
Build Command: npm run build
Type Safety: Built with strict TypeScript checks to ensure production stability.
