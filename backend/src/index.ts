import { createApp } from "./app.js";
import { loadEnv } from "./config/Env.js";

const env = loadEnv();
const app = createApp(env);

app.listen(env.PORT, () => {
  console.log(`Greenbook Assistant backend listening on :${env.PORT}`);
});
