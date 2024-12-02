import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const CheckEng = ({ metrics, setSelectedOption }) => {
  // Prepare data for the charts
  const videoKeys = ["video1", "video2", "video3"];

  const data = videoKeys.map((key) => {
    const metric = metrics[key];
    return {
      name: key.toUpperCase(),
      "On Gaze Percentage": metric ? parseFloat(metric.onGazePercentage) : 0,
      "Time to First Gaze": metric
        ? metric.timeToFirstGaze
          ? parseFloat(metric.timeToFirstGaze)
          : 0
        : 0,
      "Total Gaze Transitions": metric ? metric.gazeTransitions : 0,
    };
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">
        Advertisement Engagement Results
      </h1>
      <div className="mb-8">
        <button
          onClick={() => setSelectedOption("WatchVid")}
          className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-lg"
        >
          Analyze Another Ad
        </button>

        {/* On Gaze Percentage Bar Chart */}
        <h2 className="text-xl font-semibold mb-2">On Gaze Percentage</h2>
        <BarChart
          width={600}
          height={300}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: "%", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="On Gaze Percentage" fill="#8884d8" />
        </BarChart>

        {/* Time to First Gaze Bar Chart */}
        <h2 className="text-xl font-semibold mb-2 mt-6">
          Time to First Gaze (seconds)
        </h2>
        <BarChart
          width={600}
          height={300}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{ value: "Seconds", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="Time to First Gaze" fill="#82ca9d" />
        </BarChart>

        {/* Total Gaze Transitions Bar Chart */}
        <h2 className="text-xl font-semibold mb-2 mt-6">
          Total Gaze Transitions
        </h2>
        <BarChart
          width={600}
          height={300}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{ value: "Count", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="Total Gaze Transitions" fill="#ffc658" />
        </BarChart>
      </div>
    </div>
  );
};

export default CheckEng;
