import fs from "fs";
import { runScript } from "./utils.js";
import { paths } from "../config/paths.js";

export const echoToMockForge = async ({
  responseData,
  enabled = true,
  forceRefresh = false,
}) => {
  // If not enabled, return actual response (if valid)
  if (!enabled) {
    if (responseData && typeof responseData === "object") {
      console.log("⚡ Skipping MockForge processing, sending actual response.");
      return responseData;
    } else {
      console.error("❌ Invalid responseData. Unable to send actual response.");
      return null;
    }
  }

  try {
    if (forceRefresh) {
      console.log(
        "🔁 Force refresh enabled. Calling API to update mock data..."
      );

      const res = await fetch(paths.STORE_RESPONSE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseData),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("❌ Failed to store API response:", error);
        return responseData; // Fallback to actual response if storing fails
      }

      console.log("✅ API response stored. Returning updated mock data.");
    } else {
      console.log("⚙️ Generating fresh mock data using script...");
      await runScript(paths.GENERATE_DATA_SCRIPT);
      console.log("✅ Mock data generated successfully.");
    }
    const mockData = await fs.promises.readFile(paths.MOCK_DATA_JSON, "utf-8");
    return JSON.parse(mockData);
  } catch (err) {
    console.error("❌ Error in echoToMockForge:", err.message);
    return responseData; // Fallback to actual response if anything goes wrong
  }
};
