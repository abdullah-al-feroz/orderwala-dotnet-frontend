import React, { useState } from "react";

const TreeNode = ({ node }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleNode = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <button onClick={toggleNode}>
        {expanded ? "-" : "+"} {node.label}
      </button>
      {expanded && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <li key={child.id}>
              <TreeNode node={child} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TreeNode;
