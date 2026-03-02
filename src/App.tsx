import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/home"
import ChatPage from "./pages/chat"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  )
}
