# Analyzing Advertisement Engagement Through Eye Tracking 

This project is a React application built with Vite and styled with Tailwind CSS. It analyzes user engagement with video advertisements using eye-tracking technology.

## Features

- Eye-tracking calibration
- Video advertisement playback
- Real-time gaze analysis
- Engagement metrics visualization

## Technologies Used

- React
- Vite
- Tailwind CSS
- Recharts (for data visualization)
- WebGazer.js (for eye-tracking)

## Components

### WatchVid

The `WatchVid` component handles the video playback and eye-tracking functionality. It includes:

- YouTube video embedding
- Eye-tracking calibration
- Gaze analysis (on-video time, off-video time, gaze transitions)
- Real-time metrics display

### CheckEng

The `CheckEng` component visualizes the engagement metrics using bar charts. It displays:

- On Gaze Percentage
- Time to First Gaze
- Total Gaze Transitions

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Usage

1. Start the application and navigate to the WatchVid component
2. Click "Start Eyetracker" to begin calibration
3. Follow the calibration process by clicking on the points
4. Watch the video while the eye-tracking is active
5. Click "Stop Eyetracker" to end the session and view results
6. Navigate to the CheckEng component to visualize the engagement metrics

## Note

Ensure you have the necessary permissions and comply with privacy regulations when using eye-tracking technology.
