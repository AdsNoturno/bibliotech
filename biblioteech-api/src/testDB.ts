// src/testDB.ts
import dotenv from "dotenv";
dotenv.config(); // <- importante!

import { connectDB } from "./config/database";

(async () => {
  await connectDB();
  console.log("✅ Conexão com MongoDB OK!");
  process.exit(0);
})();
