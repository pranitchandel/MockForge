import path from "path";
import { fileURLToPath } from "url";

// Get current directory and resolve root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, "..");

// Folder paths
export const UI_PUBLIC_DIR = path.join(ROOT_DIR, "mockforge-ui", "public");
export const SCRIPTS_DIR = path.join(ROOT_DIR, "scripts");
export const BACKEND_DATA_DIR = path.join(ROOT_DIR, "backend-data");

// File paths
export const paths = {
  // Directories
  ROOT_DIR,
  UI_PUBLIC_DIR,
  SCRIPTS_DIR,
  BACKEND_DATA_DIR,

  // Scripts
  GENERATE_DATA_SCRIPT: path.join(SCRIPTS_DIR, "generateData.js"),
  EXTRACT_SCHEMA_SCRIPT: path.join(SCRIPTS_DIR, "extractSchema.js"),

  // Backend data (used internally)
  INPUT_JSON: path.join(BACKEND_DATA_DIR, "input.json"),

  // UI-facing mock data
  RULES_JSON: path.join(UI_PUBLIC_DIR, "rules.json"),
  MOCK_DATA_JSON: path.join(UI_PUBLIC_DIR, "mockdata.json"),

  // API endpoints
  STORE_RESPONSE_ENDPOINT: "http://localhost:4000/store-response",
  UPDATE_RULES_ENDPOINT: "http://localhost:4000/update-rules",
};
