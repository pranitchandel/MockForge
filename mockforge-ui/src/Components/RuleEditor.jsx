import React, { useState, useEffect } from "react";
import JsonTreeEditor from "./JsonTreeEditor";

const RuleEditor = () => {
  const [rules, setRules] = useState(null);
  const [mockData, setMockData] = useState(null);
  const [showMockData, setShowMockData] = useState(false);

  // Fetch rules.json from the public folder
  useEffect(() => {
    fetch("/rules.json")
      .then((res) => res.json())
      .then((data) => setRules(data))
      .catch((err) => console.error("Error loading rules.json:", err));
  }, []);

  useEffect(() => {
    fetch("/mockData.json")
      .then((res) => res.json())
      .then((data) => setMockData(data))
      .catch((err) => console.error("Error loading mockData.json:", err));
  }, []);

  // Update function to modify the JSON
  const handleUpdate = (path, newValue) => {
    if (!path) {
      // 🔥 If no path is provided, update the entire rules object
      setRules(newValue);
      return;
    }
    const updatedRules = { ...rules };
    const keys = path.split(".");
    let temp = updatedRules;

    // Traverse and update the JSON
    for (let i = 0; i < keys.length - 1; i++) {
      temp = temp[keys[i]];
    }

    temp[keys[keys.length - 1]] = newValue;
    setRules(updatedRules);
  };

  const handleUpdateMockData = (path, newValue) => {
    if (!path) {
      // 🔥 If no path is provided, update the entire rules object
      setMockData(newValue);
      return;
    }
    const updatedRules = { ...mockData };
    const keys = path.split(".");
    let temp = updatedRules;

    // Traverse and update the JSON
    for (let i = 0; i < keys.length - 1; i++) {
      temp = temp[keys[i]];
    }

    temp[keys[keys.length - 1]] = newValue;
    setMockData(updatedRules);
  };

  return (
    <div >
      <h2>Json Editor</h2>
      <button onClick={() => setShowMockData(!showMockData)} >{`${showMockData ? "Hide" : "Show"}`} mock data</button>
      <div style={{display:"flex", gap:"2%"}}>
      {rules && <JsonTreeEditor data={rules} onUpdate={handleUpdate} />}
      {showMockData && mockData && <JsonTreeEditor data={mockData} onUpdate={handleUpdateMockData} />}
      </div>
    </div>
  );
};

export default RuleEditor;
