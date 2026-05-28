# Greenbook Assistant

A black and white practice platform for aspiring quants. Browse every Green
Book problem, then open a conversation with an AI tutor that already knows the
problem and the reference solution.

## Stack

- Backend: Node + Express + TypeScript, SOLID layering, CSV loaded once into an
  in-memory hash map. AI streaming via `@ai-sdk/mistral`.
- Frontend: Vite + React + TypeScript, Tailwind CSS v4, shadcn/ui primitives,
  `@assistant-ui/react` for the chat UI, framer-motion for motion.
- No database. The CSV in `greenbook problems/` is the source of truth.

## Layout

```
backend/        Express API (SOLID: controllers, services, repositories, infra)
frontend/       Vite React app (landing, dashboard, per-problem chat)
greenbook problems/green_book_problems_rows.csv   The only data source
```

## First run

1. `cd backend && npm install`
2. Fill `backend/.env` with your `MISTRAL_API_KEY`.
3. `npm run dev`  (backend on http://localhost:4000)
4. In another terminal: `cd frontend && npm install`
5. `npx assistant-ui init`  (optional, pulls the latest chat primitives; the
   scaffolded Thread component is already compatible with `@assistant-ui/react`)
6. `npm run dev`  (frontend on http://localhost:5173)

## SOLID layout of the backend

- `domain/` pure types.
- `infrastructure/csv/` CSV parsing behind an interface (`ICsvParser`).
- `infrastructure/ai/` AI streaming behind `IAiService`; Mistral implementation.
- `repositories/` `IProblemRepository` + in-memory implementation that hydrates
  from the CSV at startup and indexes by id and category.
- `services/` `IProblemService` and `IChatService`, each with a single
  responsibility. `ChatService` builds the per-problem system prompt by
  composing the repository and the AI service.
- `controllers/` thin HTTP glue, no business logic.
- `routes/` pure wiring.
- `app.ts` composition root. `index.ts` bootstrap.

## API

- `GET /api/health`
- `GET /api/categories`
- `GET /api/problems`
- `GET /api/problems/:id`
- `POST /api/chat`  body: `{ problemId?: string, messages: [{role, content}] }`
  Streams Vercel AI SDK data-stream format. Consumed by `useChatRuntime` from
  `@assistant-ui/react-ai-sdk`.

## Notes

- The CSV has 130 problems across 16 categories (brain teasers, probability
  topics, stochastic calculus, options topics, fixed income, algorithms, etc).
- Each problem now also has a `hint_text`. The chat system prompt makes the hint
  available to the assistant but instructs it to use the hint only when the
  user is stuck.
- If you want a different model, set `MISTRAL_MODEL` in `backend/.env`
  (default `mistral-large-latest`).
