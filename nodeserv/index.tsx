import { createRoot } from "react-dom/client";
import { NavBar, VehicleSearchModal } from "./components";
import "./styles.css";

function App() {
  return (
    <>
      <NavBar type="home" />
      <VehicleSearchModal />
    </>
  );
}

const root = createRoot(document.getElementById("root") as Element);
root.render(<App />);
