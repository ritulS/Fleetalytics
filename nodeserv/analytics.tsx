import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { NavBar, AnalyticsQueryModal, VehicleSearchModal } from "./components";
import Cookies from "js-cookie";
import "./styles.css";

// get previous car id set
var cid = Cookies.get("carID");
if (cid == undefined) {
  cid = "check";
}

// setting up chart
var CHART: any = undefined;

interface GraphDataset {
  id: string;
  label: string;
  data: number[];
}

interface GraphData {
  labels: string[];
  datasets: [GraphDataset];
}

async function draw_chart(cfg: any) {
  // setting up the chart
  const ctx = (
    document.getElementById("chart") as HTMLCanvasElement
  ).getContext("2d");
  //@ts-ignore
  if (CHART != undefined) {
    CHART.destroy();
  }
  //@ts-ignore
  CHART = new Chart(ctx, cfg);
}

async function get_car_analytics(carID: string, param: string, time: string) {
  var res = await fetch(`/analytics/${carID}/${param}/${time}`);
  res = await res.json();
  return res;
}

function Analytics() {
  const [carID, update_carid_] = useState(cid);
  const [queryParams, updateQueryParams_] = useState({
    param: "speed",
    time: "day",
    plot: "line",
  });

  const create_new_graph = (res: any) => {
    draw_chart({
      type: queryParams.plot,
      data: res,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  //setup use effect for different analytics
  useEffect(() => {
    get_car_analytics(
      carID as string,
      queryParams.param,
      queryParams.time
    ).then((res) => create_new_graph(res));
  }, [carID, queryParams]);

  return (
    <>
      <NavBar type="analytics" />
      <VehicleSearchModal
        update_carID={(carID: string) => update_carid_(carID)}
      />
      <AnalyticsQueryModal
        updateQueryParams={(queryParams: {
          param: string;
          time: string;
          plot: string;
        }) => updateQueryParams_(queryParams)}
      />
    </>
  );
}

const root = createRoot(document.getElementById("root") as Element);
root.render(<Analytics />);
