import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const ControlPanel = () => {
  const [typeClass, setTypeClass] = useState("ecom");
  const [customerCount, setCustomerCount] = useState(1);
  const [channels, setChannels] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [slack, setSlack] = useState("");
  const [push, setPush] = useState("");

  const toggleChannel = (channel: string) => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((ch) => ch !== channel)
        : [...prev, channel]
    );
  };

  const handleSubmit = async () => {
    const payload = {
      typeClass,
      customerCount: Number(customerCount),
      channels: {
        ...(channels.includes("sms") && { sms: phone }),
        ...(channels.includes("email") && { email }),
        ...(channels.includes("slack") && { slack }),
        ...(channels.includes("push") && { push }),
      },
    };

    try {
      await axios.post(
        "https://0lt1zwvd1g.execute-api.us-east-1.amazonaws.com/prod/zenpulseNotificationGenerator",
        payload
      );
      toast.success("🚀 Pulse Generated");
    } catch (err) {
      toast.error("❌ Pulse Generation Failed");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-white p-4 border-r text-sm">
      {/* TOP HEADER */}
      <div>
        <h1 className="text-2xl font-bold mb-1">💠 Zenpulse</h1>
        <p className="mb-4 text-xs">
          Real-time multichannel notifications powered by{" "}
          <strong>EventBridge + Lambda + OpenAI</strong>
        </p>

        {/* TYPE CLASS SELECTOR */}
        <label className="block font-semibold">Type</label>
        <select
          className="w-full mb-3 border"
          value={typeClass}
          onChange={(e) => setTypeClass(e.target.value)}
        >
          <option value="ecom">Ecommerce</option>
          <option value="banking">Banking</option>
          <option value="support">Support Ticket</option>
        </select>

        {/* CUSTOMER COUNT */}
        <label className="block font-semibold">Customer Count</label>
        <input
          className="w-full mb-4 border"
          type="number"
          value={customerCount}
          onChange={(e) => setCustomerCount(Number(e.target.value))}
        />

        {/* CHANNELS */}
        <label className="block font-semibold">Channels & Test Inputs</label>
        <div className="space-y-4 mt-2">
          {/* SMS */}
          <div>
            <label>
              <input
                type="checkbox"
                checked={channels.includes("sms")}
                onChange={() => toggleChannel("sms")}
                className="mr-2"
              />
              SMS
            </label>
            <input
              className="w-full border px-2 py-1 text-xs mt-1"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label>
              <input
                type="checkbox"
                checked={channels.includes("email")}
                onChange={() => toggleChannel("email")}
                className="mr-2"
              />
              EMAIL
            </label>
            <input
              className="w-full border px-2 py-1 text-xs mt-1"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* SLACK */}
          <div>
            <label>
              <input
                type="checkbox"
                checked={channels.includes("slack")}
                onChange={() => toggleChannel("slack")}
                className="mr-2"
              />
              SLACK
            </label>
            <input
              className="w-full border px-2 py-1 text-xs mt-1"
              placeholder="https://hooks.slack.com/..."
              value={slack}
              onChange={(e) => setSlack(e.target.value)}
            />
          </div>

          {/* PUSH */}
          <div>
            <label>
              <input
                type="checkbox"
                checked={channels.includes("push")}
                onChange={() => toggleChannel("push")}
                className="mr-2"
              />
              PUSH
            </label>
            <input
              className="w-full border px-2 py-1 text-xs mt-1"
              placeholder="wss://your-websocket-endpoint"
              value={push}
              onChange={(e) => setPush(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div>
        <button
          className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          onClick={handleSubmit}
        >
          🚀 Generate Pulse
        </button>
        <div className="mt-6 text-xs text-center">
          <p className="mb-1">© 2025 <strong>Serverless LLC</strong></p>
          <p>Built with 🧠 OpenAI & 🛠️ Native AWS Stack</p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

