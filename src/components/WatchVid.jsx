import React, { useState, useEffect, useRef } from "react";

const WatchVid = () => {
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ"); // Default video ID
  const [isCalibrating, setIsCalibrating] = useState(false); // Calibration state
  const [calibrationPoints, setCalibrationPoints] = useState([]); // Calibration points
  const [onVideoTime, setOnVideoTime] = useState(0); // Total time gaze is on video
  const [offVideoTime, setOffVideoTime] = useState(0); // Total time gaze is off video
  const [isGazingOnVideo, setIsGazingOnVideo] = useState(false); // Track current gaze state

  const videoRef = useRef(null); // Ref to track video element
  const startTimestampRef = useRef(0); // Track start timestamp
  const lastTimestampRef = useRef(0); // Track last timestamp
  const calibrationEnded = useRef(false); // Flag to detect calibration end

  const videos = {
    video1: "dQw4w9WgXcQ", // Replace these with actual YouTube video IDs
    video2: "eYq7WapuDLU",
    video3: "oHg5SJYRHA0",
  };

  // Generate calibration points with IDs and clicks
  const generateCalibrationPoints = () => {
    const points = [
      { x: "10%", y: "10%", id: 1, clicks: 0 },
      { x: "50%", y: "10%", id: 2, clicks: 0 },
      { x: "90%", y: "10%", id: 3, clicks: 0 },
      { x: "10%", y: "50%", id: 4, clicks: 0 },
      { x: "90%", y: "50%", id: 5, clicks: 0 },
      { x: "10%", y: "90%", id: 6, clicks: 0 },
      { x: "50%", y: "90%", id: 7, clicks: 0 },
      { x: "90%", y: "90%", id: 8, clicks: 0 },
      { x: "50%", y: "50%", id: 9, clicks: 0 }, // Central point for accuracy
    ];
    setCalibrationPoints(points);
  };

  // Start calibration process
  const startCalibration = () => {
    setIsCalibrating(true);
    generateCalibrationPoints();
  };

  // Handle calibration point click
  const handleCalibrationClick = (xPercent, yPercent, id) => {
    const x = window.innerWidth * (parseInt(xPercent) / 100);
    const y = window.innerHeight * (parseInt(yPercent) / 100);

    webgazer.recordScreenPosition(x, y);

    // Increment click count for the clicked point
    setCalibrationPoints((prevPoints) =>
      prevPoints.map((point) =>
        point.id === id ? { ...point, clicks: point.clicks + 1 } : point
      )
    );
  };

  // Check if all points are sufficiently clicked
  useEffect(() => {
    if (
      calibrationPoints.length > 0 &&
      calibrationPoints.every((point) => point.clicks >= 5)
    ) {
      setIsCalibrating(false); // End calibration when all points are done

      // Reset timers and timestamps
      setOnVideoTime(0);
      setOffVideoTime(0);
      setIsGazingOnVideo(false);
      const startTime = performance.now();
      startTimestampRef.current = startTime;
      calibrationEnded.current = true; // Indicate calibration has just ended
    }
  }, [calibrationPoints]);

  const handleVideoChange = (videoKey) => {
    setVideoId(videos[videoKey]);
  };

  const handleStartTracking = () => {
    webgazer
      .setGazeListener((data, elapsedTime) => {
        if (data == null || !videoRef.current) return;

        const { x, y } = data;

        // Adjust videoRect to account for scroll position
        const videoRect = videoRef.current.getBoundingClientRect();
        const videoRectLeft = videoRect.left + window.scrollX;
        const videoRectRight = videoRect.right + window.scrollX;
        const videoRectTop = videoRect.top + window.scrollY;
        const videoRectBottom = videoRect.bottom + window.scrollY;

        // Check if gaze is on the video
        const isOnVideo =
          x >= videoRectLeft &&
          x <= videoRectRight &&
          y >= videoRectTop &&
          y <= videoRectBottom;

        console.log(`Gaze Coordinates: (${x}, ${y})`);
        console.log("Video Bounds:", {
          left: videoRectLeft,
          right: videoRectRight,
          top: videoRectTop,
          bottom: videoRectBottom,
        });

        if (!isCalibrating) {
          if (calibrationEnded.current) {
            // Calibration just ended, reset lastTimestampRef
            lastTimestampRef.current = elapsedTime;
            calibrationEnded.current = false;
            return; // Skip updating timers on this iteration
          }

          const timeDelta = elapsedTime - lastTimestampRef.current;

          if (timeDelta > 0) {
            // Use current gaze state to update time counters
            if (isOnVideo) {
              setOnVideoTime((prev) => prev + timeDelta / 1000);
            } else {
              setOffVideoTime((prev) => prev + timeDelta / 1000);
            }
          }

          // Update gaze state and timestamp
          setIsGazingOnVideo(isOnVideo);
          lastTimestampRef.current = elapsedTime;
        } else {
          // During calibration, reset lastTimestampRef
          lastTimestampRef.current = elapsedTime;
        }
      })
      .begin();

    // Hide WebGazer video feedback
    webgazer.showVideo(false).showFaceOverlay(false).showFaceFeedbackBox(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Content Area</h1>
      <p className="mb-8">Welcome to the main content area.</p>
      <div className="flex flex-col items-center">
        <div className="w-full md:w-3/4 lg:w-1/2 aspect-video">
          <iframe
            ref={videoRef}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => handleVideoChange("video1")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Video 1
          </button>
          <button
            onClick={() => handleVideoChange("video2")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Video 2
          </button>
          <button
            onClick={() => handleVideoChange("video3")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Video 3
          </button>
        </div>
        <button
          onClick={() => {
            handleStartTracking();
            startCalibration();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          disabled={isCalibrating}
        >
          Start Eyetracker
        </button>
        <button
          onClick={() => {
            const stopTime = performance.now(); // Record stop time
            const totalTimeElapsed =
              (stopTime - startTimestampRef.current) / 1000;

            console.log(
              `Total Time Elapsed: ${totalTimeElapsed.toFixed(2)} seconds`
            );
            console.log(
              `Time Elapsed On Video: ${onVideoTime.toFixed(2)} seconds`
            );
            console.log(
              `Time Elapsed Off Video: ${offVideoTime.toFixed(2)} seconds`
            );

            webgazer.end();
            webgazer.clearGazeListener();
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Stop Eyetracker
        </button>
        {isCalibrating && (
          <div className="fixed inset-0 flex items-center justify-center">
            {calibrationPoints.map((point) => (
              <div
                key={point.id}
                className="w-8 h-8 rounded-full absolute"
                style={{
                  left: point.x,
                  top: point.y,
                  backgroundColor: point.clicks >= 5 ? "yellow" : "red",
                  opacity: 0.2 + point.clicks * 0.16, // Gradual opacity increase
                }}
                onClick={() =>
                  handleCalibrationClick(point.x, point.y, point.id)
                }
              ></div>
            ))}
          </div>
        )}
        {!isCalibrating && (
          <div className="mt-4">
            <p>Total Gaze On Video: {onVideoTime.toFixed(2)} seconds</p>
            <p>Total Gaze Off Video: {offVideoTime.toFixed(2)} seconds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchVid;
