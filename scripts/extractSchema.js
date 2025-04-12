import fs from "fs";
import { UI_PUBLIC_DIR, paths } from "../config/paths.js";

// Ensure UI public folder exists
if (!fs.existsSync(UI_PUBLIC_DIR)) {
  fs.mkdirSync(UI_PUBLIC_DIR, { recursive: true });
}

// Ensure `input.json` exists before reading
if (!fs.existsSync(paths.INPUT_JSON)) {
  console.error(`❌ Error: ${paths.INPUT_JSON} not found.`);
  process.exit(1);
}

// Ensure `rules.json` exists before writing
if (!fs.existsSync(paths.RULES_JSON)) {
  fs.writeFileSync(paths.RULES_JSON, "{}", "utf8");
}

// Function to infer schema rules
const inferRule = (key, value) => {
  if (typeof value === "number") {
    return {
      type: "number",
      minLength: value.toString().length,
      maxLength: value.toString().length + 2,
    };
  }

  if (typeof value === "string") {
    const minLength = Math.max(3, value.length);
    const maxLength = Math.min(minLength + 3, 255);

    if (
      value.match(/^\d{4}-\d{2}-\d{2}$/) ||
      value.match(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/)
    ) {
      return {
        type: "date",
        from: "2000-01-01", // Default lower bound
        to: "2099-12-31", // Default upper bound
      };
    }

    return { type: "string", minLength, maxLength };
  }

  if (typeof value === "boolean") {
    return { type: "boolean", minLength: 1, maxLength: 1 };
  }

  if (Array.isArray(value)) {
    if (value.length === 0)
      return { type: "array", minItems: 0, maxItems: 5, properties: {} }; // Empty array handling

    const firstItem = value[0]; // Use the first item to infer structure

    if (typeof firstItem === "object" && firstItem !== null) {
      return {
        type: "array",
        minItems: Math.max(1, value.length - 2),
        maxItems: value.length + 2,
        properties: extractSchema(firstItem), // Use first element to define properties
      };
    }

    return {
      type: "array",
      minItems: Math.max(1, value.length - 2),
      maxItems: value.length + 2,
      properties: inferRule(null, firstItem),
    };
  }

  if (typeof value === "object" && value !== null) {
    return {
      type: "object", // ✅ Mark it as an object
      properties: extractSchema(value), // ✅ Extract inner properties
    };
  }

  return { type: "string", minLength: 3, maxLength: 255 };
};

// Extract schema from JSON object
const extractSchema = (data) => {
  if (!data || typeof data !== "object") {
    console.error("❌ Invalid or empty input file.");
    return {};
  }

  const schema = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      schema[key] = inferRule(key, data[key]);
    }
  }
  return schema;
};

// Read input JSON and generate schema
fs.readFile(paths.INPUT_JSON, "utf8", (err, data) => {
  if (err) {
    console.error("❌ Error reading input file:", err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    if (Object.keys(jsonData).length === 0) {
      console.error("⚠️ Warning: Input file is empty.");
      return;
    }

    const schema = extractSchema(jsonData);

    fs.writeFile(
      paths.RULES_JSON,
      JSON.stringify(schema, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("❌ Error writing rules file:", err);
        } else {
          console.log(`✅ Schema extracted successfully! Check ${paths.RULES_JSON}`);
        }
      }
    );
  } catch (error) {
    console.error("❌ Invalid JSON format:", error);
  }
});
