import { useState } from "react";
import ControlPanel from "./ControlPanel";
import RightPanel from "./RightPanel";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 🔁 shared state

  return (
    <div className="flex h-screen w-full">
      {/* Toaster */}
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />

      {/* LEFT PANEL */}
      <div className="w-[30%] border-r p-4 overflow-y-auto">
        <ControlPanel setRefreshTrigger={setRefreshTrigger} />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[70%] p-4 overflow-y-auto">
        <RightPanel refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default App;

