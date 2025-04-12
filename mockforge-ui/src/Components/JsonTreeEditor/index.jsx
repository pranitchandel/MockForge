import React, { useState, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import "./index.css";
import ModalManager from "../ModalManager";
import Row from "../Row";

const JsonTreeEditor = ({ data, onUpdate }) => {
  const [editPath, setEditPath] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [collapsedNodes, setCollapsedNodes] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaveTreeModalOpen, setIsSaveTreeModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [error, setError] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  // Toggle expand/collapse
  const toggleCollapse = useCallback((path) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  }, []);

  // Open Edit Modal
  const handleEdit = useCallback((path, value) => {
    setEditPath(path);
    setTempValue(JSON.stringify(value, null, 2));
    setIsEditModalOpen(true);
  }, []);

  // Open Delete Confirmation Modal
  const handleDelete = useCallback((path, key, value, type) => {
    setDeleteTarget({ path, key, value });
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  }, []);

  // Confirm Delete Action
  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    const { path } = deleteTarget;
    const updatedJson = JSON.parse(JSON.stringify(data)); // Deep clone

    const keys = path.split(".");
    let temp = updatedJson;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!temp[keys[i]]) return;
      temp = temp[keys[i]];
    }

    const lastKey = keys[keys.length - 1];

    if (deleteType === "value") {
      temp[lastKey] = ""; // Only clear the value
    } else if (deleteType === "key") {
      if (Array.isArray(temp) && !isNaN(lastKey)) {
        temp.splice(Number(lastKey), 1);
      } else {
        delete temp[lastKey];
      }
    }

    onUpdate("", updatedJson);
    setDeleteTarget(null);
    setIsDeleteModalOpen(false);
  }, [onUpdate, deleteTarget, deleteType, data]);

  // Save Edit Changes
  const handleSaveEdit = useCallback(() => {
    try {
      const parsedValue = JSON.parse(tempValue);
      onUpdate(editPath, parsedValue);
      setEditPath(null);
      setIsEditModalOpen(false);
      setError("");
    } catch (err) {
      setError("Invalid JSON format!");
    }
  }, [editPath, tempValue, onUpdate]);

  // Close Modals
  const handleCancelEdit = () => {
    setEditPath(null);
    setIsEditModalOpen(false);
    setError("");
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
    setIsDeleteModalOpen(false);
  };

  const handleSaveTree = async () => {
    try {
      const response = await fetch("http://localhost:4000/update-rules", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("✅ Rules updated:", result);
        setIsSaveTreeModalOpen(true);
        setNotificationMessage("Rules updated successfully");
        setNotificationType("success");
      } else {
        console.error("❌ Error:", result.error);
        setIsSaveTreeModalOpen(true);
        setNotificationType("error");
        setNotificationMessage(`Error:", ${result.error}`);
      }
    } catch (err) {
      console.error("❌ API call failed:", err);
      setIsSaveTreeModalOpen(true);
      setNotificationType("error");
      setNotificationMessage(`API call failed:", ${err}`);
    }
  };


  // Convert JSON to array for virtualized list
  const treeArray = useCallback(() => {
    let flatArray = [];
    const flattenTree = (obj, path = "", level = 0) => {
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key;
        flatArray.push({ key, value, path: newPath, level });

        if (typeof value === "object" && value !== null && !collapsedNodes[newPath]) {
          flattenTree(value, newPath, level + 1);
        }
      });
    };
    flattenTree(data);
    return flatArray;
  }, [data, collapsedNodes]);

  return (
    <div className="json-tree-viewer">
      <div className="tree-list">
        <List height={500} itemCount={treeArray().length} itemSize={50} width={"100%"}>
          {({ index, style }) => (
            <Row
              data={treeArray()[index]}
              style={style}
              toggleCollapse={toggleCollapse}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              collapsedNodes={collapsedNodes}
            />
          )}
        </List>
      </div>
      <button onClick={handleSaveTree}>Save</button>
      <ModalManager
        isEditModalOpen={isEditModalOpen}
        tempValue={tempValue}
        setTempValue={setTempValue}
        handleCancelEdit={handleCancelEdit}
        handleSaveEdit={handleSaveEdit}
        errorMessage={error}
        isDeleteModalOpen={isDeleteModalOpen}
        confirmDelete={confirmDelete}
        handleCancelDelete={handleCancelDelete}
        deleteTarget={deleteTarget}
        deleteType={deleteType}
        isSaveTreeModalOpen={isSaveTreeModalOpen}
        setIsSaveTreeModalOpen={setIsSaveTreeModalOpen}
        notificationType={notificationType}
        notificationMessage={notificationMessage}
      />
    </div>
  );
};

export default JsonTreeEditor;
