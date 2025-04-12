import { echoToMockForge } from "./scripts/echoToMockForge.js";

const dummyApiResponse = {
  user: {
    id: 101,
    name: "Alice Doe",
    email: "alice@example.com",
    roles: ["admin", "user"],
    isActive: true,
    lastLogin: "2023-09-01T10:45:00Z",
  },
  metadata: {
    requestId: "req_789xyz",
    source: "unit-test",
  },
};

// Feature toggle and control flags
const isMockForgeEnabled = false;
const shouldForceRefresh = false;

echoToMockForge({
  responseData: dummyApiResponse,
  enabled: isMockForgeEnabled,
  forceRefresh: shouldForceRefresh,
})
  .then((mockData) => {
    console.log("✅ Received mock data:");
    console.dir(mockData, { depth: null });
  })
  .catch((err) => {
    console.error("❌ Test failed:", err);
  });
