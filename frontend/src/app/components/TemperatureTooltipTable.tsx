import React from "react";

const TemperatureTooltipTable: React.FC = () => (
  <table className="w-full text-[10px] text-left">
    <thead>
      <tr className="border-b">
        <th className="font-bold pr-2 pb-1">Category</th>
        <th className="font-bold pr-2 pb-1">Temperature (°C)</th>
        <th className="font-bold pr-2 pb-1">Status</th>
        <th className="font-bold pb-1">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b">
        <td className="pr-2">Hypothermia</td>
        <td className="pr-2">&lt; 35.0</td>
        <td className="pr-2">Danger (Low Temperature)</td>
        <td>Core body temperature dangerously low; may cause confusion, slow heartbeat, or death</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Low-Normal</td>
        <td className="pr-2">35.0 – 35.9</td>
        <td className="pr-2">Warning (Slightly Low)</td>
        <td>Below normal; possible cold exposure or health issue; monitor closely</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Normal</td>
        <td className="pr-2">36.0 – 37.2</td>
        <td className="pr-2">Normal</td>
        <td>Healthy range for most people; body functioning optimally</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Elevated</td>
        <td className="pr-2">37.3 – 37.9</td>
        <td className="pr-2">Warning (Elevated Temperature)</td>
        <td>Low-grade fever; possible infection or inflammation; watch for symptoms</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Fever (Mild)</td>
        <td className="pr-2">38.0 – 38.9</td>
        <td className="pr-2">Danger (Mild Fever)</td>
        <td>Indicates infection or illness; monitor hydration and symptoms</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Fever (High)</td>
        <td className="pr-2">39.0 – 40.0</td>
        <td className="pr-2">Danger (High Fever)</td>
        <td>Significant fever; needs medical attention if persistent</td>
      </tr>
      <tr>
        <td className="pr-2">Hyperpyrexia</td>
        <td className="pr-2">&gt; 40.0</td>
        <td className="pr-2">Emergency (Very High Temperature)</td>
        <td>Medical emergency; risk of brain damage, seizures, or death</td>
      </tr>
    </tbody>
  </table>
);

export default TemperatureTooltipTable; 