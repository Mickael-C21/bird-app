import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar      from "./components/Navbar";
import Home        from "./Pages/page_home";
import BirdsList   from "./Pages/BirdsList";
import BirdDetail  from "./Pages/BirdDetail";
import Tableau     from "./Pages/TableView";
import AddBird     from "./Pages/AddBird";
import AddImage    from "./Pages/AddImage";
import Detect      from "./Pages/Detect";
import APropos     from "./Pages/APropos";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/oiseaux"       element={<BirdsList />} />
        <Route path="/oiseaux/:id"   element={<BirdDetail />} />
        <Route path="/tableau"       element={<Tableau />} />
        <Route path="/ajouter"       element={<AddBird />} />
        <Route path="/ajouter-image" element={<AddImage />} />
        <Route path="/detect"        element={<Detect />} />
        <Route path="/apropos"       element={<APropos />} />
      </Routes>
    </BrowserRouter>
  );
}