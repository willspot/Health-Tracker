"use client";

import Image from "next/image";
import Nav from "./nav";
import { useState, useEffect } from "react";
import { fetchMetrics } from "./api/metrics";
import { updateMetric } from "./api/updateMetric";
import { ChartSection } from "./components/ChartSection";
import MetricInfoTooltip from "./components/MetricInfoTooltip";
import WeightTooltipTable from "./components/WeightTooltipTable";
import FoodTooltipTable from "./components/FoodTooltipTable";
import BloodStatusTooltipTable from "./components/BloodStatusTooltipTable";
import TemperatureTooltipTable from "./components/TemperatureTooltipTable";
import HeartRateTooltipTable from "./components/HeartRateTooltipTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const unitMap = {
  heart_rate: "bpm",
  temperature: "°C",
  weight: "kg",
  steps: "steps",
  blood_pressure_systolic: "mmHg",
  blood_pressure_diastolic: "mmHg",
  lungs: "L",
  food: "Kcal",
};

const labels = ["6", "5", "4", "3", "2", "1"];

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState("heart_rate");
  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });
  const [metrics, setMetrics] = useState<any>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState<{ calories?: number; steps?: number }>({});
  const [heartFlipped, setHeartFlipped] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      try {
        const response = await fetch(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          fetchGoals(token);
        } else {
          window.location.href = "/login";
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        window.location.href = "/login";
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGoals = async (token: string) => {
    const response = await fetch(`${API_URL}/goals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setGoals({
        calories: data.calories,
        steps: data.steps,
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchMetrics().then(setMetrics).catch(console.error);
    }
  }, [user]);

  const handleMetricSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await updateMetric(formData);
      console.log(res);
      if (res.status === "success") {
        setPopup({ message: "Metric added!", type: "success" });
        form.reset();
        setTimeout(async () => {
          setPopup({ message: "", type: null });
          // Refresh metrics in real time
          const newMetrics = await fetchMetrics();
          setMetrics(newMetrics);
          // Refresh goals in real time
          const token = localStorage.getItem("token");
          if (token) {
            await fetchGoals(token);
          }
        }, 2000);
      } else {
        setPopup({
          message: res.message || "Failed to add metric.",
          type: "error",
        });
      }
    } catch (err) {
      setPopup({ message: "An error occurred.", type: "error" });
      console.log(err);
    }
  };

  // function getWeightSub(weightArr: number[]) {
  //   if (!weightArr || weightArr.length === 0)
  //     return { sub: "No data", color: "#6b7280" };
  //   if (weightArr.length === 1)
  //     return { sub: "No previous data", color: "#6b7280" };
  //   const diff =
  //     weightArr[weightArr.length - 1] - weightArr[weightArr.length - 2];
  //   if (diff < 0)
  //     return { sub: `Lost ${Math.abs(diff).toFixed(1)} kg`, color: "#ef4444" };
  //   if (diff > 0)
  //     return { sub: `Gained ${diff.toFixed(1)} kg`, color: "#10b981" };
  //   return { sub: "No change", color: "#6b7280" };
  // }

  function getWeightSub(weightArr: (number | null | undefined)[]) {
    if (!weightArr || weightArr.length === 0)
      return { sub: "No data", color: "#6b7280" };
    if (weightArr.length === 1)
      return { sub: "No previous data", color: "#6b7280" };

    const last = weightArr[weightArr.length - 1];
    const prev = weightArr[weightArr.length - 2];

    if (typeof last !== "number" || typeof prev !== "number")
      return { sub: "Invalid data", color: "#6b7280" };

    const diff = last - prev;
    if (diff < 0)
      return { sub: `Lost ${Math.abs(diff).toFixed(1)} kg`, color: "#ef4444" };
    if (diff > 0)
      return { sub: `Gained ${diff.toFixed(1)} kg`, color: "#10b981" };
    return { sub: "No change", color: "#6b7280" };
  }

  function getHeartStatus(systolicArr = [], diastolicArr = []) {
    if (!systolicArr.length || !diastolicArr.length) {
      return {
        status: "Unknown",
        description: "No data available",
        color: "#6b7280",
      };
    }
    const systolic = systolicArr[systolicArr.length - 1];
    const diastolic = diastolicArr[diastolicArr.length - 1];

    if (systolic < 120 && diastolic < 80) {
      return {
        status: "Normal",
        description: "Healthy blood pressure, low risk",
        color: "#10b981",
      };
    }
    if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
      return {
        status: "Warning (Elevated)",
        description: "Slightly increased risk, lifestyle changes advised",
        color: "#f59e42",
      };
    }
    if (
      (systolic >= 130 && systolic <= 139) ||
      (diastolic >= 80 && diastolic <= 89)
    ) {
      return {
        status: "Danger (Mild Hypertension)",
        description:
          "Early high blood pressure, requires monitoring and possible treatment",
        color: "#f59e42",
      };
    }
    if (systolic >= 140 || diastolic >= 90) {
      if (systolic > 180 || diastolic > 120) {
        return {
          status: "Emergency (Crisis)",
          description: "Immediate medical attention needed",
          color: "#ef4444",
        };
      }
      return {
        status: "Danger (Moderate/Severe Hypertension)",
        description: "High risk, needs medical treatment",
        color: "#ef4444",
      };
    }
    return {
      status: "Unknown",
      description: "No data available",
      color: "#6b7280",
    };
  }

  const handleExport = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    let y = 40;
    doc.setFontSize(22);
    doc.setTextColor("#2563eb");
    doc.text("Health Tracker Report", 40, y);
    y += 30;
    doc.setFontSize(14);
    doc.setTextColor("#222");
    if (user) {
      doc.text(`Name: ${user.name}`, 40, y);
      y += 20;
      doc.text(`Email: ${user.email}`, 40, y);
      y += 30;
    }
    doc.setFontSize(16);
    doc.setTextColor("#2563eb");
    doc.text("Metrics Summary", 40, y);
    y += 20;
    doc.setFontSize(12);
    doc.setTextColor("#222");
    if (metrics) {
      const metricList = [
        { label: "Weight", value: metrics.weight?.at(-1), unit: "kg" },
        { label: "Food", value: metrics.food?.at(-1), unit: "Kcal" },
        { label: "Steps", value: metrics.steps?.at(-1), unit: "steps" },
        { label: "Heart Rate", value: metrics.heart_rate?.at(-1), unit: "bpm" },
        {
          label: "Temperature",
          value: metrics.temperature?.at(-1),
          unit: "°C",
        },
        {
          label: "Blood Pressure",
          value:
            metrics.blood_pressure?.systolic?.at(-1) &&
            metrics.blood_pressure?.diastolic?.at(-1)
              ? `${metrics.blood_pressure.systolic.at(
                  -1
                )}/${metrics.blood_pressure.diastolic.at(-1)}`
              : "--/--",
          unit: "mmHg",
        },
      ];
      metricList.forEach((m) => {
        doc.text(`${m.label}: ${m.value ?? "--"} ${m.unit}`, 60, y);
        y += 18;
      });
      y += 10;
      // Goals
      if (goals.calories || goals.steps) {
        doc.setFontSize(13);
        doc.setTextColor("#2563eb");
        doc.text("Goals", 40, y);
        y += 18;
        doc.setFontSize(12);
        doc.setTextColor("#222");
        if (goals.calories) {
          doc.text(`Calories: ${goals.calories} Kcal`, 60, y);
          y += 16;
        }
        if (goals.steps) {
          doc.text(`Steps: ${goals.steps}`, 60, y);
          y += 16;
        }
      }
    }
    // --- Metrics Summary Box ---
    y += 20;
    const boxX = 40;
    const boxW = 500;
    let boxH = 60; // will be recalculated
    const rowH = 28;
    const metricsToShow = [
      { label: "Weight", value: metrics?.weight?.at(-1) ?? "--", unit: "kg" },
      { label: "Food", value: metrics?.food?.at(-1) ?? "--", unit: "Kcal" },
      { label: "Steps", value: metrics?.steps?.at(-1) ?? "--", unit: "steps" },
      {
        label: "Heart Rate",
        value: metrics?.heart_rate?.at(-1) ?? "--",
        unit: "bpm",
      },
      {
        label: "Temperature",
        value: metrics?.temperature?.at(-1) ?? "--",
        unit: "°C",
      },
      {
        label: "Blood Pressure",
        value:
          metrics?.blood_pressure?.systolic?.at(-1) &&
          metrics?.blood_pressure?.diastolic?.at(-1)
            ? `${metrics.blood_pressure.systolic.at(
                -1
              )}/${metrics.blood_pressure.diastolic.at(-1)}`
            : "--/--",
        unit: "mmHg",
      },
    ];
    boxH = 50 + metricsToShow.length * rowH + 20;
    doc.setDrawColor("#2563eb");
    doc.setFillColor(234, 241, 251);
    doc.roundedRect(boxX, y, boxW, boxH, 12, 12, "F");
    // Section title
    doc.setFontSize(16);
    doc.setTextColor("#2563eb");
    doc.setFont("helvetica", "bold");
    doc.text("Metrics Summary", boxX + 20, y + 32);
    // Divider
    doc.setDrawColor("#2563eb");
    doc.setLineWidth(1);
    doc.line(boxX + 20, y + 38, boxX + boxW - 20, y + 38);
    // Table header
    let rowY = y + 54;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    // Metrics rows
    metricsToShow.forEach((m, i) => {
      // row background
      if (i % 2 === 0) {
        doc.setFillColor(255, 255, 255);
        doc.rect(boxX + 10, rowY - 14, boxW - 20, rowH, "F");
      }
      // Label
      doc.setTextColor("#444");
      doc.text(m.label, boxX + 30, rowY);
      // Value
      doc.setTextColor("#2563eb");
      doc.setFont("helvetica", "bold");
      doc.text(`${m.value} ${m.unit}`, boxX + boxW - 120, rowY, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");
      rowY += rowH;
    });
    y += boxH;

    y += 20;
    doc.setDrawColor("#2563eb");
    doc.setFillColor(234, 241, 251);
    doc.roundedRect(40, y, 500, 60, 8, 8, "F");
    doc.setFontSize(13);
    doc.setTextColor("#2563eb");
    doc.text("Summary:", 60, y + 25);
    doc.setFontSize(12);
    doc.setTextColor("#222");
    doc.text(
      "This report contains your latest health metrics and goals. Stay healthy!",
      60,
      y + 45
    );
    // Developer credit and GitHub link
    let creditY = y + 120;
    doc.setFontSize(11);
    doc.setTextColor("#888");
    doc.text("Developed by: Alabi-Williams Samuel (Willspot)", 40, creditY);
    creditY += 16;
    doc.setTextColor("#2563eb");
    doc.textWithLink("Github: https://github.com/willspot", 40, creditY, {
      url: "https://github.com/willspot",
    });

    doc.save("health-tracker-report.pdf");
  };

  // Show loading while checking user authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf1fb] to-[#e3e6ef]">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Nav onExport={handleExport} />
      {popup.type && (
        <div
          className={`fixed top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50
          ${
            popup.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {popup.message}
        </div>
      )}
      <div className="min-h-screen w-full bg-gradient-to-br from-[#eaf1fb] to-[#e3e6ef] flex flex-col items-center justify-center p-2 sm:p-10 mt-29">
        {!isLoading && (
          <span className="text-xl font-semibold text-blue-800 mb-6">
            Welcome to Your Health Dashboard {user?.name || "User"}
          </span>
        )}

        {/* Mobile Dashboard */}
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto sm:hidden">
          {/* Weight */}
          <div className="relative rounded-2xl bg-white/60 shadow-xl p-4 flex flex-col justify-between w-full">
            <div className="flex flex-row justify-between items-start h-full">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs text-gray-500 block">Weight</span>
                  <span
                    className="text-xs font-semibold block mt-1"
                    style={{ color: getWeightSub(metrics?.weight || []).color }}
                  >
                    {getWeightSub(metrics?.weight || []).sub}
                  </span>
                </div>
                <div className="mt-auto flex items-end gap-1">
                  {/* <span className="text-2xl font-bold text-blue-700">
                    {metrics?.weight?.length
                      ? metrics.weight[metrics.weight.length - 1].toFixed(1)
                      : "--"}
                  </span> */}
                  <span className="text-2xl font-bold text-blue-700">
                    {metrics?.weight?.length &&
                    typeof metrics.weight[metrics.weight.length - 1] ===
                      "number"
                      ? metrics.weight[metrics.weight.length - 1].toFixed(1)
                      : "--"}
                  </span>
                  <span className="text-xs text-gray-400 mb-1">kg</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                {/* <div className="w-10 h-4 bg-gray-200 rounded mb-2 mt-1" /> */}
                <div className="absolute top-4 right-8 w-28 h-20 bg-transparent z-10">
                  <div className="w-36 h-22 -mt-3">
                    <ChartSection
                      chartType="line"
                      chartData={{
                        labels,
                        datasets: [
                          {
                            label: "Weight (kg)",
                            data: metrics?.weight || [],
                            borderColor: "#4b5563",
                            backgroundColor: "transparent",
                            tension: 0.4,
                            fill: false,
                          },
                        ],
                      }}
                      chartOptions={{
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { display: false },
                          y: { display: false },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>
                {/* <span className="bg-white text-gray-800 text-xs font-semibold rounded-full px-3 py-1 shadow border border-gray-100">{metrics?.weight?.length ? metrics.weight[metrics.weight.length - 1].toFixed(1) : "--"}</span> */}
              </div>
            </div>
          </div>
          {/* Food */}
          <div className="relative rounded-2xl bg-white/60 shadow-xl p-4 flex flex-col justify-between w-full">
            <div className="flex flex-row justify-between items-start h-full">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs text-gray-500 block">Food</span>
                  <span className="text-xs text-gray-400 block mt-1">
                    {metrics?.food?.length && goals.calories
                      ? `${metrics.food[metrics.food.length - 1]}/${
                          goals.calories
                        } Kcal`
                      : `--/${goals.calories || "--"} Kcal`}
                  </span>
                </div>
                <div className="mt-auto flex items-end gap-1">
                  <span className="text-2xl font-bold text-blue-700">
                    {metrics?.food?.length
                      ? metrics.food[metrics.food.length - 1]
                      : "--"}
                  </span>
                  <span className="text-xs text-gray-400 mb-1">Kcal</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                {/* <div className="w-10 h-4 bg-gray-200 rounded mb-2 mt-1" /> */}
                {/* Food chart absolutely positioned at top right */}
                <div className="absolute top-4 right-8 w-28 h-20 bg-transparent z-10">
                  <div className="w-36 h-22 -mt-3">
                    <ChartSection
                      chartType="bar"
                      chartData={{
                        labels,
                        datasets: [
                          {
                            label: "Food Calories",
                            data: metrics?.food || [],
                            backgroundColor: "#8b5cf6",
                          },
                        ],
                      }}
                      chartOptions={{
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { display: false },
                          y: { display: false },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                      height={80}
                    />
                  </div>
                </div>
                {/* <span className="bg-white text-gray-800 text-xs font-semibold rounded-full px-3 py-1 shadow border border-gray-100">253</span> */}
              </div>
            </div>
          </div>
          {/* Steps Gauge */}
          <div className="relative rounded-2xl bg-white/60 shadow-xl flex flex-col items-center justify-center w-full p-4">
            <div className="relative w-full max-w-[300px] h-[180px] flex items-center justify-center">
              {/* <svg className="absolute top-0 left-1/2 -translate-x-1/2" width="180" height="180">
                <circle cx="90" cy="90" r="70" stroke="#e0e7ef" strokeWidth="14" fill="none" />
                <circle cx="90" cy="90" r="70" stroke="#2563eb" strokeWidth="14" fill="none" strokeDasharray="440" strokeDashoffset="120" strokeLinecap="round" />
              </svg> */}

              <div className="flex flex-col items-center -mx-8 -mt-32">
                <span className="text-3xl font-bold text-blue-700">
                  {metrics?.steps?.length
                    ? metrics.steps[metrics.steps.length - 1].toLocaleString()
                    : "--"}
                </span>
                <span className="text-base text-sm text-gray-400">Steps</span>
              </div>
              {/* Steps chart absolutely centered between value and 10,000 Steps */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-76 h-19 bg-transparent z-10">
                <ChartSection
                  chartType="bar"
                  chartData={{
                    labels,
                    datasets: [
                      {
                        label: "Steps",
                        data: metrics?.steps || [],
                        backgroundColor: "#10b981",
                        borderRadius: 6,
                      },
                    ],
                  }}
                  chartOptions={{
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false } },
                      y: { display: false },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                  height={80}
                />
              </div>

              {/* Steps goal */}
              <div className="flex flex-col items-center -mx-8 mt-42">
                <span className="text-xs text-gray-800 mt-2">
                  {goals.steps
                    ? `${goals.steps.toLocaleString()} Steps`
                    : "-- Steps"}
                </span>
              </div>
            </div>
          </div>
          {/* Heart Image transparent with Heart Rate */}
          <div className="relative flex items-center justify-center w-full">
            <Image
              src="/images/heart.png"
              priority
              alt="Heart"
              width={180}
              height={180}
              className="z-0 w-full max-w-[180px]"
            />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-2xl bg-white/60 shadow-xl px-6 py-3 flex flex-col justify-center items-center z-10 min-w-[140px]">
              <span className="text-sm text-gray-500 mb-1">Heart Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-blue-700">
                  {metrics?.heart_rate?.length
                    ? metrics.heart_rate[metrics.heart_rate.length - 1]
                    : "--"}
                </span>
                <span className="text-sm text-gray-400">bpm</span>
                {/* Animated heart rate */}
                <svg
                  width="70"
                  height="28"
                  className="ml-4"
                  style={{
                    strokeDasharray: 100,
                    strokeDashoffset: 0,
                    animation: "heartbeat-move 1.2s linear infinite",
                  }}
                >
                  <polyline
                    points="0,14 12,14 18,6 24,22 30,14 70,14"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    style={{
                      filter: "drop-shadow(0 0 4px #2563eb)",
                      animation: "heartbeat-blink 1.2s linear infinite",
                    }}
                  />
                </svg>
                <style jsx>{`
                  @keyframes heartbeat-move {
                    0% {
                      stroke-dashoffset: 100;
                    }
                    80% {
                      stroke-dashoffset: 0;
                    }
                    100% {
                      stroke-dashoffset: 0;
                    }
                  }
                  @keyframes heartbeat-blink {
                    0%,
                    60%,
                    100% {
                      stroke: #2563eb;
                      filter: drop-shadow(0 0 4px #2563eb);
                    }
                    65%,
                    75% {
                      stroke: #22d3ee;
                      filter: drop-shadow(0 0 10px #22d3ee);
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
          {/* Body Image */}
          <div className="rounded-2xl bg-white/60 shadow-xl flex items-center justify-center w-full p-4">
            <Image
              src="/images/output.png"
              alt="Body"
              width={80}
              height={220}
              className="w-full max-w-[80px]"
            />
          </div>
          {/* Heart Box */}
          <div className="relative rounded-2xl bg-white/70 shadow-xl p-4 flex flex-col items-center w-full border border-gray-200 h-48">
            <div className="absolute top-4 right-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#bdbdbd"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            {(() => {
              const { status, description, color } = getHeartStatus(
                metrics?.blood_pressure?.systolic,
                metrics?.blood_pressure?.diastolic
              );
              return (
                <>
                  <div
                    className="absolute top-4 right-4 cursor-pointer"
                    onClick={() => setHeartFlipped((f) => !f)}
                  >
                    <svg
                      style={{
                        transform: heartFlipped ? "scaleX(-1)" : "none",
                        transition: "transform 0.3s",
                      }}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#bdbdbd"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  {!heartFlipped ? (
                    <>
                      <div className="w-full h-32">
                        <Image
                          src="/images/heart.png"
                          alt="Heart"
                          width={140}
                          height={140}
                          priority
                          className="mb-2 heart-beat"
                          style={{
                            position: "absolute",
                            left: "33%",
                            transform: "translateX(-50%)",
                            top: "40px",
                          }}
                        />
                      </div>
                      <div className="mt-auto w-full">
                        <div className="text-base font-semibold text-gray-800">
                          Heart
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs" style={{ color }}>
                            {status}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-1 flex-col justify-center items-center w-full h-full">
                      <span className="text-base font-bold" style={{ color }}>
                        {status}
                      </span>
                      <span className="text-xs text-center mt-2 text-gray-700">
                        {description}
                      </span>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
          {/* Lungs Box */}
          <div className="relative rounded-2xl bg-white/40 shadow p-4 flex flex-col items-center w-full border border-gray-200">
            <div className="w-full h-32">
              <Image
                src="/images/lungs.png"
                alt="Lungs"
                width={140}
                height={140}
                className="mb-2"
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: "40px",
                }}
              />
            </div>
            <div className="mt-auto w-full">
              <div className="text-base font-semibold text-gray-800">Lungs</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-xs text-gray-500">Normal</span>
              </div>
            </div>
          </div>
          {/* Blood Status */}
          <div className="relative rounded-2xl bg-white/60 border border-gray-200 p-4 flex flex-col justify-between w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              <span className="text-sm font-medium text-gray-700">
                Blood Status
              </span>
            </div>
            {/* Blood Pressure chart absolutely positioned at bottom left edge */}
            <div className="absolute bottom-2 left-45 w-36 h-22 bg-transparent z-10">
              <ChartSection
                chartType="line"
                chartData={{
                  labels,
                  datasets: [
                    {
                      label: "Systolic",
                      data: metrics?.blood_pressure?.systolic || [],
                      borderColor: "#3b82f6",
                      backgroundColor: "transparent",
                      tension: 0.4,
                      fill: false,
                    },
                    {
                      label: "Diastolic",
                      data: metrics?.blood_pressure?.diastolic || [],
                      borderColor: "#60a5fa",
                      backgroundColor: "transparent",
                      tension: 0.4,
                      fill: false,
                    },
                  ],
                }}
                chartOptions={{
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                height={80}
              />
            </div>
            <div className="flex items-end justify-between">
              <div className="w-10 h-6 bg-gray-100 rounded" />
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-blue-700">
                  {metrics?.blood_pressure?.systolic?.length &&
                  metrics?.blood_pressure?.diastolic?.length
                    ? `${
                        metrics.blood_pressure.systolic[
                          metrics.blood_pressure.systolic.length - 1
                        ]
                      }/${
                        metrics.blood_pressure.diastolic[
                          metrics.blood_pressure.diastolic.length - 1
                        ]
                      }`
                    : "--/--"}
                </span>
                <span className="text-xs text-gray-400">mmHg</span>
              </div>
            </div>
          </div>
          {/* Temperature */}
          <div className="relative rounded-2xl bg-white/60 border border-gray-200 p-4 flex flex-col justify-between w-full">
            <div className="flex items-center gap-2 mb-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f87171"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v10" />
                <circle cx="12" cy="18" r="4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Temperature
              </span>
            </div>
            {/* Placeholder for chart */}
            <div className="absolute bottom-2 left-45 w-36 h-22 bg-transparent z-10">
              <ChartSection
                chartType="line"
                chartData={{
                  labels,
                  datasets: [
                    {
                      label: "Temperature (°C)",
                      data: metrics?.temperature || [],
                      borderColor: "#f59e0b",
                      backgroundColor: "transparent",
                      tension: 0.4,
                      fill: false,
                    },
                  ],
                }}
                chartOptions={{
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                height={80}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="w-10 h-2 bg-gray-100 rounded" />
              <span className="text-lg font-bold text-blue-700 ml-2">
                {metrics?.temperature?.length
                  ? `${metrics.temperature[metrics.temperature.length - 1]}°`
                  : "-- °"}
              </span>
            </div>
          </div>
          {/* Heart Rate */}
          <div className="relative rounded-2xl bg-white/60 border border-gray-200 p-4 flex flex-col justify-between w-full">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/images/heart.png"
                priority
                alt="Heart"
                width={18}
                height={18}
              />
              <span className="text-sm font-medium text-gray-700">
                Heart Rate
              </span>
            </div>
            {/* Heart Rate chart absolutely positioned at bottom left edge */}
            <div className="absolute bottom-2 left-45 w-36 h-22 bg-transparent z-10">
              <ChartSection
                chartType="line"
                chartData={{
                  labels,
                  datasets: [
                    {
                      label: "Heart Rate (bpm)",
                      data: metrics?.heart_rate || [],
                      borderColor: "#ef4444",
                      backgroundColor: "transparent",
                      tension: 0.4,
                      fill: false,
                    },
                  ],
                }}
                chartOptions={{
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                height={80}
              />
            </div>
            <div className="flex items-end justify-end mt-2 w-full">
              <div className="flex flex-col items-end ml-2">
                <span className="text-lg font-bold text-blue-700">
                  {metrics?.heart_rate?.length
                    ? metrics.heart_rate[metrics.heart_rate.length - 1]
                    : "--"}
                </span>
                <span className="text-xs text-gray-400">bpm</span>
              </div>
            </div>
          </div>
          {/* Summary with tooltips for */}
          <div className="rounded-2xl bg-white/60 border border-gray-200 p-3 flex flex-col gap-4 min-h-[90px] mt-2">
            {/* tooltip for weight, food */}
            {/* <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Weight</span>
              <MetricInfoTooltip
                value={metrics?.weight?.length ? metrics.weight[metrics.weight.length - 1] : "--"}
                unit="kg"
                className="mr-4"
              >
                <WeightTooltipTable />
              </MetricInfoTooltip>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Food</span>
              <MetricInfoTooltip
                value={metrics?.food?.length ? metrics.food[metrics.food.length - 1] : "--"}
                unit="Kcal"
                className="mr-4"
              >
                <FoodTooltipTable />
              </MetricInfoTooltip>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Steps</span>
              <span className="text-xs text-gray-400">
                {metrics?.steps?.length
                  ? `${metrics.steps[metrics.steps.length - 1]} steps`
                  : "-- steps"}
              </span>
            </div>
          </div> */}
            {/* tooltip for blood status, temp, heart rate */}
            {/* <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Blood Status</span>
              <MetricInfoTooltip
                value={metrics?.blood_pressure?.systolic?.length && metrics?.blood_pressure?.diastolic?.length
                  ? `${metrics.blood_pressure.systolic[metrics.blood_pressure.systolic.length - 1]}/${metrics.blood_pressure.diastolic[metrics.blood_pressure.diastolic.length - 1]}`
                  : "--/--"}
                unit="mmHg"
                className="mr-4"
              >
                <BloodStatusTooltipTable />
              </MetricInfoTooltip>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Temperature</span>
              <MetricInfoTooltip
                value={metrics?.temperature?.length ? metrics.temperature[metrics.temperature.length - 1] : "--"}
                unit="°C"
                className="mr-4"
              >
                <TemperatureTooltipTable />
              </MetricInfoTooltip>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Heart Rate</span>
              <MetricInfoTooltip
                value={metrics?.heart_rate?.length ? metrics.heart_rate[metrics.heart_rate.length - 1] : "--"}
                unit="bpm"
              >
                <HeartRateTooltipTable />
              </MetricInfoTooltip>
            </div>
          </div> */}
            <div className="flex items-center gap-4 w-full mt-2">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-blue-900 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <span className="bg-blue-900 text-white text-xs font-semibold rounded-full px-4 py-1">
                Summary
              </span>
            </div>
          </div>
        </div>

        {/* Desktop layout will be hidden on mobile */}
        <div className="hidden sm:grid w-full max-w-7xl grid-cols-[385px_480px_260px] grid-rows-[120px_340px] gap-8 bg-white/0">
          {/* Weight & Food side by side */}
          <div className="col-start-1 col-end-2 w-[500px] h-[140px] row-start-1 row-end-2 flex gap-4">
            {/* Weight */}
            <div className="relative flex-1 rounded-2xl bg-white/60 shadow-xl p-4 flex flex-col justify-between">
              <div className="flex flex-row justify-between items-start h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs text-gray-600 block">Weight</span>
                    <span
                      className="text-xs font-semibold block mt-1"
                      style={{
                        color: getWeightSub(metrics?.weight || []).color,
                      }}
                    >
                      {getWeightSub(metrics?.weight || []).sub}
                    </span>
                  </div>

                  <div className="mt-auto flex items-end gap-1">
                    {/* <span className="text-2xl font-bold text-blue-700">
                      {metrics?.weight?.length
                        ? metrics.weight[metrics.weight.length - 1].toFixed(1)
                        : "--"}
                    </span> */}
                    <span className="text-2xl font-bold text-blue-700">
                      {metrics?.weight?.length &&
                      typeof metrics.weight[metrics.weight.length - 1] ===
                        "number"
                        ? metrics.weight[metrics.weight.length - 1].toFixed(1)
                        : "--"}
                    </span>
                    <span className="text-xs text-gray-600 mb-1">kg</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-full">
                  {/* Placeholder for bar chart */}
                  {/* <div className="w-10 h-4 bg-gray-200 rounded mb-2 mt-1" /> */}
                  {/* weight chart */}
                  <div className="absolute top-4 right-8 w-28 h-20 bg-transparent z-10">
                    <div className="w-36 h-22 -mt-4">
                      <ChartSection
                        chartType="line"
                        chartData={{
                          labels,
                          datasets: [
                            {
                              label: "Weight (kg)",
                              data: metrics?.weight || [],
                              borderColor: "#4b5563",
                              backgroundColor: "transparent",
                              tension: 0.4,
                              fill: false,
                            },
                          ],
                        }}
                        chartOptions={{
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { display: false },
                            y: { display: false },
                          },
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>
                  {/* <span className="bg-white text-gray-800 text-xs font-semibold rounded-full px-3 py-1 shadow border border-gray-100">{metrics?.weight?.length ? metrics.weight[metrics.weight.length - 1].toFixed(1) : "--"}</span> */}
                </div>
              </div>
            </div>
            {/* Food */}
            <div className="relative flex-1 rounded-2xl bg-white/60 shadow-xl p-4 flex flex-col justify-between">
              <div className="flex flex-row justify-between items-start h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs text-gray-600 block">Food</span>
                    <span className="text-xs text-gray-600 block mt-1">
                      {metrics?.food?.length && goals.calories
                        ? `${metrics.food[metrics.food.length - 1]}/${
                            goals.calories
                          } Kcal`
                        : `--/${goals.calories || "--"} Kcal`}
                    </span>
                  </div>
                  <div className="mt-auto flex items-end gap-1">
                    <span className="text-2xl font-bold text-blue-700">
                      {metrics?.food?.length
                        ? metrics.food[metrics.food.length - 1]
                        : "--"}
                    </span>
                    <span className="text-xs text-gray-400 mb-1">Kcal</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-full">
                  {/* Placeholder for bar chart */}
                  {/* <div className="w-10 h-4 bg-gray-200 rounded mb-2 mt-1" /> */}
                  {/* Food chart absolutely positioned at top right */}
                  <div className="absolute top-4 right-8 w-28 h-20 bg-transparent z-10">
                    <div className="w-36 h-22 -mt-3">
                      <ChartSection
                        chartType="bar"
                        chartData={{
                          labels,
                          datasets: [
                            {
                              label: "Food Calories",
                              data: metrics?.food || [],
                              backgroundColor: "#8b5cf6",
                            },
                          ],
                        }}
                        chartOptions={{
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { display: false },
                            y: { display: false },
                          },
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                        height={80}
                      />
                    </div>
                  </div>
                  {/* <span className="bg-white text-gray-800 text-xs font-semibold rounded-full px-3 py-1 shadow border border-gray-100">253</span> */}
                </div>
              </div>
            </div>
          </div>
          {/* Steps Gauge */}
          <div className="col-start-1 col-end-2 row-start-2 w-[500px] h-[300px] row-end-3 rounded-2xl bg-white/60 shadow-xl flex flex-col items-center justify-center">
            <div className="relative w-[340px] h-[340px] flex items-center justify-center">
              {/* Circular progress (static) */}
              {/* <svg className="absolute top-0" width="300" height="300">
                <circle cx="150" cy="150" r="110" stroke="#e0e7ef" strokeWidth="14" fill="none" />
                <circle cx="150" cy="150" r="110" stroke="#2563eb" strokeWidth="14" fill="none" strokeDasharray="742" strokeDashoffset="230" strokeLinecap="round" />
              </svg> */}
              <div className="flex flex-col items-center -mx-8 -mt-52">
                <span className="text-3xl font-bold text-blue-700">
                  {metrics?.steps?.length
                    ? metrics.steps[metrics.steps.length - 1].toLocaleString()
                    : "--"}
                </span>
                <span className="text-base text-sm text-gray-400">Steps</span>
              </div>
              {/* Steps chart absolutely centered between value and 10,000 Steps */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-76 h-19 bg-transparent z-10">
                <ChartSection
                  chartType="bar"
                  chartData={{
                    labels,
                    datasets: [
                      {
                        label: "Steps",
                        data: metrics?.steps || [],
                        backgroundColor: "#10b981",
                        borderRadius: 6,
                      },
                    ],
                  }}
                  chartOptions={{
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false } },
                      y: { display: false },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                  height={80}
                />
              </div>

              {/* Steps goal */}
              <div className="flex flex-col items-center -mx-8 mt-52">
                <span className="text-xs text-gray-800 mt-2">
                  {goals.steps
                    ? `${goals.steps.toLocaleString()} Steps`
                    : "-- Steps"}
                </span>
              </div>
            </div>
          </div>
          {/* Heart Image transparent with Heart Rate track overlay */}
          <div className="col-start-2 col-end-3 row-start-1 w-[580px] h-[490px] row-end-3 relative flex items-center justify-center">
            <Image
              src="/images/heart.png"
              priority
              alt="Heart"
              width={420}
              height={420}
              className="z-0"
            />
            {/* Heart Rate overlay */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-2xl bg-white/60 shadow-xl px-10 py-6 flex flex-col justify-center items-center z-10 min-w-[240px]">
              <span className="text-base text-gray-500 mb-1">Heart Rate</span>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold text-blue-700">
                  {metrics?.heart_rate?.length
                    ? metrics.heart_rate[metrics.heart_rate.length - 1]
                    : "--"}
                </span>
                <span className="text-base text-gray-400">bpm</span>
                <span className="relative flex items-center">
                  {/* Animated heart rate */}
                  <svg
                    width="70"
                    height="28"
                    className="ml-4"
                    style={{
                      strokeDasharray: 100,
                      strokeDashoffset: 0,
                      animation: "heartbeat-move 1.2s linear infinite",
                    }}
                  >
                    <polyline
                      points="0,14 12,14 18,6 24,22 30,14 70,14"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                      style={{
                        filter: "drop-shadow(0 0 4px #2563eb)",
                        animation: "heartbeat-blink 1.2s linear infinite",
                      }}
                    />
                  </svg>
                  <style jsx>{`
                    @keyframes heartbeat-move {
                      0% {
                        stroke-dashoffset: 100;
                      }
                      80% {
                        stroke-dashoffset: 0;
                      }
                      100% {
                        stroke-dashoffset: 0;
                      }
                    }
                    @keyframes heartbeat-blink {
                      0%,
                      60%,
                      100% {
                        stroke: #2563eb;
                        filter: drop-shadow(0 0 4px #2563eb);
                      }
                      65%,
                      75% {
                        stroke: #22d3ee;
                        filter: drop-shadow(0 0 10px #22d3ee);
                      }
                    }
                  `}</style>
                </span>
              </div>
            </div>
          </div>
          {/* Body Image */}
          <div className="col-start-3 col-end-4 row-start-1 w-[240px] h-[450px] row-end-3 rounded-2xl bg-white/60 shadow-xl flex items-center justify-center">
            <Image
              src="/images/output.png"
              alt="Body"
              width={260}
              height={220}
              className="w-full max-w-[290px]"
            />
          </div>

          {/* Heart and Lungs */}
          <div className="w-full flex gap-6 justify-between">
            {/* Heart Box */}
            <div className="relative rounded-2xl bg-white/70 shadow-xl p-6 flex flex-col items-center h-[300px] min-w-[220px] border border-gray-200 transition-transform duration-500">
              {/* Arrow icon top right */}
              <div
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => setHeartFlipped((f) => !f)}
              >
                <svg
                  style={{
                    transform: heartFlipped ? "scaleX(-1)" : "none",
                    transition: "transform 0.3s",
                  }}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#bdbdbd"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              {!heartFlipped ? (
                <>
                  {/* Heartbeat animation with class heart-beat */}
                  <Image
                    src="/images/heart.png"
                    priority
                    alt="Heart"
                    width={170}
                    height={70}
                    className="mb-4 heart-beat"
                  />
                  <div className="mt-auto w-full">
                    <div className="text-lg font-semibold text-gray-800">
                      Heart
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{
                          backgroundColor: getHeartStatus(
                            metrics?.blood_pressure?.systolic,
                            metrics?.blood_pressure?.diastolic
                          ).color,
                        }}
                      />
                      <span
                        className="text-sm"
                        style={{
                          color: getHeartStatus(
                            metrics?.blood_pressure?.systolic,
                            metrics?.blood_pressure?.diastolic
                          ).color,
                        }}
                      >
                        {
                          getHeartStatus(
                            metrics?.blood_pressure?.systolic,
                            metrics?.blood_pressure?.diastolic
                          ).status
                        }
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col justify-center items-center w-full h-full">
                  <span
                    className="text-lg font-bold"
                    style={{
                      color: getHeartStatus(
                        metrics?.blood_pressure?.systolic,
                        metrics?.blood_pressure?.diastolic
                      ).color,
                    }}
                  >
                    {
                      getHeartStatus(
                        metrics?.blood_pressure?.systolic,
                        metrics?.blood_pressure?.diastolic
                      ).status
                    }
                  </span>
                  <span className="text-sm text-center mt-2 text-gray-700">
                    {
                      getHeartStatus(
                        metrics?.blood_pressure?.systolic,
                        metrics?.blood_pressure?.diastolic
                      ).description
                    }
                  </span>
                </div>
              )}
            </div>
            {/* Lungs Box */}
            <div className="rounded-2xl bg-white/40 shadow p-6 flex flex-col items-center h-[300px] min-w-[220px] border border-gray-200 mr-8">
              <Image
                src="/images/lungs.png"
                alt="Lungs"
                width={150}
                height={70}
                className="mb-4"
              />
              <div className="mt-auto w-full">
                <div className="text-lg font-semibold text-gray-800">Lungs</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  <span className="text-sm text-gray-500">Normal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invisible spacer div */}
          <div className="w-[40px] h-[300px] bg-transparent pointer-events-none select-none" />

          {/* 3 cards on top, 1 wide card below */}
          <div className="flex-1 flex flex-col w-[650px] h-[340px] gap-6 -ml-100">
            {/* Top 3 cards */}
            <div className="grid grid-cols-3 gap-6">
              {/* Blood Status */}
              <div className="relative rounded-2xl bg-white/60 border border-gray-200 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center gap-2 -mt-4 mb-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  <span className="text-sm font-medium text-gray-700">
                    Blood Status
                  </span>
                </div>
                <div className="flex items-end justify-between mt-2">
                  {/* Placeholder for chart */}
                  {/* Blood Pressure chart absolutely positioned at bottom left edge */}
                  <div className="absolute bottom-2 left-0 w-36 h-22 bg-transparent z-10">
                    <ChartSection
                      chartType="line"
                      chartData={{
                        labels,
                        datasets: [
                          {
                            label: "Systolic",
                            data: metrics?.blood_pressure?.systolic || [],
                            borderColor: "#3b82f6",
                            backgroundColor: "transparent",
                            tension: 0.4,
                            fill: false,
                          },
                          {
                            label: "Diastolic",
                            data: metrics?.blood_pressure?.diastolic || [],
                            borderColor: "#60a5fa",
                            backgroundColor: "transparent",
                            tension: 0.4,
                            fill: false,
                          },
                        ],
                      }}
                      chartOptions={{
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { display: false },
                          y: { display: false },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                      height={80}
                    />
                  </div>
                  <div className="w-16 h-10 bg-gray-100 rounded" />
                  <div className="flex flex-col items-end ml-31 ">
                    {metrics?.blood_pressure?.systolic?.length &&
                    metrics?.blood_pressure?.diastolic?.length ? (
                      <div className="flex flex-col items-end leading-tight">
                        <span
                          className="font-semibold text-blue-700"
                          style={{ fontSize: "18px" }}
                        >
                          {
                            metrics.blood_pressure.systolic[
                              metrics.blood_pressure.systolic.length - 1
                            ]
                          }
                        </span>
                        <span className="text-xs text-gray-900 font-bold">
                          /
                        </span>
                        <span
                          className="font-semibold text-blue-700"
                          style={{ fontSize: "18px" }}
                        >
                          {
                            metrics.blood_pressure.diastolic[
                              metrics.blood_pressure.diastolic.length - 1
                            ]
                          }
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-blue-700">
                        --/--
                      </span>
                    )}
                    <span className="text-xs text-gray-400">mmHg</span>
                  </div>
                </div>
              </div>
              {/* Temperature */}
              <div className="relative rounded-2xl bg-white/60 border border-gray-200 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center gap-2 -mt-4 mb-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v10" />
                    <circle cx="12" cy="18" r="4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Temperature
                  </span>
                </div>
                <div className="flex items-end justify-between mt-2">
                  {/* Placeholder for chart */}
                  <div className="absolute bottom-2 left-0 w-36 h-22 bg-transparent z-10">
                    <ChartSection
                      chartType="line"
                      chartData={{
                        labels,
                        datasets: [
                          {
                            label: "Temperature (°C)",
                            data: metrics?.temperature || [],
                            borderColor: "#f59e0b",
                            backgroundColor: "transparent",
                            tension: 0.4,
                            fill: false,
                          },
                        ],
                      }}
                      chartOptions={{
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { display: false },
                          y: { display: false },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                      height={80}
                    />
                  </div>
                  <div className="flex flex-col items-end ml-2 ml-27">
                    <span className="text-2xl font-bold text-blue-700 ml-4">
                      {metrics?.temperature?.length
                        ? `${
                            metrics.temperature[metrics.temperature.length - 1]
                          }°`
                        : "-- °"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Heart Rate */}
              <div className="relative rounded-2xl bg-white/60 border border-gray-200 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/images/heart.png"
                    priority
                    alt="Heart"
                    className="-mt-4"
                    width={18}
                    height={18}
                  />
                  <span className="text-sm font-medium text-gray-700 -mt-4">
                    Heart Rate
                  </span>
                </div>
                <div className="flex items-end justify-between mt-2">
                  {/* Placeholder for chart */}
                  {/* Heart Rate chart absolutely positioned at bottom left edge */}
                  <div className="absolute bottom-2 left-0 w-36 h-22 bg-transparent z-10">
                    <ChartSection
                      chartType="line"
                      chartData={{
                        labels,
                        datasets: [
                          {
                            label: "Heart Rate (bpm)",
                            data: metrics?.heart_rate || [],
                            borderColor: "#ef4444",
                            backgroundColor: "transparent",
                            tension: 0.4,
                            fill: false,
                          },
                        ],
                      }}
                      chartOptions={{
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { display: false },
                          y: { display: false },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                      height={80}
                    />
                  </div>

                  <div className="flex flex-col items-end ml-2 ml-32">
                    <span className="text-2xl font-bold text-blue-700">
                      {metrics?.heart_rate?.length
                        ? metrics.heart_rate[metrics.heart_rate.length - 1]
                        : "--"}
                    </span>
                    <span className="text-xs text-gray-400">bpm</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Summary */}
            <div className="rounded-2xl bg-white/60 border border-gray-200 p-3 flex flex-col gap-4 min-h-[90px] mt-2">
              {/* tooltip for weight, food */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Weight
                </span>
                <MetricInfoTooltip
                  value={
                    metrics?.weight?.length
                      ? metrics.weight[metrics.weight.length - 1]
                      : "--"
                  }
                  unit="kg"
                  className="mr-10"
                >
                  <WeightTooltipTable />
                </MetricInfoTooltip>
                <span className="text-sm font-medium text-gray-700">Food</span>
                <MetricInfoTooltip
                  value={
                    metrics?.food?.length
                      ? metrics.food[metrics.food.length - 1]
                      : "--"
                  }
                  unit="Kcal"
                  className="mr-10"
                >
                  <FoodTooltipTable />
                </MetricInfoTooltip>
                <span className="text-sm font-medium text-gray-700">Steps</span>
                <span className="text-xs text-gray-400">
                  {metrics?.steps?.length
                    ? `${metrics.steps[metrics.steps.length - 1]} steps`
                    : "-- steps"}
                </span>
              </div>
              {/* tooltip for blood status, temp, heart rate */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Blood Status
                </span>
                <MetricInfoTooltip
                  value={
                    metrics?.blood_pressure?.systolic?.length &&
                    metrics?.blood_pressure?.diastolic?.length
                      ? `${
                          metrics.blood_pressure.systolic[
                            metrics.blood_pressure.systolic.length - 1
                          ]
                        }/${
                          metrics.blood_pressure.diastolic[
                            metrics.blood_pressure.diastolic.length - 1
                          ]
                        }`
                      : "--/--"
                  }
                  unit="mmHg"
                  className="mr-10"
                >
                  <BloodStatusTooltipTable />
                </MetricInfoTooltip>
                <span className="text-sm font-medium text-gray-700">
                  Temperature
                </span>
                <MetricInfoTooltip
                  value={
                    metrics?.temperature?.length
                      ? metrics.temperature[metrics.temperature.length - 1]
                      : "--"
                  }
                  unit="°C"
                  className="mr-10"
                >
                  <TemperatureTooltipTable />
                </MetricInfoTooltip>
                <span className="text-sm font-medium text-gray-700">
                  Heart Rate
                </span>
                <MetricInfoTooltip
                  value={
                    metrics?.heart_rate?.length
                      ? metrics.heart_rate[metrics.heart_rate.length - 1]
                      : "--"
                  }
                  unit="bpm"
                >
                  <HeartRateTooltipTable />
                </MetricInfoTooltip>
              </div>

              <div className="flex items-center gap-4 w-full">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-blue-900 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <span className="bg-blue-900 text-white text-xs font-semibold rounded-full px-4 py-1">
                  Summary
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* + Action Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-white text-white hover:text-black rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-colors duration-200"
        aria-label="Add"
        onClick={() => setShowModal(true)}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5v14m7-7H5"
          />
        </svg>
      </button>
      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[1000] flex justify-center items-center bg-black/50 backdrop-blur-10"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-8 rounded-xl w-[300px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Add New Metric
            </h3>
            <form
              id="metricForm"
              className="flex flex-col gap-3"
              onSubmit={handleMetricSubmit}
            >
              <label className="text-sm text-slate-900 font-medium">
                Type:
              </label>
              <select
                name="type"
                className="w-full mb-2 border rounded px-2 py-1 text-gray-800"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="heart_rate">Heart Rate</option>
                <option value="temperature">Temperature</option>
                <option value="weight">Weight</option>
                <option value="steps">Steps</option>
                <option value="blood_pressure_systolic">
                  Blood Pressure Systolic
                </option>
                <option value="blood_pressure_diastolic">
                  Blood Pressure Diastolic
                </option>
                <option value="food">Food</option>
              </select>
              <label className="text-sm font-medium text-gray-800">
                Value:
              </label>
              <div className="flex items-center border rounded px-2 py-1 mb-2">
                <input
                  type="number"
                  name="value"
                  id="valueInput"
                  required
                  placeholder={`e.g. 70 ${unitMap[selectedType]}`}
                  className="flex-1 min-w-0 text-gray-800 placeholder-gray-400 outline-none bg-transparent pr-2 text-base"
                />
                <span
                  id="unitDisplay"
                  className="ml-2 text-slate-900 min-w-[48px] text-right"
                >
                  {unitMap[selectedType]}
                </span>
              </div>
              {["steps", "food"].includes(selectedType) && (
                <div id="goalInputGroup" className="flex flex-col mb-2">
                  <div className="flex items-center border rounded px-2 py-1">
                    <span className="text-gray-400 mr-2 whitespace-nowrap">
                      Set Goal:
                    </span>
                    <input
                      type="number"
                      name="metric_goal"
                      id="metricGoalInput"
                      placeholder="e.g. 1800"
                      className="flex-1 min-w-0 border-0 outline-none text-gray-800 placeholder-gray-400 bg-transparent text-base"
                    />
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
