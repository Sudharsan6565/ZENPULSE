import React, { useState } from 'react';
import axios from 'axios';

const endpoint = "https://0lt1zwvd1g.execute-api.us-east-1.amazonaws.com/prod/zenpulseNotificationGenerator"; // Update if needed

const ControlPanel = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [slack, setSlack] = useState("");
  const [push, setPush] = useState("");
  const [customers, setCustomers] = useState(1);
  const [simType, setSimType] = useState("ecom");
  const [channels, setChannels] = useState({
    sms: true,
    email: true,
    slack: true,
    push: true,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannels({ ...channels, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async () => {
    const payload = {
      email,
      phone,
      slack,
      push,
      customers,
      channels,
      simType,
    };

    console.log("🚀 Payload: ", payload);

    try {
      const res = await axios.post(endpoint, payload);
      console.log("✅ Backend response:", res.data);
    } catch (err) {
      console.error("❌ Error sending payload:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto mt-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">🧪 Simulation Control Panel</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" placeholder="Email" className="border border-gray-300 rounded px-3 py-2"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input type="text" placeholder="Phone" className="border border-gray-300 rounded px-3 py-2"
          value={phone} onChange={(e) => setPhone(e.target.value)} />

        <input type="text" placeholder="Slack Webhook" className="border border-gray-300 rounded px-3 py-2"
          value={slack} onChange={(e) => setSlack(e.target.value)} />

        <input type="text" placeholder="Push Endpoint" className="border border-gray-300 rounded px-3 py-2"
          value={push} onChange={(e) => setPush(e.target.value)} />

        <input type="number" min={1} placeholder="Customers" className="border border-gray-300 rounded px-3 py-2"
          value={customers} onChange={(e) => setCustomers(Number(e.target.value))} />

        <select className="border border-gray-300 rounded px-3 py-2"
          value={simType} onChange={(e) => setSimType(e.target.value)}>
          <option value="ecom">Ecommerce</option>
          <option value="bank">Banking</option>
          <option value="ticket">Support Ticket</option>
        </select>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <label><input type="checkbox" name="sms" checked={channels.sms} onChange={handleCheckboxChange} className="mr-1" /> SMS</label>
        <label><input type="checkbox" name="email" checked={channels.email} onChange={handleCheckboxChange} className="mr-1" /> Email</label>
        <label><input type="checkbox" name="slack" checked={channels.slack} onChange={handleCheckboxChange} className="mr-1" /> Slack</label>
        <label><input type="checkbox" name="push" checked={channels.push} onChange={handleCheckboxChange} className="mr-1" /> Push</label>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        🔁 Start Simulation
      </button>
    </div>
  );
};

export default ControlPanel;

