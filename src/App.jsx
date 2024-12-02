import React, { useState } from "react";
import TopNav from "./components/TopNav";
import LeftNav from "./components/LeftNav";
import WatchVid from "./components/WatchVid";
import CheckEng from "./components/CheckEng";

function App() {
  const [selectedOption, setSelectedOption] = useState("WatchVid");
  const [metrics, setMetrics] = useState({
    video1: null,
    video2: null,
    video3: null,
  });

  const handleSetMetrics = (videoKey, data) => {
    setMetrics((prevMetrics) => ({
      ...prevMetrics,
      [videoKey]: data,
    }));
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-1">
        <LeftNav setSelectedOption={setSelectedOption} />
        <div className="flex-1 bg-white p-4">
          {selectedOption === "WatchVid" ? (
            <WatchVid
              setMetrics={handleSetMetrics}
              setSelectedOption={setSelectedOption}
              metrics={metrics}
            />
          ) : (
            <CheckEng metrics={metrics} setSelectedOption={setSelectedOption} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
