import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

// 🔧 Define the expected stats shape
interface NotificationStats {
  sms: number;
  email: number;
  slack: number;
  push: number;
}

// ⚙️ Fully typed prop
const LineChart = ({ stats }: { stats: NotificationStats }) => {
  const data = [
    { name: "SMS", value: stats.sms },
    { name: "Email", value: stats.email },
    { name: "Slack", value: stats.slack },
    { name: "Push", value: stats.push },
  ];

  return (
    <div className="w-full h-60 mt-4 bg-white p-4 rounded shadow text-xs">
      <h3 className="text-sm font-semibold mb-2 text-gray-800">
        Notification Trend
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip
            wrapperClassName="text-xs"
            contentStyle={{ fontSize: "12px" }}
            labelStyle={{ fontWeight: 500 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6D28D9" // Tailwind violet-700
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

