import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import NotePage from "./pages/NotePage";

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/note/:id" element={<NotePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
