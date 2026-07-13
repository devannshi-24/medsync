import React from "react";

function Highlight({ text = "", query = "" }) {
  if (!query.trim() || !text) return <span>{text}</span>;

  const escapedQuery = query.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
 
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);
 
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase()  ? (
          <mark key={index} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}

export default Highlight;