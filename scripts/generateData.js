import fs from "fs";
import { UI_PUBLIC_DIR, paths } from "../config/paths.js";
import { generateFakeData } from "./utils.js";

// Ensure UI public folder exists
if (!fs.existsSync(UI_PUBLIC_DIR)) {
  fs.mkdirSync(UI_PUBLIC_DIR, { recursive: true });
}

// Ensure rules.json exists
if (!fs.existsSync(paths.RULES_JSON)) {
  console.error(`❌ Error: ${paths.RULES_JSON} not found. Run extractSchema.js first.`);
  process.exit(1);
}

// Load rules.json and generate mock data
const rules = JSON.parse(fs.readFileSync(paths.RULES_JSON, "utf-8"));
const mockData = generateFakeData(rules);

// Save generated mock data
fs.writeFileSync(paths.MOCK_DATA_JSON, JSON.stringify(mockData, null, 2), "utf-8");

console.log(`✅ Mock data generated successfully: ${paths.MOCK_DATA_JSON}`);