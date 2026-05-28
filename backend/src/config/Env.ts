import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  MISTRAL_API_KEY: z.string().default(""),
  MISTRAL_MODEL: z.string().default("mistral-small-latest"),
  CSV_PATH: z.string().default("../greenbook problems/green_book_problems_rows.csv"),
});

export type Env = z.infer<typeof schema>;

export function loadEnv(): Env {
  return schema.parse(process.env);
}
