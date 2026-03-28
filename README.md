# Devynix AI

Devynix AI is a full-stack code review workspace with a React/Vite frontend and an Express backend. It lets users paste code into a Monaco-powered editor, run AI analysis through one or more configured providers, review structured issues and improvements, and apply suggested replacements directly in the editor.

## What the project currently does

- Provides a cyber-terminal style code analysis UI with Monaco Editor.
- Supports multiple selectable languages in the editor: JavaScript, TypeScript, Python, Rust, Go, Java, C++, and C#.
- Calls a backend API that returns structured JSON with:
  - a short explanation of the code
  - detected bugs or risks
  - suggested improvements
  - ready-to-apply replacement snippets when the model can provide them
- Rotates across configured AI providers and falls back when one provider or model fails.
- Includes auth-themed UI pages for sign-in, sign-up, password reset, and verification flows.

## Current implementation notes

- The analyzer workspace is the main production-ready flow in the repo today.
- The auth pages are present as UI scaffolds and route targets, but they are not backed by a server-side auth system yet.
- The backend exposes both `/api/analyze` and `/api/fix`. The current client primarily uses `/api/analyze` and applies returned replacements locally in the editor.

## Tech stack

- Client: React 19, Vite 8, React Router 7, Tailwind CSS 4, Monaco Editor
- Server: Node.js, Express 5, OpenAI SDK, Google Generative AI SDK, CORS, dotenv
- AI providers supported by the backend:
  - GitHub Models
  - Groq
  - Gemini
  - OpenRouter

## Project structure

```text
client/
  public/
  src/
    app/
    common/
    features/
      auth/
      home/
    router/
    style/
server/
  src/
    services/
  server.js
```

## Getting started

### 1. Install dependencies

```bash
cd server
npm install
```

```bash
cd client
npm install
```

### 2. Configure environment variables

Create `server/.env` with at least one provider key:

```env
PORT=5000

GITHUB_TOKEN=
GROQ_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=

AI_MODELS_PER_PROVIDER=2
AI_PROVIDER_TIMEOUT_MS=8000
```

Create `client/.env` if you want to override the defaults:

```env
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT_MS=90000
```

### 3. Start the app

Run the backend:

```bash
cd server
npm start
```

Run the frontend in a second terminal:

```bash
cd client
npm run dev
```

The client expects the API at `http://localhost:5000/api` unless `VITE_API_URL` is overridden.

## API surface

### `GET /api/health`

Returns service health, timestamp, and configured provider names.

### `POST /api/analyze`

Accepts:

```json
{
  "code": "string",
  "language": "string"
}
```

Returns structured analysis JSON used by the frontend output panel.

### `POST /api/fix`

Accepts:

```json
{
  "code": "string",
  "language": "string",
  "issue": "string",
  "snippet": "string"
}
```

Returns a fixed snippet or corrected file content, depending on the request context.

## Available scripts

### Client

- `npm run dev` - start the Vite dev server
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm run preview` - preview the built frontend

### Server

- `npm start` - run the Express server with `node --watch`

## Known gaps worth addressing next

- Add a client-side service for `/api/fix` if you want server-driven fix application instead of local replacement only.
- Add automated tests for the API validation and snippet replacement behavior.
- Add deployment-specific settings such as production CORS configuration and public origin values for OpenRouter headers.

## License

This repository is licensed under the ISC License. See [LICENSE](./LICENSE).
