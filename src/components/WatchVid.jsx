import React, { useState, useEffect, useRef } from "react";

const WatchVid = ({ setMetrics, setSelectedOption, metrics }) => {
  const [videoId, setVideoId] = useState("pwLergHG81c"); // Default video ID
  const [currentVideoKey, setCurrentVideoKey] = useState("video1"); // Track current video key
  const [isCalibrating, setIsCalibrating] = useState(false); // Calibration state
  const [calibrationPoints, setCalibrationPoints] = useState([]); // Calibration points
  const [onVideoTime, setOnVideoTime] = useState(0); // Total time gaze is on video
  const [offVideoTime, setOffVideoTime] = useState(0); // Total time gaze is off video
  const [isGazingOnVideo, setIsGazingOnVideo] = useState(false); // Track current gaze state
  const [gazeTransitionCount, setGazeTransitionCount] = useState(0); // Total gaze transitions

  const videoRef = useRef(null); // Ref to track video element
  const startTimestampRef = useRef(0); // Track start timestamp
  const lastTimestampRef = useRef(0); // Track last timestamp
  const calibrationEnded = useRef(false); // Flag to detect calibration end
  const firstGazeTimeRef = useRef(null); // Time of first gaze on video
  const trackingStartTimeRef = useRef(0); // Tracking start time after calibration
  const MIN_DWELL_TIME = 500; // Minimum dwell time in milliseconds
  const gazeStateRef = useRef(isGazingOnVideo);
  const transitionTimerRef = useRef(null);
  const stateChangeStartTimeRef = useRef(null);

  const videos = {
    video1: "pwLergHG81c", // Replace these with actual YouTube video IDs
    video2: "pZjFpAJfcSY",
    video3: "9zSVu76AX3I",
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
      setGazeTransitionCount(0);
      setIsGazingOnVideo(false);
      gazeStateRef.current = false;
      firstGazeTimeRef.current = null;
      const startTime = performance.now();
      startTimestampRef.current = startTime;
      lastTimestampRef.current = startTime;
      calibrationEnded.current = true; // Indicate calibration has just ended
    }
  }, [calibrationPoints]);

  const handleVideoChange = (videoKey) => {
    setVideoId(videos[videoKey]);
    setCurrentVideoKey(videoKey);
  };

  const handleStartTracking = () => {
    webgazer
      .setGazeListener((data) => {
        if (data == null || !videoRef.current) return;

        const { x, y } = data;

        const currentTime = performance.now();

        // Get video element position
        const videoRect = videoRef.current.getBoundingClientRect();

        // Check if gaze is on the video
        const isCurrentlyOnVideo =
          x >= videoRect.left &&
          x <= videoRect.right &&
          y >= videoRect.top &&
          y <= videoRect.bottom;

        if (!isCalibrating) {
          if (calibrationEnded.current) {
            // Calibration just ended, reset timestamps and states
            lastTimestampRef.current = currentTime;
            trackingStartTimeRef.current = currentTime;
            setIsGazingOnVideo(isCurrentlyOnVideo);
            gazeStateRef.current = isCurrentlyOnVideo;
            calibrationEnded.current = false;
            return;
          }

          // Record time of first gaze on video
          if (firstGazeTimeRef.current === null && isCurrentlyOnVideo) {
            firstGazeTimeRef.current =
              (currentTime - trackingStartTimeRef.current) / 1000;
          }

          const timeDelta = currentTime - lastTimestampRef.current;

          if (timeDelta > 0) {
            // Use the confirmed gaze state to update time counters
            if (gazeStateRef.current) {
              setOnVideoTime((prev) => prev + timeDelta / 1000);
            } else {
              setOffVideoTime((prev) => prev + timeDelta / 1000);
            }
          }

          lastTimestampRef.current = currentTime;

          // Transition handling with dwell time
          if (gazeStateRef.current !== isCurrentlyOnVideo) {
            if (transitionTimerRef.current) {
              // Do nothing, a timer is already running
            } else {
              // Record the time when the potential state change started
              stateChangeStartTimeRef.current = currentTime;

              transitionTimerRef.current = setTimeout(() => {
                // Store the previous gaze state before updating
                const prevGazeState = gazeStateRef.current;

                // Confirm the state change after dwell time
                gazeStateRef.current = isCurrentlyOnVideo;
                setIsGazingOnVideo(isCurrentlyOnVideo);

                if (!prevGazeState && isCurrentlyOnVideo) {
                  // Increment transition count when gaze returns to video
                  setGazeTransitionCount((prevCount) => prevCount + 1);
                }

                // Reset lastTimestampRef to ensure accurate time calculation
                lastTimestampRef.current = performance.now();

                // Clear the timer and state change start time
                transitionTimerRef.current = null;
                stateChangeStartTimeRef.current = null;
              }, MIN_DWELL_TIME);
            }
          } else {
            // If the gaze state hasn't changed, and a transition timer is running, cancel it
            if (transitionTimerRef.current) {
              clearTimeout(transitionTimerRef.current);
              transitionTimerRef.current = null;
              stateChangeStartTimeRef.current = null;
            }
          }
        } else {
          // During calibration, reset lastTimestampRef
          lastTimestampRef.current = currentTime;
        }
      })
      .begin();

    // Hide WebGazer video feedback
    webgazer.showVideo(false).showFaceOverlay(false).showFaceFeedbackBox(false);
  };

  const handleStopTracking = () => {
    const stopTime = performance.now(); // Record stop time
    const totalTimeElapsed = (stopTime - startTimestampRef.current) / 1000;

    const onGazePercentage = (
      (onVideoTime / (onVideoTime + offVideoTime)) *
      100
    ).toFixed(2);

    const results = {
      totalTimeElapsed: totalTimeElapsed.toFixed(2),
      onGazePercentage: onGazePercentage,
      timeToFirstGaze:
        firstGazeTimeRef.current !== null
          ? firstGazeTimeRef.current.toFixed(2)
          : null,
      gazeTransitions: gazeTransitionCount,
    };

    console.log("Aggregated Results:", results);

    webgazer.end();
    webgazer.clearGazeListener();

    // Save the metrics for the current video
    setMetrics(currentVideoKey, results);

    // Do not redirect to CheckEng
  };

  return (
    <div className="p-8">
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
          {Object.keys(videos).map((key) => (
            <button
              key={key}
              onClick={() => handleVideoChange(key)}
              className={`px-4 py-2 rounded-lg ${
                currentVideoKey === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"
              }`}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => {
              handleStartTracking();
              startCalibration();
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
            disabled={isCalibrating}
          >
            Start Eyetracker
          </button>
          <button
            onClick={handleStopTracking}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Stop Eyetracker
          </button>
        </div>
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
            <p>
              On Gaze Percentage:{" "}
              {onVideoTime + offVideoTime > 0
                ? `${(
                    (onVideoTime / (onVideoTime + offVideoTime)) *
                    100
                  ).toFixed(2)} %`
                : "N/A"}
            </p>
            <p>
              Time of First Gaze on Video:{" "}
              {firstGazeTimeRef.current !== null
                ? `${firstGazeTimeRef.current.toFixed(2)} seconds`
                : "Not yet gazed at video"}
            </p>
            <p>Total Gaze Transitions: {gazeTransitionCount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchVid;
