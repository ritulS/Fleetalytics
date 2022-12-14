import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { NavBar, VehicleSearchModal, VehicleStatusComp } from "./components";
import Cookies from "js-cookie";

// get previous car id set
var cid = Cookies.get("carID");
if (cid == undefined) {
  cid = "check";
}

// @ts-ignore
var MARKERS = [];

// object for sharing car status between the two react components

const StatusRedux = {
  carStatus: {
    cid: cid as string,
    fuel: 0,
    speed: 0,
    location: [0, 0] as [number, number],
    avg_distance: 0,
    avg_speed: 0,
  },
  updateCarStatus: () => console.log("default updateCarStatusCalled"),
};

async function get_car_status(vin: string) {
  var res = await fetch(`/car_status/${vin}`);
  var coordinates = await fetch(`/coordinates?vin=${vin}`)
  res = await res.json();
  coordinates = await coordinates.json()
  console.log(coordinates)
  return [res, coordinates];
}

function StatusNav() {
  const [vin, update_carvin_] = useState(cid);
  const [counter, updateCounter] = useState(0);
  const plusList = [-1, 1];

  setTimeout(
    () => updateCounter(counter + plusList[Math.floor(Math.random() * 2)]),
    2000
  );

  useEffect(() => {
    get_car_status(vin as string).then((res) => {
      StatusRedux.carStatus = res[0] as any;
      //@ts-ignore
      StatusRedux.updateCarStatus();
       delete_markers()
       set_markers(res[1] as any)
    });
  }, [vin, counter]);

  const update_carID = (vin: string) => {
    update_carvin_(vin);
  };
  //@ts-ignore
  return (
    <>
      <NavBar type="status" />
      <VehicleSearchModal update_carID={update_carID} />
    </>
  );
}

function StatusDisp() {
  const [carStatus, update_carStatus_] = useState(StatusRedux.carStatus);
  const update_carStatus = () => {
    console.log("-- updating statusdisp using status redux --");
    update_carStatus_(StatusRedux.carStatus);
  };

  //setting redux state
  //@ts-ignore
  StatusRedux.updateCarStatus = update_carStatus;

  return (
    <>
      <VehicleStatusComp info={carStatus as any} />
    </>
  );
}

const root = createRoot(document.getElementById("nav") as Element);
const status = createRoot(document.getElementById("status") as Element);

root.render(<StatusNav />);
status.render(<StatusDisp />);

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

function delete_markers() {
  //@ts-ignore
  for (let marker of MARKERS) {
    //@ts-ignore
    marker.remove();
  }
  MARKERS = [];
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
