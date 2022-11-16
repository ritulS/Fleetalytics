import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { NavBar, VehicleSearchModal } from "./components";
import Cookies from "js-cookie";
import "./styles.css";

// get previous car id set
var cid = Cookies.get("carID");
if (cid == undefined) {
  cid = "check";
}

// fake function for testing
function fake_get_gps_location(carID: string) {
  console.log("fake function for get gps info has been clicked");
}

function Home() {
  const [carID, update_carid_] = useState(cid);

  const update_carID = (carID: string) => {
    update_carid_(carID);
  };

  return (
    <>
      <NavBar type="home" />
      <VehicleSearchModal update_carID={fake_get_gps_location} />
    </>
  );
}

const root = createRoot(document.getElementById("root") as Element);
root.render(<Home />);

// setting up mapbox
//@ts-ignore
mapboxgl.accessToken =
  "pk.eyJ1IjoibGFraGFuYm95MSIsImEiOiJjbGFpNG15M3QwNXV5M3Z2dW5idzl5enJwIn0.SKxssaF6-asRmLbj_hYJhQ";
//@ts-ignore
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/lakhanboy1/clai4xtay002b14moxbbhqt41", // style URL
  center: [-43.1, -22.9], // starting position [lng, lat]
  zoom: 12, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});
