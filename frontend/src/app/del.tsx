"use client";

import Image from "next/image";
import Nav from "./nav";
import { useState } from "react";

const unitMap = {
  heart_rate: 'bpm',
  temperature: '°C',
  weight: 'kg',
  steps: 'steps',
  blood_pressure_systolic: 'mmHg',
  blood_pressure_diastolic: 'mmHg',
  lungs: 'L',
  food: 'Kcal'
};

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState("heart_rate");

  return (
    <>
      <Nav />
      <div className="min-h-screen w-full bg-gradient-to-br from-[#eaf1fb] to-[#e3e6ef] flex flex-col items-center justify-center p-2 sm:p-10 mt-29">
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto sm:hidden">
          {/* Weight */}
          <div className="rounded-2xl bg-white/60 shadow-xl p-4 flex flex-col justify-between w-full">
            <div className="flex flex-row justify-between items-start h-full">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs text-gray-500 block">Weight</span>
                  <span className="text-xs text-gray-400 block mt-1">Lost 0.4kg</span>
                </div>
                <div className="mt-auto flex items-end gap-1">
                  <span className="text-2xl font-bold text-gray-800">74.2</span>
                  <span className="text-xs text-gray-400 mb-1">kg</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <div className="w-10 h-4 bg-gray-200 rounded mb-2 mt-1" />
                <span className="bg-white text-gray-800 text-xs font-semibold rounded-full px-3 py-1 shadow border border-gray-100">74.2</span>
              </div>
            </div>
          </div>
          {/* Food */}
          <div className="rounded-2xl bg-white/60 shadow-xl p-4 flex flex-col justify-between w-full">
            <div className="flex flex-row justify-between items-start h-full">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs text-gray-500 block">Food</span>
                  <span className="text-xs text-gray-400 block mt-1">254/1342 Kcal</span>
                </div>
                <div className="mt-auto flex items-end gap-1">
                  <span className="text-2xl font-bold text-gray-800">253</span>
                  <span className="text-xs text-gray-400 mb-1">Kcal</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <div className="w-10 h-4 bg-gray-200 rounded mb-2 mt-1" />
                <span className="bg-white text-gray-800 text-xs font-semibold rounded-full px-3 py-1 shadow border border-gray-100">253</span>
              </div>
            </div>
          </div>
          {/* Steps Gauge */}
          <div className="rounded-2xl bg-white/60 shadow-xl flex flex-col items-center justify-center w-full p-4">
            <div className="relative w-full max-w-[300px] h-[180px] flex items-center justify-center">
              <svg className="absolute top-0 left-1/2 -translate-x-1/2" width="180" height="180">
                <circle cx="90" cy="90" r="70" stroke="#e0e7ef" strokeWidth="14" fill="none" />
                <circle cx="90" cy="90" r="70" stroke="#2563eb" strokeWidth="14" fill="none" strokeDasharray="440" strokeDashoffset="120" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center justify-center z-10">
                <span className="text-3xl font-bold text-gray-800">7,425</span>
                <span className="text-base text-gray-400">Steps</span>
                <span className="text-xs text-gray-300 mt-2">10,000 Steps</span>
              </div>
            </div>
          </div>
          {/* Heart Image (no background) with Heart Rate overlay */}
          <div className="relative flex items-center justify-center w-full">
            <Image src="/images/heart.png" alt="Heart" width={180} height={180} className="z-0 w-full max-w-[180px]" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-2xl bg-white/60 shadow-xl px-6 py-3 flex flex-col justify-center items-center z-10 min-w-[140px]">
              <span className="text-sm text-gray-500 mb-1">Heart Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-800">124</span>
                <span className="text-sm text-gray-400">bpm</span>
                <svg width="40" height="16" className="ml-2"><polyline points="0,8 7,8 10,2 13,14 16,8 40,8" fill="none" stroke="#2563eb" strokeWidth="2" /></svg>
              </div>
            </div>
          </div>
          {/* Body Image */}
          <div className="rounded-2xl bg-white/60 shadow-xl flex items-center justify-center w-full p-4">
            <Image src="/images/output.png" alt="Body" width={80} height={220} className="w-full max-w-[80px]" />
          </div>
          {/* Heart Box */}
          <div className="relative rounded-2xl bg-white/70 shadow-xl p-4 flex flex-col items-center w-full border border-gray-200">
            <div className="absolute top-4 right-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <Image src="/images/heart.png" alt="Heart" width={40} height={40} className="mb-2" />
            <div className="mt-auto w-full">
              <div className="text-base font-semibold text-gray-800">Heart</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-xs text-gray-500">Normal</span>
              </div>
            </div>
          </div>
          {/* Lungs Box */}
          <div className="rounded-2xl bg-white/40 shadow p-4 flex flex-col items-center w-full border border-gray-200">
            <Image src="/images/lungs.png" alt="Lungs" width={40} height={40} className="mb-2" />
            <div className="mt-auto w-full">
              <div className="text-base font-semibold text-gray-800">Lungs</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-xs text-gray-500">Normal</span>
              </div>
            </div>
          </div>
          {/* Blood Status */}
          <div className="rounded-2xl bg-white/60 border border-gray-200 p-4 flex flex-col justify-between w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              <span className="text-sm font-medium text-gray-700">Blood Status</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="w-10 h-6 bg-gray-100 rounded" />
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-gray-800">102</span>
                <span className="text-xs text-gray-400">/70</span>
              </div>
            </div>
          </div>
          {/* Temperature */}
          <div className="rounded-2xl bg-white/60 border border-gray-200 p-4 flex flex-col justify-between w-full">
            <div className="flex items-center gap-2 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><circle cx="12" cy="18" r="4"/></svg>
              <span className="text-sm font-medium text-gray-700">Temperature</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="w-10 h-2 bg-gray-100 rounded" />
              <span className="text-lg font-bold text-gray-800 ml-2">37.1°</span>
            </div>
          </div>
          {/* Heart Rate */}
          <div className="rounded-2xl bg-white/60 border border-gray-200 p-4 flex flex-col justify-between w-full">
            <div className="flex items-center gap-2 mb-2">
              <Image src="/images/heart.png" alt="Heart" width={18} height={18} />
              <span className="text-sm font-medium text-gray-700">Heart Rate</span>
            </div>
            <div className="flex items-end justify-between mt-2">
              <svg width="40" height="16"><polyline points="0,8 7,8 10,2 13,14 16,8 40,8" fill="none" stroke="#2563eb" strokeWidth="2" /></svg>
              <div className="flex flex-col items-end ml-2">
                <span className="text-lg font-bold text-gray-800">124</span>
                <span className="text-xs text-gray-400">bpm</span>
              </div>
            </div>
          </div>
          {/* Sleep Time */}
          <div className="rounded-2xl bg-white/60 border border-gray-200 p-4 flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sleep time</span>
              <span className="text-xs text-gray-400">7:30h</span>
            </div>
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-blue-900 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="bg-blue-900 text-white text-xs font-semibold rounded-full px-2 py-1">00:30 - 08:00</span>
            </div>
          </div>
        </div>


        
        {/* Desktop layout (hidden on mobile) */}
        <div className="hidden sm:grid w-full max-w-7xl grid-cols-[385px_480px_260px] grid-rows-[120px_340px] gap-8 bg-white/0">
          {/* Weight & Food side by side */}
          <div className="col-start-1 col-end-2 w-[500px] h-[140px] row-start-1 row-end-2 flex gap-4">
            {/* Weight */}
            <div className="flex-1 rounded-2xl bg-white/60 shadow-xl p-4 flex flex-col justify-between">
              <div className="flex flex-row justify-between items-start h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs text-gray-500 block">Weight</span>
                    <span className="text-xs text-gray-400 block mt-1">Lost 0.4kg</span>
                  </div>
                  <div className="mt-auto flex items-end gap-1">
                    <span className="text-2xl font-bold text-gray-800">74.2</span>
                    <span className="text-xs text-gray-400 mb-1">kg</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-full">
                  {/* Placeholder for bar chart */}
                  <div className="w-10 h-4 bg-gray-200 rounded mb-2 mt-1" />
                  <span className="bg-white text-gray-800 text-xs font-semibold rounded-full px-3 py-1 shadow border border-gray-100">74.2</span>
                </div>
              </div>
            </div>
            {/* Food */}
            <div className="flex-1 rounded-2xl bg-white/60 shadow-xl p-4 flex flex-col justify-between">
              <div className="flex flex-row justify-between items-start h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs text-gray-500 block">Food</span>
                    <span className="text-xs text-gray-400 block mt-1">254/1342 Kcal</span>
                  </div>
                  <div className="mt-auto flex items-end gap-1">
                    <span className="text-2xl font-bold text-gray-800">253</span>
                    <span className="text-xs text-gray-400 mb-1">Kcal</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-full">
                  {/* Placeholder for bar chart */}
                  <div className="w-10 h-4 bg-gray-200 rounded mb-2 mt-1" />
                  <span className="bg-white text-gray-800 text-xs font-semibold rounded-full px-3 py-1 shadow border border-gray-100">253</span>
                </div>
              </div>
            </div>
          </div>
          {/* Steps Gauge */}
          <div className="col-start-1 col-end-2 row-start-2 w-[500px] h-[300px] row-end-3 rounded-2xl bg-white/60 shadow-xl flex flex-col items-center justify-center">
            <div className="relative w-[340px] h-[340px] flex items-center justify-center">
              {/* Circular progress (static) */}
              <svg className="absolute top-0" width="300" height="300">
                <circle cx="150" cy="150" r="110" stroke="#e0e7ef" strokeWidth="14" fill="none" />
                <circle cx="150" cy="150" r="110" stroke="#2563eb" strokeWidth="14" fill="none" strokeDasharray="742" strokeDashoffset="230" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center justify-center z-10">
                <span className="text-5xl font-bold text-gray-800">7,425</span>
                <span className="text-lg text-gray-400">Steps</span>
                <span className="text-sm text-gray-300 mt-2">10,000 Steps</span>
              </div>
            </div>
          </div>
          {/* Heart Image (no background) with Heart Rate overlay */}
          <div className="col-start-2 col-end-3 row-start-1 w-[580px] h-[490px] row-end-3 relative flex items-center justify-center">
            <Image src="/images/heart.png" alt="Heart" width={420} height={420} className="z-0" />
            {/* Heart Rate overlay */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-2xl bg-white/60 shadow-xl px-10 py-6 flex flex-col justify-center items-center z-10 min-w-[240px]">
              <span className="text-base text-gray-500 mb-1">Heart Rate</span>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold text-gray-800">124</span>
                <span className="text-base text-gray-400">bpm</span>
                <svg width="70" height="28" className="ml-4"><polyline points="0,14 12,14 18,6 24,22 30,14 70,14" fill="none" stroke="#2563eb" strokeWidth="2" /></svg>
              </div>
            </div>
          </div>
          {/* Body Image */}
          <div className="col-start-3 col-end-4 row-start-1 w-[240px] h-[450px] row-end-3 rounded-2xl bg-white/60 shadow-xl flex items-center justify-center">
            <Image src="/images/output.png" alt="Body" width={540} height={540} />
          </div>

          {/* Left column: Heart and Lungs */}
          <div className="w-full flex gap-6 justify-between">
            {/* Heart Box */}
            <div className="relative rounded-2xl bg-white/70 shadow-xl p-6 flex flex-col items-center h-[300px] min-w-[220px] border border-gray-200">
              {/* Arrow icon top right */}
              <div className="absolute top-4 right-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              <Image src="/images/heart.png" alt="Heart" width={170} height={70} className="mb-4" />
              <div className="mt-auto w-full">
                <div className="text-lg font-semibold text-gray-800">Heart</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  <span className="text-sm text-gray-500">Normal</span>
                </div>
              </div>
            </div>
            {/* Lungs Box */}
            <div className="rounded-2xl bg-white/40 shadow p-6 flex flex-col items-center h-[300px] min-w-[220px] border border-gray-200 mr-8">
              <Image src="/images/lungs.png" alt="Lungs" width={150} height={70} className="mb-4" />
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

          {/* Right section: 3 cards on top, 1 wide below */}
          <div className="flex-1 flex flex-col w-[650px] h-[340px] gap-6 -ml-100">
            {/* Top row: 3 cards */}
            <div className="grid grid-cols-3 gap-6">
              {/* Blood Status */}
              <div className="rounded-2xl bg-white/60 border border-gray-200 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  <span className="text-sm font-medium text-gray-700">Blood Status</span>
                </div>
                <div className="flex items-end justify-between">
                  {/* Placeholder for chart */}
                  <div className="w-16 h-10 bg-gray-100 rounded" />
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-gray-800">102</span>
                    <span className="text-xs text-gray-400">/70</span>
                  </div>
                </div>
              </div>
              {/* Temperature */}
              <div className="rounded-2xl bg-white/60 border border-gray-200 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><circle cx="12" cy="18" r="4"/></svg>
                  <span className="text-sm font-medium text-gray-700">Temperature</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  {/* Placeholder for chart */}
                  <div className="w-16 h-2 bg-gray-100 rounded" />
                  <span className="text-2xl font-bold text-gray-800 ml-4">37.1°</span>
                </div>
              </div>
              {/* Heart Rate */}
              <div className="rounded-2xl bg-white/60 border border-gray-200 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/images/heart.png" alt="Heart" width={18} height={18} />
                  <span className="text-sm font-medium text-gray-700">Heart Rate</span>
                </div>
                <div className="flex items-end justify-between mt-2">
                  {/* Placeholder for chart */}
                  <svg width="60" height="24"><polyline points="0,12 10,12 15,4 20,20 25,12 60,12" fill="none" stroke="#2563eb" strokeWidth="2" /></svg>
                  <div className="flex flex-col items-end ml-2">
                    <span className="text-2xl font-bold text-gray-800">124</span>
                    <span className="text-xs text-gray-400">bpm</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom row: Sleep Time */}
            <div className="rounded-2xl bg-white/60 border border-gray-200 p-6 flex flex-col gap-4 min-h-[90px] mt-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Sleep time</span>
                <span className="text-xs text-gray-400">7:30h</span>
              </div>
              <div className="flex items-center gap-4 w-full">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-3 bg-blue-900 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="bg-blue-900 text-white text-xs font-semibold rounded-full px-4 py-1">00:30 - 08:00</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* Floating Action Button */}
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
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
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Metric</h3>
            <form id="metricForm" className="flex flex-col gap-3">
              <label className="text-sm text-slate-900 font-medium">Type:</label>
              <select
                name="type"
                className="w-full mb-2 border rounded px-2 py-1 text-gray-800"
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
              >
                <option value="heart_rate">Heart Rate</option>
                <option value="temperature">Temperature</option>
                <option value="weight">Weight</option>
                <option value="steps">Steps</option>
                <option value="blood_pressure_systolic">Blood Pressure Systolic</option>
                <option value="blood_pressure_diastolic">Blood Pressure Diastolic</option>
                <option value="lungs">Lungs</option>
                <option value="food">Food</option>
              </select>
              <label className="text-sm font-medium text-gray-800">Value:</label>
              <div className="flex items-center border rounded px-2 py-1 mb-2">
                <input
                  type="number"
                  name="value"
                  id="valueInput"
                  required
                  placeholder={`e.g. 70 ${unitMap[selectedType]}`}
                  className="flex-1 min-w-0 text-gray-800 placeholder-gray-400 outline-none bg-transparent pr-2 text-base"
                />
                <span id="unitDisplay" className="ml-2 text-slate-900 min-w-[48px] text-right">{unitMap[selectedType]}</span>
              </div>
              {['steps', 'food'].includes(selectedType) && (
                <div id="goalInputGroup" className="flex flex-col mb-2">
                  <div className="flex items-center border rounded px-2 py-1">
                    <span className="text-gray-400 mr-2 whitespace-nowrap">Set Goal:</span>
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
