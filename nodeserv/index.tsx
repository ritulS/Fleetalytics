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

// setting up mapbox
//@ts-ignore
mapboxgl.accessToken = 'pk.eyJ1IjoibGFraGFuYm95MSIsImEiOiJjbGFpNG15M3QwNXV5M3Z2dW5idzl5enJwIn0.SKxssaF6-asRmLbj_hYJhQ';
//@ts-ignore
const map = new mapboxgl.Map({
  container: "map", // container ID

  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/lakhanboy1/clai4xtay002b14moxbbhqt41", // style URL
  center: [-43.1, -22.9], // starting position [lng, lat]
  zoom: 12, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});
