
# 🌾 Crop Guard – Hyperlocal Agricultural Heat-Stress System

An intelligent, proactive agricultural monitoring and heat-stress mitigation system powered by the **FortyGuard Hyperlocal Temperature API**, **n8n Automation Engine**, **Telegram Integration**, and a **Zero-Login Web Dashboard**.

🤖 **Try the Crop Guard Telegram Bot:** [Click Here to Start Crop Guard]([t.me/cropG1_bot.](https://t.me/cropG1_bot) *(Replace with your actual bot link)*

---

## 🏗️ Core System Components

### 1️⃣ Farmer Registration & AI Assistant (`Farmer Registration`)

* **Onboarding:** Welcomes new U.S. farmers via Telegram, capturing their location (coordinates/pin), farmer name, and crops.
* **Instant API Integration:** Calls the sub-workflow (`Api FortyGuard`) to fetch real-time 2-meter hyperlocal temperature data and evaluate crop status immediately.
* **Proactive Notice & Voice Support:** Supports smooth voice interactions and notifies the farmer that they will automatically receive daily bulletins and emergency alerts.

### 2️⃣ Daily Morning Bulletin Engine (`Send Daily Alerts`)

* **Daily Automation:** Fetches weather data every morning and appends it to Google Sheets.
* **7-Day Rolling History (FIFO):** Maintains a dynamic 7-day temperature array by adding the newest reading and removing the oldest (e.g., updating `[21, 22, 23, 24, 25, 26, 27]` to `[22, 23, 24, 25, 26, 27, 28]`).
* **Morning Report:** Performs statistical heat-stress calculations and delivers a daily summary directly to the farmer.

### 3️⃣ Real-Time Daytime Emergency System (`Emergency Alerts`)

* **Daylight Monitoring:** Runs checks every 3 hours strictly during peak daytime hours (**6:00 AM – 6:00 PM**).
* **Instant Risk Trigger:** Sends immediate high-priority Telegram alerts if temperature spikes exceed safe crop thresholds, enabling instant cooling action.

### 4️⃣ Zero-Login Web Dashboard (`Webhook Integration & Dashboard`)

* **Token-Based Access:** Routes real-time data to a clean web dashboard via Webhook using a unique cryptographic token (`token`).
* **Seamless UX:** Eliminates passwords and complex logins while maintaining strict user data isolation.
* **Dashboard Analytics:** Displays live weather metrics, 7-day historical trends, risk percentages, and scientific mitigation protocols.
