import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

const LineChart = ({ stats }) => {
  const data = [
    { name: "SMS", value: stats.sms },
    { name: "Email", value: stats.email },
    { name: "Slack", value: stats.slack },
    { name: "Push", value: stats.push },
  ];

  return (
    <div className="w-full h-60 mt-4 bg-white p-4 rounded shadow">
      
      <ResponsiveContainer width="100%" height="90%">
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6D28D9"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;

