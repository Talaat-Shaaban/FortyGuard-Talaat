الملف التالي هو `README.md` احترافي ومصمم للعرض المباشر على GitHub لدعم مشروعك في المسابقة:

```markdown
# 🌾 FortyGuard Hyperlocal Agricultural Heat-Stress System

An intelligent, proactive agricultural monitoring and heat-stress mitigation system powered by **FortyGuard Hyperlocal Temperature API** and **n8n Automation Engine**. The system provides U.S. farmers with real-time risk assessment, 7-day statistical analytics, emergency alerts, and a seamless zero-login web dashboard.

---

## 🏗️ System Architecture & Workflow Components

The core backend consists of 4 main specialized n8n workflows integrated with Telegram and Google Sheets:


```

```
              +-----------------------------------+
              |      FortyGuard API Workflow      |
              |     (Sub-workflow for Temp Data)  |
              +-----------------+-----------------+
                                |
 +------------------------------+------------------------------+
 |                              |                              |
 v                              v                              v

```

+----+-------------------+  +-------+-------------------+  +-------+-------------------+
| 1. Farmer Registration |  | 2. Daily Bulletin Engine  |  | 3. Daytime Alert System  |
|    & Voice Assistant   |  |    & 7-Day Temp History   |  |   (Every 3 Hours 6am-6pm) |
+------------------------+  +---------------------------+  +---------------------------+
|                              |                              |
+------------------------------+------------------------------+
|
v
+------------+------------+
| 4. Webhook & Dashboard  |
|    (Token-Based Access) |
+-------------------------+

```

---

## 📌 Core Features

### 1️⃣ Farmer Onboarding & Instant AI Assistant (`Farmer Registration`)
- **Step-by-Step Interactive Registration:** Welcomes new U.S. farmers via Telegram, collects their location pin/coordinates, farmer name, and crop list (e.g., Tomato, Corn).
- **Sub-Workflow Integration (`Api FortyGuard`):** Calls FortyGuard’s 2-meter hyperlocal temperature API instantly to assess initial field status.
- **Natural Voice Interactions:** Supports natural voice input and smooth conversational interaction for immediate status checks.
- **Automated Security Tokens:** Generates a secure, cryptographic user token (`token`) upon completing registration to protect user data without complex logins.
- **Immediate Onboarding Notice:** Informs the farmer that they will automatically receive daily morning updates and real-time emergency notifications.

---

### 2️⃣ Daily Morning Bulletin Engine (`Send Daily Alerts`)
- Runs every morning to fetch the latest hyperlocal temperatures from FortyGuard for each registered farmer.
- **7-Day Rolling Window Engine:** Maintains a dynamic 7-day temperature history array inside Google Sheets using a **FIFO (First In, First Out)** updating logic.
  
  $$\text{Array}_{\text{initial}} = [21, 22, 23, 24, 25, 26, 27]$$
  $$\text{Add } 28^\circ\text{C} \rightarrow \text{Array}_{\text{updated}} = [22, 23, 24, 25, 26, 27, 28]$$

- **Statistical Analysis:** Calculates mean trends, cumulative heat stress, Z-Scores, and risk probabilities ($Risk\%$) based on scientific crop thresholds.
- Sends an actionable **Daily Thermal Bulletin** via Telegram featuring field status, temperature readings, and direct links to their private dashboard.

---

### 3️⃣ Real-Time Daytime Emergency System (`Emergency Alerts`)
- **Active Daylight Schedule:** Executes automatically every 3 hours strictly during peak daytime hours (**6:00 AM – 6:00 PM**).
- **Proactive Risk Checks:** Evaluates current temperature spikes against critical crop thresholds.
- **Instant Mitigation Warnings:** Sends immediate, high-priority Telegram alerts if an emergency heat threshold is breached, allowing farmers to activate cooling fans or drip irrigation immediately.

---

### 4️⃣ Zero-Login Web Dashboard (`Webhook Integration & Dashboard`)
- **Secure Token URL Routing:** Delivers personalized web dashboards using unique security tokens passed via Webhooks:
  `https://your-domain.com/dashboard?token=4bca4a0a-b195-4e48-bb48-e440ef848556`
- **Simplified Access:** Eliminates passwords and complex logins while maintaining data isolation between farmers.
- **Dashboard Displays:**
  - Real-time temperature & wind metrics.
  - Interactive 7-day temperature trend graphs.
  - Per-crop risk breakdown ($Risk\%$) and cumulative stress ($^\circ\text{C-days}$).
  - Scientific actionable mitigation protocols tailored to current heat levels.

---

## 🛠️ Security & Environment Configuration

> **Note:** No raw credentials or API keys are stored in this repository to comply with security best practices.

### Environment Setup (`.env.example`)
Create a `.env` file or assign environment variables inside n8n credential settings:

```env
# FortyGuard API Configuration
FORTYGUARD_API_KEY=your_fortyguard_api_key_here
FORTYGUARD_BASE_URL=[https://api.fortyguard.com/v1](https://api.fortyguard.com/v1)

# Telegram Bot Setup
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Google Sheets Data Storage
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS=your_google_credentials_json

# Webhook & Application Links
WEBHOOK_BASE_URL=[https://your-n8n-instance.com/webhook](https://your-n8n-instance.com/webhook)

```

---

## 📁 Repository Structure

```text
├── n8n-workflows/
│   ├── 01_farmer_registration_agent.json
│   ├── 02_api_fortyguard_subworkflow.json
│   ├── 03_send_daily_alerts.json
│   ├── 04_daytime_emergency_alerts.json
│   └── 05_webhook_dashboard_router.json
├── web-dashboard/
│   ├── index.html
│   ├── dashboard.html
│   └── js/
│       └── app.js
├── prompts/
│   ├── system_prompt_agent.md
│   └── guardrail_security_prompt.md
├── .env.example
└── README.md

```

```

```
