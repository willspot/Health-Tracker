import React from "react";

const HeartRateTooltipTable: React.FC = () => (
  <table className="w-full text-[10px] text-left">
    <thead>
      <tr className="border-b">
        <th className="font-bold pr-2 pb-1">Category</th>
        <th className="font-bold pr-2 pb-1">Heart Rate (bpm)</th>
        <th className="font-bold pr-2 pb-1">Heart Status</th>
        <th className="font-bold pb-1">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b">
        <td className="pr-2">Bradycardia (Low)</td>
        <td className="pr-2">&lt; 60</td>
        <td className="pr-2">Warning (Low Heart Rate)</td>
        <td>May be normal in athletes; otherwise can indicate heart or metabolic issues</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Normal</td>
        <td className="pr-2">60 – 100</td>
        <td className="pr-2">Normal</td>
        <td>Healthy resting heart rate; good cardiovascular function</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Elevated (Mild Tachycardia)</td>
        <td className="pr-2">101 – 120</td>
        <td className="pr-2">Warning (Elevated Heart Rate)</td>
        <td>Often due to stress, fever, dehydration, or early sign of respiratory distress</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Tachycardia (Moderate)</td>
        <td className="pr-2">121 – 140</td>
        <td className="pr-2">Danger (Tachycardia)</td>
        <td>May indicate heart strain, infection, lung issues, or other systemic problems</td>
      </tr>
      <tr>
        <td className="pr-2">Severe Tachycardia</td>
        <td className="pr-2">&gt; 140</td>
        <td className="pr-2">Emergency (Severe Tachycardia)</td>
        <td>High risk; could signal arrhythmia, heart failure, or life-threatening state</td>
      </tr>
    </tbody>
  </table>
);

export default HeartRateTooltipTable; 