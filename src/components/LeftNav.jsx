import React from "react";

function LeftNav({ setSelectedOption }) {
  return (
    <aside className="bg-gray-200 w-64 p-4 h-full">
      <ul>
        <li className="mb-2">
          <button
            className="text-gray-700"
            onClick={() => setSelectedOption("WatchVid")}
          >
            Watch Video
          </button>
        </li>
        <li>
          <button
            className="text-gray-700"
            onClick={() => setSelectedOption("CheckEng")}
          >
            Check Engagement
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default LeftNav;
