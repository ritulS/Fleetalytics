import { createRoot } from "react-dom/client";
import { NavBar } from "./components";

function App() {
  return <NavBar type="analytics"/>;
}

const root = createRoot(document.getElementById("root") as Element);
root.render(<App />);
