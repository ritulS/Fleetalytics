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

//@ts-ignore
var MARKERS = [];

// fake function for testing
async function get_gps_location(carID: string) {
  var resp = await fetch(`/coordinates?vin=${carID}`);
  resp = await resp.json();
  return resp;
}

function Home() {
  const [carID, update_carid_] = useState(cid);
  const [counter, updateCounter] = useState(0);

  const plusList = [-1, 1];
  setTimeout(
    () => updateCounter(counter + plusList[Math.floor(Math.random() * 2)]),
    2000
  );

  const update_carID = (carID: string) => {
    update_carid_(carID);
  };
  //@ts-ignore
  useEffect(() => {
    get_gps_location(carID as string).then((new_coordinates) => {
      delete_markers();
      set_markers(new_coordinates);
    });
  }, [carID, counter]);

  return (
    <>
      <NavBar type="home" />
      <VehicleSearchModal update_carID={update_carID} />
    </>
  );
}

const root = createRoot(document.getElementById("root") as Element);
root.render(<Home />);

function delete_markers() {
  //@ts-ignore
  for (let marker of MARKERS) {
    //@ts-ignore
    marker.remove();
  }
  MARKERS = [];
}

function set_markers(new_coordinates: any) {
  for (let mk in new_coordinates) {
    // Create a DOM element for each marker.
    const el = document.createElement("div");
    const width = 30;
    const height = 30;
    el.className = "marker";
    el.style.backgroundImage = `url(https://cdn-icons-png.flaticon.com/512/446/446075.png)`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = "100%";

    //@ts-ignore 
    console.log(new_coordinates[mk])

    //@ts-ignore
    const ll = new mapboxgl.LngLat(new_coordinates[mk][0], new_coordinates[mk][1])
    //@ts-ignore
    const marker = new mapboxgl.Marker(el)
      .setLngLat(ll)
      .addTo(map);
    MARKERS.push(marker);
  }
}

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
