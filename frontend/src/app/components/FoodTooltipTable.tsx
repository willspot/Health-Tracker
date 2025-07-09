import React from "react";

const FoodTooltipTable: React.FC = () => (
  <table className="w-full text-[10px] text-left">
    <thead>
      <tr className="border-b">
        <th className="font-bold pr-2 pb-1">Category</th>
        <th className="font-bold pr-2 pb-1">Calories (kcal/day)</th>
        <th className="font-bold pr-2 pb-1">Food Status</th>
        <th className="font-bold pb-1">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b">
        <td className="pr-2">Undernourished</td>
        <td className="pr-2">&lt; 1,200</td>
        <td className="pr-2">Danger (Undernutrition)</td>
        <td>Insufficient calories; may cause fatigue, nutrient deficiency, muscle loss</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Low Intake</td>
        <td className="pr-2">1,200 – 1,499</td>
        <td className="pr-2">Warning (Low Caloric Intake)</td>
        <td>Below recommended needs; may support weight loss but monitor nutrition closely</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Normal</td>
        <td className="pr-2">1,500 – 2,500</td>
        <td className="pr-2">Normal</td>
        <td>Balanced intake for most adults depending on sex and activity level</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">Elevated Intake</td>
        <td className="pr-2">2,501 – 3,000</td>
        <td className="pr-2">Warning (Excess Intake)</td>
        <td>Slightly above average needs; may lead to gradual weight gain if sedentary</td>
      </tr>
      <tr className="border-b">
        <td className="pr-2">High Intake</td>
        <td className="pr-2">3,001 – 3,500</td>
        <td className="pr-2">Danger (Overconsumption)</td>
        <td>High calorie consumption; likely to cause weight gain, especially if inactive</td>
      </tr>
      <tr>
        <td className="pr-2">Overeating Crisis</td>
        <td className="pr-2">&gt; 3,500</td>
        <td className="pr-2">Emergency (Severe Overconsumption)</td>
        <td>Risk of obesity, metabolic disorders, and long-term health complications</td>
      </tr>
    </tbody>
  </table>
);

export default FoodTooltipTable; 