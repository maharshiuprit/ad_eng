import React, { useState } from "react";
import TopNav from "./components/TopNav";
import LeftNav from "./components/LeftNav";
import WatchVid from "./components/WatchVid";
import CheckEng from "./components/CheckEng";

function App() {
  const [selectedOption, setSelectedOption] = useState("WatchVid");

  return (
    <div className="flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-1">
        <LeftNav setSelectedOption={setSelectedOption} />
        <div className="flex-1 bg-white p-4">
          {selectedOption === "WatchVid" ? <WatchVid /> : <CheckEng />}
        </div>
      </div>
    </div>
  );
}

export default App;
