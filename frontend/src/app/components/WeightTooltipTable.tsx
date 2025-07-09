import React from "react";

const WeightTooltipTable: React.FC = () => (
  <table className="w-full text-[10px] text-left">
    <thead>
      <tr className="border-b">
        <th className="font-bold pr-2 pb-1">Category</th>
        <th className="font-bold pr-2 pb-1">BMI (kg/m²)</th>
        <th className="font-bold pr-2 pb-1">Weight Status</th>
        <th className="font-bold pr-2 pb-1">Approx. Weight (kg)</th>
        <th className="font-bold pb-1">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b">
        <td className="pr-2">Severely Underweight</td>
        <td className="pr-2">&lt; 16.0</td>
        <td className="pr-2">Danger (Severe Underweight)</td>
        <td className="pr-2">&lt; 44</td>
        <td>High risk of malnutrition, organ damage, weakened immunity</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Underweight</td>
        <td className="pr-2">16.0 – 18.4</td>
        <td className="pr-2">Warning (Underweight)</td>
        <td className="pr-2">44 – 53</td>
        <td>May lead to fatigue, low immunity, and nutritional deficiency</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Normal</td>
        <td className="pr-2">18.5 – 24.9</td>
        <td className="pr-2">Normal</td>
        <td className="pr-2">54 – 74</td>
        <td>Healthy weight range for most adults; low disease risk</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Overweight</td>
        <td className="pr-2">25.0 – 29.9</td>
        <td className="pr-2">Warning (Overweight)</td>
        <td className="pr-2">75 – 87</td>
        <td>Increased risk of heart disease, diabetes, and joint issues</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Obese (Class I)</td>
        <td className="pr-2">30.0 – 34.9</td>
        <td className="pr-2">Danger (Obesity)</td>
        <td className="pr-2">88 – 102</td>
        <td>High risk of chronic diseases; consider medical/lifestyle intervention</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Obese (Class II)</td>
        <td className="pr-2">35.0 – 39.9</td>
        <td className="pr-2">Danger (Severe Obesity)</td>
        <td className="pr-2">103 – 115</td>
        <td>Very high risk of serious health problems</td>
      </tr>
      <tr>
        <td className="pr-2">Obese (Class III)</td>
        <td className="pr-2">&ge; 40.0</td>
        <td className="pr-2">Emergency (Morbid Obesity)</td>
        <td className="pr-2">&gt; 115</td>
        <td>Critical health risk; requires urgent medical management</td>
      </tr>
    </tbody>
  </table>
);

export default WeightTooltipTable; 