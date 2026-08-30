 const WEBHOOK_URL = "https://n8ncloud.talaatsha.cfd/webhook/dashboard-data";

  const statusPill = document.getElementById("statusPill");
  const loadingState = document.getElementById("loadingState");
  const errorState = document.getElementById("errorState");
  const emptyState = document.getElementById("emptyState");
  const summaryRow = document.getElementById("summaryRow");
  const farmersGrid = document.getElementById("farmersGrid");

  const charts = [];

  function toggleAccordion(){
    const header = document.getElementById("accBtn");
    const content = document.getElementById("accContent");
    header.classList.toggle("active");
    content.classList.toggle("open");
  }

  function setStatus(text, cls){
    statusPill.textContent = text;
    statusPill.className = "status-pill" + (cls ? " " + cls : "");
  }

  function fmt(n, d=1){
    if(n === null || n === undefined || isNaN(n)) return "-";
    return Number(n).toFixed(d);
  }

  function getActionables(farmerItems){
    if(!farmerItems || farmerItems.length === 0){
      return [{ name: "General", action: "Optimal thermal parameters. Maintain standard monitoring schedule." }];
    }

    const actions = [];

    farmerItems.forEach(item => {
      const name = item.name;
      const isLivestock = name.toLowerCase().includes("cow") || name.toLowerCase().includes("livestock") || name.toLowerCase().includes("cows");
      const level = item.level;

      if(level === "red"){
        if(isLivestock){
          actions.push({ name, action: "Activate evaporative misting & high-capacity cooling fans immediately." });
          actions.push({ name, action: "Shift 65% of feed allocation to cooler nighttime hours." });
          actions.push({ name, action: "Ensure electrolyte-enriched water flow at 15°C–20°C." });
        } else {
          actions.push({ name, action: "Initiate pulse-sprinkling irrigation during early morning hours." });
          actions.push({ name, action: "Apply biostimulants / Silicic acid to regulate stomatal closure." });
          actions.push({ name, action: "Deploy 30% shade netting over sensitive crop zones." });
        }
      } else if(level === "yellow"){
        if(isLivestock){
          actions.push({ name, action: "Increase shaded area capacity & monitor breathing rate." });
          actions.push({ name, action: "Inspect automated water troughs for optimal flow rate." });
        } else {
          actions.push({ name, action: "Schedule preventive canopy irrigation within 12 hours." });
          actions.push({ name, action: "Apply organic mulch to stabilize soil temperature." });
        }
      } else {
        actions.push({ name, action: "Optimal thermal parameters. Maintain standard monitoring schedule." });
      }
    });

    return actions;
  }

  async function loadData(){
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if(!token) {
      errorState.style.display = "block";
      errorState.textContent = "Unauthorized: A valid, secure access token URL parameter is required.";
      setStatus("Unauthorized", "error");
      return;
    }

    loadingState.style.display = "block";
    errorState.style.display = "none";
    emptyState.style.display = "none";
    summaryRow.style.display = "none";
    farmersGrid.innerHTML = "";

    try{
      const res = await fetch(`${WEBHOOK_URL}?token=${encodeURIComponent(token)}`);
      if(!res.ok) throw new Error("HTTP " + res.status);
      
      let data = await res.json();
      if(!Array.isArray(data)) data = data.items || data.data || (data.farmerName ? [data] : []);

      loadingState.style.display = "none";

      if(data.length === 0){
        emptyState.style.display = "block";
        setStatus("Connected — No Data", "live");
        return;
      }

      renderSummary(data);
      renderFarmers(data);
      setStatus("Connected — " + data[0].farmerName, "live");
    } catch(err){
      loadingState.style.display = "none";
      errorState.style.display = "block";
      errorState.textContent = "Failed to fetch data: Invalid or expired dashboard token.";
      setStatus("Connection Error", "error");
    }
  }

  function overallLevel(farmer){
    const items = farmer.items || [];
    if(items.some(i => i.level === "red")) return "red";
    if(items.some(i => i.level === "yellow")) return "yellow";
    return "green";
  }

  function renderSummary(list){
    const total = list.length;
    const redCount = list.filter(f => overallLevel(f) === "red").length;
    const yellowCount = list.filter(f => overallLevel(f) === "yellow").length;
    const avgProb = Math.round(list.reduce((s,f) => s + (f.maxRiskProbability || 0), 0) / total);

    summaryRow.style.display = "grid";
    summaryRow.innerHTML = `
      <div class="summary-card">
        <div class="label">Total Farmers</div>
        <div class="value sky">${total}</div>
      </div>
      <div class="summary-card">
        <div class="label">Critical</div>
        <div class="value red">${redCount}</div>
      </div>
      <div class="summary-card">
        <div class="label">Warning</div>
        <div class="value wheat">${yellowCount}</div>
      </div>
      <div class="summary-card">
        <div class="label">Avg Risk Probability</div>
        <div class="value">${avgProb}%</div>
      </div>`;
  }

  function renderFarmers(list){
    charts.forEach(c => c.destroy());
    charts.length = 0;
    farmersGrid.innerHTML = "";

    list.forEach((farmer, idx) => {
      const level = overallLevel(farmer);
      const items = farmer.items || [];
      const history = farmer.temperatureHistory || [];
      const maxCumulative = Math.max(...items.map(i => i.cumulativeHeat || 0), 1);
      const topCumulative = Math.max(...items.map(i => i.cumulativeHeat || 0), 0);
      const actions = getActionables(items);

      const card = document.createElement("div");
      card.className = "farmer-card level-" + level;
      card.innerHTML = `
        <div class="farmer-head">
          <div>
            <div class="farmer-name">${farmer.farmerName || "—"}</div>
            <div class="farmer-meta">${fmt(farmer.currentTempC,1)}°C · wind ${farmer.windSpeed ?? "-"} km/h</div>
          </div>
          <div class="level-badge ${level}">${level === "red" ? "CRITICAL" : level === "yellow" ? "WARNING" : "SAFE"}</div>
        </div>

        <div class="metrics-row">
          <div class="metric">
            <div class="m-label">Z-SCORE</div>
            <div class="m-value">${fmt(farmer.zScore,2)}</div>
          </div>
          <div class="metric">
            <div class="m-label">RISK %</div>
            <div class="m-value">${farmer.maxRiskProbability ?? "-"}%</div>
          </div>
          <div class="metric">
            <div class="m-label">AVG 7D</div>
            <div class="m-value">${fmt(farmer.movingAverageC,1)}°</div>
          </div>
        </div>

        <div class="chart-wrap">
          <canvas id="chart-${idx}" role="img" aria-label="Temperature history chart for ${farmer.farmerName}"></canvas>
        </div>

        <div class="gdd-bar-wrap">
          <div class="gdd-label"><span>Cumulative thermal stress</span><span>${fmt(topCumulative,1)}°C-days</span></div>
          <div class="gdd-track"><div class="gdd-fill" style="width:${Math.min((topCumulative/Math.max(maxCumulative,5))*100,100)}%"></div></div>
        </div>

        <div class="items-list">
          ${items.map(i => `
            <div class="item-row">
              <span><span class="dot ${i.level}"></span>${i.name}</span>
              <span class="item-prob">${i.riskProbability}%</span>
            </div>
          `).join("")}
        </div>

        <div class="actions-box">
          <div class="actions-box-title">⚡ Actionable Mitigation Protocol</div>
          <ul class="actions-list">
            ${actions.map(a => `<li><strong>${a.name}:</strong> ${a.action}</li>`).join("")}
          </ul>
        </div>
      `;
      farmersGrid.appendChild(card);

      const ctx = card.querySelector("#chart-" + idx);
      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: history.map((_, i) => "D" + (i+1)),
          datasets: [{
            data: history,
            borderColor: level === "red" ? "#D6553D" : level === "yellow" ? "#E8A33D" : "#6FA05C",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: level === "red" ? "#D6553D" : level === "yellow" ? "#E8A33D" : "#6FA05C",
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display:false } },
          scales: {
            x: { ticks: { color: "#9CA894", font: { size: 10 } }, grid: { color: "#33402F" } },
            y: { ticks: { color: "#9CA894", font: { size: 10 } }, grid: { color: "#33402F" } }
          }
        }
      });
      charts.push(chart);
    });
  }

  loadData();
