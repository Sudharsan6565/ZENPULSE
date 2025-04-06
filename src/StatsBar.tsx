import React from "react";

interface StatsBarProps {
  sms: number;
  email: number;
  slack: number;
  pushEvents: any[];
}

const StatsBar: React.FC<StatsBarProps> = ({ sms, email, slack, pushEvents }) => {
  const handleCSVExport = () => {
    const rows = pushEvents.map((e: any) => ({
      timestamp: new Date().toISOString(),
      channel: 'push',
      message: JSON.stringify(e.message || e),
    }));

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['timestamp,channel,message']
        .concat(rows.map(r => `${r.timestamp},${r.channel},"${r.message}"`))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'zenpulse_push_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border-t pt-4 mt-4 text-sm flex items-center justify-between">
      <div className="space-x-4 text-gray-700">
        <span>📱 SMS: {sms}</span>
        <span>📧 Email: {email}</span>
        <span>💬 Slack: {slack}</span>
        <span>⚡ Push: {pushEvents.length}</span>
      </div>
      <button
        onClick={handleCSVExport}
        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-xs"
      >
        ⬇️ Export CSV
      </button>
    </div>
  );
};

export default StatsBar;

