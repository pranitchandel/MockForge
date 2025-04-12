import { faker } from "@faker-js/faker";
import { exec } from "child_process";

export const generateFakeData = (rule) => {
  if (typeof rule === "object" && !rule.type) {
    return generateFakeObject(rule);
  }
  return generateFakeField(rule);
};

const generateFakeObject = (properties) => {

  if (!properties || typeof properties !== "object") {
    console.warn(`⚠️ Invalid object rule:`, properties);
    return {};
  }

  return Object.fromEntries(
    Object.entries(properties).map(([key, rule]) => [key, generateFakeField(rule)])
  );
};

const generateFakeField = (rule) => {
  if (!rule || typeof rule !== "object" || !rule.type) {
    console.warn(`⚠️ Invalid field rule:`, rule);
    return null;
  }

  switch (rule.type) {
    case "number":
      return faker.number.int({ min: rule.min || 1, max: rule.max || 1000 });

    case "string":
      return faker.lorem.words().slice(0, rule.maxLength || 20);

    case "email":
      return faker.internet.email();

    case "boolean":
      return faker.datatype.boolean();

      case "date":
        let fromDate = rule.from ? new Date(rule.from) : new Date("2000-01-01");
        let toDate = rule.to ? new Date(rule.to) : new Date("2099-12-31");
        console.log("date ",fromDate, toDate);
        if (isNaN(fromDate) || isNaN(toDate)) {
          console.error(`❌ Invalid date range:`, rule);
          return new Date().toISOString();
        }
  
        return faker.date.between({from :fromDate, to :toDate}).toISOString();


          case "array":
            if (!rule.properties) {
              console.warn(`⚠️ Invalid array rule:`, rule);
              return [];
            }
      
            const minItems = rule.minItems || 1;
            const maxItems = rule.maxItems || 5;
            const length = faker.number.int({ min: minItems, max: maxItems });
      
            return Array.from({ length }, () => generateFakeData(rule.properties));

    case "object":
      return generateFakeObject(rule.properties || {});

    default:
      console.warn(`⚠️ Unsupported rule type:`, rule.type);
      return null;
  }
};

/**
 * Runs a given Node.js script asynchronously.
 * @param {string} script - The absolute path to the script file.
 * @returns {Promise<void>} Resolves when script execution completes.
 */
export const runScript = (script) => {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Running script: ${script}`);

    exec(`node ${script}`, (error, stdout, stderr) => {
      console.log("Here ");
      if (error) {
        console.error(`❌ Error executing ${script}: ${error.message}`);
        reject(error);
      } else {
        console.log(`✅ ${script} completed:\n${stdout}`);
        resolve(stdout);
      }
      if (stderr) {
        console.error(`⚠️ Script stderr: ${stderr}`);
      }
    });
  });
};
