import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { processFiles } from "./scripts/index.js";
import { paths } from "./config/paths.js";


const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// ✅ Ensure necessary files exist
const ensureFileExists = async (filePath, defaultContent = "{}") => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    await fs.promises.writeFile(filePath, defaultContent, "utf-8");
    console.log(`📄 Created missing file: ${filePath}`);
  }
};

// 📌 API to store API response (`input.json`)
app.post("/store-response", async (req, res) => {
  try {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Invalid or empty request body." });
    }

    await fs.promises.writeFile(paths.INPUT_JSON, JSON.stringify(data, null, 2), "utf-8");

    console.log("✅ API response stored successfully.");

    // ✅ Call `processFiles()` to generate rules & mock data
    await processFiles({ inputUpdated: true });

    res.json({ message: "API response stored and processed successfully." });
  } catch (error) {
    console.error("❌ Error storing API response:", error);
    res.status(500).json({ error: "Failed to store response." });
  }
});

// 📌 API to update `rules.json`
app.put("/update-rules", async (req, res) => {
  try {
    const newRules = req.body;
    console.log("🔹 Updating rules.json:", newRules);

    if (!newRules || Object.keys(newRules).length === 0) {
      return res.status(400).json({ error: "Invalid or empty rules JSON." });
    }

    await ensureFileExists(paths.RULES_JSON);

    // ✅ Write the updated rules to the file
    await fs.promises.writeFile(paths.RULES_JSON, JSON.stringify(newRules, null, 2), "utf-8");
    console.log("✅ Rules updated successfully.");

    // ✅ Call `processFiles()` to regenerate mockData
    await processFiles({ rulesUpdated: true });

    res.json({ message: "Rules updated and mock data regenerated successfully." });
  } catch (error) {
    console.error("❌ Error updating rules.json:", error);
    res.status(500).json({ error: "Failed to update rules." });
  }
});

// 📌 Health check API
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running 🚀" });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
