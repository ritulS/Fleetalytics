import { createRoot } from "react-dom/client";
import react, { useEffect, useState } from "react";
import { NavBar, VehicleSearchBtn, VehicleSearchModal } from "./components";
import Cookies from "js-cookie";
import "./styles.css";

// get previous car id set
var cid = Cookies.get("carID");
if (cid == undefined) {
  cid = "check";
}

function fake_get_car_analytics(id: string) {
  console.log("fake get car analytics has been clicked");
}

function Analytics() {
  const [carID, update_carid_] = useState(cid);

  //setup use effect for different analytics

  return (
    <>
      <NavBar type="analytics" />
      <VehicleSearchModal update_carID={fake_get_car_analytics} />
    </>
  );
}

const root = createRoot(document.getElementById("root") as Element);
root.render(<Analytics />);
