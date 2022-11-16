import { createRoot } from "react-dom/client";
import react, { useEffect, useState } from "react";
import { NavBar, VehicleSearchModal, VehicleStatusComp } from "./components";
import Cookies from "js-cookie";

interface VehicleStatusCompProps {
  info: {
    cid: string;
    fuel: number;
    speed: number;
    location: [number, number];
    avg_distance: number;
    avg_speed: number;
  };
}


// get previous car id set
var cid = Cookies.get("carID");
if (cid == undefined) {
  cid = "check";
}

async function get_car_status(id: string) {
  var res = await fetch(`/car_status/${id}`);
  res = await res.json();
  return res;
}

function Status() {
  const [carID, update_carid_] = useState(cid);
  const [carStatus, update_carStatus] = useState({
    cid: cid as string,
    fuel: 0,
    speed: 0,
    location: [0, 0] as [number, number],
    avg_distance: 0,
    avg_speed: 0,
  });

  useEffect(() => {
    get_car_status(carID as string).then((res) => {
      update_carStatus(res as any);
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
      <VehicleStatusComp info={carStatus} />
    </>
  );
}

const root = createRoot(document.getElementById("root") as Element);
root.render(<Status />);
