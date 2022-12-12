import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { NavBar, FleetStatus } from "./components";

async function get_fleet_status() {
  var res = await fetch("/fleet");
  res = await res.json();
  return res;
}

/*
 *{
 * id (bus-type): {
 *  fuel:
 *   distance:
 *   number_of_buses:
 * }
 * }
 */

function FleetView() {
  const [fleetInfo, updateFleetInfo] = useState({
    miniBus: { fuel: 0, distance: 0, number_of_bus: 0 },
    doubleDecker: { fuel: 0, distance: 0, number_of_bus: 0 },
    coach: { fuel: 0, distance: 0, number_of_bus: 0 },
    express: { fuel: 0, distance: 0, number_of_bus: 0 },
  });

  const [counter, updateCounter] = useState(0);
  const plusList = [-1, 1];

  setTimeout(
    () => updateCounter(counter + plusList[Math.floor(Math.random() * 2)]),
    2000
  );
  //@ts-ignore
  useEffect(() => {
    //@ts-ignore
    get_fleet_status().then((result) => updateFleetInfo(result));
  }, [counter]);

  return (
    <>
      <NavBar type="fleetview" />
      <FleetStatus fleetInfo={fleetInfo} />
    </>
  );
}

const root = createRoot(document.getElementById("root") as Element);
root.render(<FleetView />);
