import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface RealTimeChartData {
  name: string;
  value: number;
}

interface RealTimeChartProps {
  data: RealTimeChartData[];
  color?: string;
  height?: number;
}

export const RealTimeLineChart: React.FC<RealTimeChartProps> = ({ data, color = "#8884d8", height = 300 }) => (
  <div style={{ width: "100%", height }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke={color} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
