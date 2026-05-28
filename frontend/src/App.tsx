import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { SplashScreen } from "@/components/SplashScreen";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import ChatPage from "@/pages/ChatPage";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Routes>
    </>
  );
}
