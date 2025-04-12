export const sanitizeJSON = (data) => {
  try {
    return JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (typeof value === "function") return undefined; // Remove functions
        if (typeof value === "symbol") return value.toString(); // Convert symbols
        if (value === undefined) return null; // Convert undefined to null
        if (value instanceof Date) return value.toISOString(); // Convert dates
        return value;
      }),
      (key, value) => (typeof value === "object" && value !== null ? Object.assign(Object.create(null), value) : value) // 🔥 Remove prototype
    );
  } catch (error) {
    console.error("❌ Error sanitizing JSON:", error);
    return {}; // Return empty object on failure
  }
};
