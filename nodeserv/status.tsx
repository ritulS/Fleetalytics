import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { NavBar, VehicleSearchModal, VehicleStatusComp } from "./components";
import Cookies from "js-cookie";

// get previous car id set
var cid = Cookies.get("carID");
if (cid == undefined) {
  cid = "check";
}

// object for sharing car status between the two react components

const StatusRedux = {
  carStatus:{
    cid: cid as string,
    fuel: 0,
    speed: 0,
    location: [0, 0] as [number, number],
    avg_distance: 0,
    avg_speed: 0,
  },
  updateCarStatus: ()=>console.log("default updateCarStatusCalled"),
};

async function get_car_status(id: string) {
  var res = await fetch(`/car_status/${id}`);
  res = await res.json();
  return res;
}

function StatusNav() {
  const [carID, update_carid_] = useState(cid);

  useEffect(() => {
    get_car_status(carID as string).then((res) => {
      StatusRedux.carStatus = res as any;
      //@ts-ignore
      StatusRedux.updateCarStatus()
    });
  }, [carID]);

  const update_carID = (carID: string) => {
    update_carid_(carID);
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
                console.log("-- updating statusdisp using status redux --")
                update_carStatus_(StatusRedux.carStatus);
        }

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
