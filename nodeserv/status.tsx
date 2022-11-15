import { createRoot } from "react-dom/client";
import { NavBar, VehicleSearchModal } from "./components";

function App() {
  return (
    <>
      <NavBar type="status" />
      <VehicleSearchModal />
    </>
  );
}

const root = createRoot(document.getElementById("root") as Element);
root.render(<App />);
