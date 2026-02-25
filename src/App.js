import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Main from "./pages/Main";
import Currencies from "./pages/Currencies";
import Price from "./pages/Price";

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/currencies" element={<Currencies />} />
          <Route path="/price/:symbol" element={<Price />} />
        </Routes>
      </main>
    </div>
  );
}
