import React from "react";
import ControlPanel from "./ControlPanel";
import RightPanel from "./RightPanel";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
<div className="flex h-screen w-full">
  {/* LEFT PANEL */}
 <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
  <div className="w-[30%] border-r p-4 overflow-y-auto">
    <ControlPanel />
  </div>

  {/* RIGHT PANEL */}
  <div className="w-[70%] p-4 overflow-y-auto">
    <RightPanel />
  </div>
</div>
  );
};

export default App;

