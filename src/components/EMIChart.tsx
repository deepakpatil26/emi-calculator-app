import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface EMIChartProps {
  principal: number;
  totalInterest: number;
}

const EMIChart = ({ principal, totalInterest }: EMIChartProps) => {
  const data = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: totalInterest },
  ];

  const COLORS = ['#8B5CF6', '#E5DEFF'];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">Payment Breakdown</h3>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(value)}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EMIChart;