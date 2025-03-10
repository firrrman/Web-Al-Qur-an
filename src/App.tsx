import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DetailSurah from "../src/pages/DetailSurah";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:nomor" element={<DetailSurah />} />
      </Routes>
    </div>
  );
};

export default App;
