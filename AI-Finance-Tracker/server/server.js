import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

console.log("Gemini API key loaded:", !!process.env.GEMINI_API_KEY);

const port = Number(process.env.PORT) || 5000;

connectDatabase();

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});