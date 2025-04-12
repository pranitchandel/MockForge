import React from "react";
import {
  FaEdit,
  FaTrash,
  FaPlusSquare,
  FaMinusSquare,
} from "react-icons/fa";
import "./index.css";

const Row = ({ data, style, handleDelete, handleEdit, toggleCollapse, collapsedNodes }) => {
    const { key, value, path, level } = data;
    const isCollapsible = typeof value === "object" && value !== null;
    const isCollapsed = collapsedNodes[path];

    return (
      <div className="tree-item" style={{ ...style, marginLeft: level * 20 }}>
        <div className="tree-row">
          <div className="tree-left">
            {isCollapsible && (
              <button className="collapse-btn" onClick={() => toggleCollapse(path)}>
                {isCollapsed ? <FaPlusSquare /> : <FaMinusSquare />}
              </button>
            )}
            <span className="tree-key">{key}:</span>
            <span className="tree-value">
              {isCollapsible ? (isCollapsed ? " {...} " : JSON.stringify(value, null, 2)) : String(value)}
            </span>
          </div>

          <div className="action-buttons">
            <button className="edit-btn" onClick={() => handleEdit(path, value)}>
              <FaEdit /> Edit
            </button>
            <button className="delete-value-btn" onClick={() => handleDelete(path, key, value, "value")}>
              <FaTrash /> Delete Value
            </button>
            <button className="delete-key-btn" onClick={() => handleDelete(path, key, value, "key")}>
              <FaTrash /> Delete Key
            </button>
          </div>
        </div>
      </div>
    );
  };

export default Row;
