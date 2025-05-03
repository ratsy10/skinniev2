# Skin Outbreak Tracker Workflow

The **Skin Outbreak Tracker** is an AI-powered system designed to analyze facial images and lifestyle factors to monitor skin conditions such as acne, redness, and irritation. This README provides a high-level overview of the workflow, detailing the process of generating skin severity scores, creating synthetic lifestyle data, simulating a dashboard for visualization, and analyzing individual images.

## Workflow Overview

The project consists of four main components that work together to process images, generate complementary data, and visualize insights:

1. **Image Analysis for Severity Scores**
2. **Synthetic Lifestyle Data Generation**
3. **Dashboard Simulation**
4. **Single Image Analysis**

Each component is implemented as a Python script, leveraging the Google Gemini API for AI-driven analysis and data synthesis. The workflow is designed to be modular, allowing users to process images, generate data, and visualize results independently or as a cohesive pipeline.

### 1. Image Analysis for Severity Scores
The first step involves analyzing a set of 60 facial images to assess skin conditions.

- **Input**: A folder (`selfie-data`) containing 60 JPG or PNG images of a person’s face, sorted by modification date to represent a 60-day timeline.
- **Process**:
  - Each image is processed using the Google Gemini API, which evaluates visible skin issues (e.g., acne, redness, irritation).
  - The API returns a JSON object for each image, containing:
    - `severity_score`: An integer (0–100, where 0 is clear skin and 100 is severe issues).
    - `description`: A brief text describing the condition (e.g., “Mild acne on forehead, slight redness”).
    - `affected_area_percentage`: An estimated percentage of the face affected (0–100).
  - Images are processed one at a time, with error handling for API quota limits or invalid responses.
- **Output**: A CSV file (`skin_scores.csv`) with columns: `day`, `severity_score`, `description`, `affected_area_percentage`, `image_path`, `modification_date`.
- **Purpose**: Provides a dataset of skin condition metrics over 60 days, serving as the foundation for further analysis.

### 2. Synthetic Lifestyle Data Generation
To complement the severity scores, synthetic lifestyle data is generated to simulate factors that may influence skin health.

- **Input**: The `skin_scores.csv` file containing severity scores for 60 days.
- **Process**:
  - The Google Gemini API generates a dataset of lifestyle factors for each of the 60 days, including:
    - `sleep_hours`: Float (4.0–10.0, hours slept).
    - `diet`: String (e.g., “high dairy”, “vegan”, “high sugar”, “balanced”).
    - `stress`: Integer (1–10, where 1 is low stress).
    - `weather`: String (e.g., “humid”, “dry”, “cold”, “warm”).
    - `sunlight_minutes`: Integer (0–120, minutes of sun exposure).
  - The data is designed to be plausible and varied, allowing for potential correlations with severity scores (e.g., low sleep on high-severity days) without explicitly defining a narrative.
- **Output**: A JSON file (`lifestyle_data.json`) containing 60 objects, each with `day`, `severity_score`, and the lifestyle factors.
- **Purpose**: Enriches the dataset with lifestyle context, enabling visualization of relationships between skin conditions and daily habits.

### 3. Dashboard Simulation
A dashboard simulates how the system would present data if uploaded daily, providing insights into skin condition trends and lifestyle impacts.

- **Input**: The `lifestyle_data.json` file with severity scores and lifestyle data for 60 days.
- **Process**:
  - A Streamlit-based dashboard simulates daily data uploads, processing one day’s data every 3 seconds to mimic real-time updates over 60 days.
  - The dashboard includes:
    - **Graphs**: Interactive scatter plots showing:
      - Sleep hours vs. severity score.
      - Stress vs. severity score.
      - Sunlight minutes vs. severity score.
    - **Correlations**: A table displaying Pearson correlation coefficients between lifestyle factors and severity scores, updated daily.
    - **Trends**: Highlights if severity scores are increasing or decreasing over the last 3 days.
    - **Daily Tips**: Rule-based skincare recommendations based on the day’s data (e.g., “Low sleep detected. Aim for 7+ hours.”).
    - **Progress Bar**: Tracks the simulation’s progress (0–100% over 60 days).
  - The dashboard runs in a browser, updating dynamically as each day’s data is “uploaded.”
- **Output**: A browser-based visualization, with the option to save as HTML or screenshots for demonstration.
- **Purpose**: Demonstrates how the system could provide actionable insights to users over time, suitable for a prototype or demo.

### 4. Single Image Analysis
The system supports analyzing a single image for immediate skin condition insights, useful for testing or real-time use.

- **Input**: A file path to a single JPG or PNG image (e.g., `selfie-data/frame_0000.jpg`).
- **Process**:
  - The image is sent to the Google Gemini API with the same prompt used for batch analysis.
  - The API returns a JSON object with `severity_score`, `description`, and `affected_area_percentage`.
- **Output**: The JSON object is printed to the console, providing quick feedback on the skin condition.
- **Purpose**: Enables users to test the system with individual images, complementing the batch processing workflow.

## Technical Details
- **Environment**: The workflow uses a Conda environment (`testing`) with Python 3.11 and dependencies:
  - `google-generativeai` for Gemini API integration.
  - `pandas` for data handling.
- **API**: The Google Gemini API (`gemini-2.0-flash`) powers image analysis and data synthesis, requiring a valid API key.
- **Data Flow**:
  - Images → `skin_scores.csv` (severity scores).
  - `skin_scores.csv` → `lifestyle_data.json` (scores + lifestyle data).
  - `lifestyle_data.json` → Dashboard simulation.
  - Single image → Console output.

## Notes
- **API Quota**: The Gemini API has rate limits (e.g., 15 requests/minute, 100 requests/day for free tier). The batch processing script includes delays to manage quotas, but users should monitor limits in Google AI Studio.
- **Error Handling**: Scripts include robust error handling for file issues, API errors (e.g., 401 Unauthorized, quota exceeded), and JSON parsing.
- **Flexibility**: The workflow is modular, allowing users to run individual components (e.g., single image analysis) without completing the full pipeline.

This workflow provides a complete pipeline for analyzing skin conditions and visualizing insights, suitable for health-tech prototypes or research applications.
