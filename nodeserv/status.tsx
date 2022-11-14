import { createRoot } from "react-dom/client";
import { NavBar } from "./components";

function App() {
  return <NavBar type="status"/>;
}

const root = createRoot(document.getElementById("root") as Element);
root.render(<App />);
