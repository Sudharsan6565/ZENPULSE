import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function NotificationBarChart({ stats }) {
  const data = [
    { name: "SMS", value: stats.sms },
    { name: "Email", value: stats.email },
    { name: "Slack", value: stats.slack },
    { name: "Push", value: stats.push },
  ];

  return (
    <div className="w-full mt-4 px-2 py-3 bg-white border rounded shadow-sm text-xs">
      <h3 className="text-sm font-semibold mb-2 text-gray-800">
      
      </h3>
      <div className="h-48"> {/* This will stop it from growing taller than 200px */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis allowDecimals={false} fontSize={12} />
            <Tooltip
              wrapperClassName="text-xs"
              contentStyle={{ fontSize: "12px" }}
              labelStyle={{ fontWeight: 500 }}
            />
            <Bar
              dataKey="value"
              fill="#6366f1" // Indigo-500 Tailwind
              radius={[5, 5, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

