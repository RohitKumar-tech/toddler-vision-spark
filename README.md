# AI-Driven Early Detection of Autism in Toddlers Using Multimodal Video Data

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features & Clinical Signs](#features--clinical-signs)
3. [System Architecture](#system-architecture)
4. [Modules](#modules)

   * [Face & Pose Extraction](#face--pose-extraction)
   * [Eye Contact Analysis](#eye-contact-analysis)
   * [Repetitive Behavior Detection](#repetitive-behavior-detection)
   * [Gesture & Language-Delay Proxies](#gesture--language-delay-proxies)
   * [Social Reciprocity Assessment](#social-reciprocity-assessment)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Data Preparation & Annotation](#data-preparation--annotation)
8. [Training & Evaluation](#training--evaluation)
9. [Demo & Integration](#demo--integration)
10. [Future Work](#future-work)
11. [License](#license)

---

## Project Overview

This repository contains a proof-of-concept AI pipeline designed to detect early behavioral signs of Autism Spectrum Disorder (ASD) in toddlers using non-invasive video data. By analyzing visual cues—such as eye contact, repetitive movements, and gesture patterns—the system computes a risk score to flag potential early signs of ASD and support timely clinical follow-up.

**Key Objectives:**

* Identify and quantify measurable visual behaviors linked to early ASD markers.
* Implement modular computer-vision and machine-learning components for rapid prototyping.
* Provide an end-to-end demo (live or recorded) with risk output and simple visuals.

---

## Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, shadcn/ui for components
* **Backend:** FastAPI (Python) serving AI modules via REST
* **Database & Auth:** Supabase (PostgreSQL, Auth)
* **AI & CV:** MediaPipe, OpenCV, custom TensorFlow/PyTorch models for gaze and behavior analysis
* **Deployment:** Docker for containerization; Vercel or Netlify for frontend hosting

---

This repository contains a proof-of-concept AI pipeline designed to detect early behavioral signs of Autism Spectrum Disorder (ASD) in toddlers using non-invasive video data. By analyzing visual cues—such as eye contact, repetitive movements, and gesture patterns—the system computes a risk score to flag potential early signs of ASD and support timely clinical follow-up.

**Key Objectives:**

* Identify and quantify measurable visual behaviors linked to early ASD markers.
* Implement modular computer-vision and machine-learning components for rapid prototyping.
* Provide an end-to-end demo (live or recorded) with risk output and simple visuals.

---

## Features & Clinical Signs

The pipeline targets three primary observable signs:

1. **Reduced Eye Contact** – quantified as percentage of gaze not directed at caregiver or toy during interaction prompts.
2. **Repetitive Motor Behaviors** – detection of periodic movements (e.g., hand flapping, body rocking) via pose keypoint temporal analysis.
3. **Social Reciprocity** – assessment of head-turn response to name-calling and frequency of shared-attention gestures (e.g., pointing).

Additional proxies include gesture rates (pointing or showing) as indirect indicators of early language use.

---

## System Architecture

```
[Camera Feed]
      ↓
 [Face & Pose Extraction]
      ↓
┌──────────────────────────┐
│ Eye Contact Module       │
└──────────────────────────┘
      ↓
┌──────────────────────────┐
│ Repetitive Behavior      │
└──────────────────────────┘
      ↓
┌──────────────────────────┐
│ Gesture & Reciprocity    │
└──────────────────────────┘
      ↓
┌──────────────────────────┐
│ Feature Fusion & Class.  │
└──────────────────────────┘
      ↓
    ASD Risk Score
```

---

## Modules

### 1. Face & Pose Extraction

* **Tools:** MediaPipe Face Mesh & Pose, OpenPose (optional)
* **Output:** JSON files per frame containing 68 facial landmarks + 33 body keypoints.

### 2. Eye Contact Analysis

* **Approach:** CNN-based gaze estimator predicts a 2D gaze vector.
* **ROI Calibration:** Define caregiver/toy bounding-box; compute `gaze_avoid_percent`.

### 3. Repetitive Behavior Detection

* **Data:** Time series of wrist and torso keypoints.
* **Analysis:** FFT or autocorrelation to detect peaks in 2–5 Hz range.
* **Output:** `repetition_score` per clip.

### 4. Gesture & Language-Delay Proxies

* **Gesture Detection:** Angle-based decision tree to classify pointing or showing.
* **Metric:** Gestures-per-minute.
* **Response Latency:** Time-to-look or touch after visual stimulus.

### 5. Social Reciprocity Assessment

* **Name-Call Response:** Detect head orientation within 2 s of prompt.
* **Metric:** `name_response_rate` (successes/total prompts).

---

## Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/asd-detection-poc.git
cd asd-detection-poc

# Setup Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup Frontend
cd frontend
npm install
```

### Supabase Configuration

1. Create a Supabase project and copy the API URL and anon key.
2. In `frontend/.env`, add:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. In `backend/.env`, configure any needed environment variables for database or auth.

---

## Usage

1. **Start Backend API**

   ```bash
   cd backend
   uvicorn app.server:app --reload
   ```

2. **Start Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:3000` to access the React app, which streams webcam input, visualizes gaze heatmaps, repetition timelines, and displays the ASD risk gauge.

---

1. **Extract Keypoints**

   ```bash
   python scripts/extract_keypoints.py --video data/sample.mp4 --out data/keypoints.json
   ```

2. **Compute Metrics**

   ```bash
   python scripts/compute_gaze.py --keypoints data/keypoints.json
   python scripts/detect_repetition.py --keypoints data/keypoints.json
   python scripts/compute_gestures.py --keypoints data/keypoints.json
   python scripts/detect_headturn.py --video data/sample.mp4
   ```

3. **Run Inference Server**

   ```bash
   uvicorn app.server:app --reload
   ```

   Access at `http://localhost:8000` to stream webcam and view risk score.

---

## Data Preparation & Annotation

1. **Scenario Recording:** Capture 30–60 s clips covering name-calling, toy interaction, and free play.
2. **Annotation Tool:** Use CVAT or Label Studio to mark:

   * Face bounding boxes
   * Name-call events (timestamps)
   * Repetitive behavior segments
3. **Export:** Save annotations in JSON or CSV for training and evaluation.

---

## Training & Evaluation

* **Train Classifier:**

  ```bash
  python scripts/train_model.py --features data/features.csv --labels data/labels.csv
  ```
* **Evaluate:** Generates accuracy, sensitivity, specificity, and ROC-AUC plots.

---

## Demo & Integration

* **Frontend Dashboard:** Live webcam view with overlayed gaze heatmap, repetition timeline, and final risk gauge.
* **Docker:** Optional `Dockerfile` provided for one-command deployment:

  ```bash
  docker build -t asd-detector .
  docker run -p 8000:8000 asd-detector
  ```

---

## Future Work

* Integrate audio-based speech analysis for complementary cues.
* Expand to include physiological sensors (e.g., eye-tracking glasses).
* Validate on a larger, clinically diverse dataset.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
