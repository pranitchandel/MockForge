import { runScript } from "./utils.js";
import { paths } from "../config/paths.js";

// ✅ Wrap execution logic inside an async function
export const processFiles = async ({
  inputUpdated = false,
  rulesUpdated = false,
}) => {
  try {
    if (inputUpdated) {
      console.log(
        "🔄 Detected update in input.json. Generating rules and mock data..."
      );
      await runScript(paths.EXTRACT_SCHEMA_SCRIPT);
      await runScript(paths.GENERATE_DATA_SCRIPT);
    } else if (rulesUpdated) {
      console.log(
        "🔄 Detected manual update in rules.json. Generating mock data..."
      );
      await runScript(paths.GENERATE_DATA_SCRIPT);
    } else {
      console.log("⚠️ No updates detected. Skipping script execution.");
    }
  } catch (error) {
    console.error("❌ Error in index.js:", error);
  }
};
