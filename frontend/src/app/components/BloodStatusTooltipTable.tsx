import React from "react";

const BloodStatusTooltipTable: React.FC = () => (
  <table className="w-full text-[10px] text-left">
    <thead>
      <tr className="border-b">
        <th className="font-bold pr-2 pb-1">Category</th>
        <th className="font-bold pr-2 pb-1">Systolic</th>
        <th className="font-bold pr-2 pb-1">Diastolic</th>
        <th className="font-bold pr-2 pb-1">Heart Status</th>
        <th className="font-bold pb-1">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b">
        <td className="pr-2">Normal</td>
        <td className="pr-2">&lt; 120</td>
        <td className="pr-2">and &lt; 80</td>
        <td className="pr-2">Normal</td>
        <td>Healthy blood pressure, low risk</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Elevated</td>
        <td className="pr-2">120 - 129</td>
        <td className="pr-2">and &lt; 80</td>
        <td className="pr-2">Warning (Elevated)</td>
        <td>Slightly increased risk, lifestyle changes advised</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Hypertension Stage 1</td>
        <td className="pr-2">130 - 139</td>
        <td className="pr-2">or 80 - 89</td>
        <td className="pr-2">Danger (Mild Hypertension)</td>
        <td>Early high blood pressure, requires monitoring and possible treatment</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Hypertension Stage 2</td>
        <td className="pr-2">≥ 140</td>
        <td className="pr-2">or ≥ 90</td>
        <td className="pr-2">Danger (Moderate/Severe Hypertension)</td>
        <td>High risk, needs medical treatment</td>
      </tr>
      <tr>
        <td className="pr-2">Hypertensive Crisis</td>
        <td className="pr-2">&gt; 180</td>
        <td className="pr-2">and/or &gt; 120</td>
        <td className="pr-2">Emergency (Crisis)</td>
        <td>Immediate medical attention needed</td>
      </tr>
    </tbody>
  </table>
);

export default BloodStatusTooltipTable; 