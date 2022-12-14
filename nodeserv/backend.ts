import express, { Express, Request, Response } from "express";
import { createClient } from "redis";
import http from "http";
// get json data which has car ids
import cars from "./cars.json";

// backed to send car data to the frontend

// setting up redis connection
const redisclient = createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
  password: "hello",
});

var VINS: [any] = (cars as any)["cars"] as [any];

const COORDINATE_CACHE: any = {};

async function get_status_from_cache_at_interval() {
  for (let vin of VINS) {
    let data = await redisclient.get(vin["id"]);
    if (data != null) {
      data = JSON.parse(data);
      COORDINATE_CACHE[vin["id"]] = (data as any)["coordinates"] as [
        number,
        number
      ];
    }
  }
}

redisclient.connect();

redisclient.on("connect", () => {
  console.log("client is now connected to redis cache!");
  setInterval(() => get_status_from_cache_at_interval(), 1000);
});

redisclient.on("error", (err) => console.log("error" + err));

// setting up express server
const app: Express = express();

app.use(express.static("public"));

app.get("/coordinates", async (req: Request, res: Response) => {
  const vin: string = req.query.vin as string;
  if (vin == "check") {
    res.json(COORDINATE_CACHE);
  } else {
    res.json({ car: COORDINATE_CACHE[req.query.vin as string] });
  }
});

app.get("/car_status/:vin", async (req: Request, res: Response) => {
  const reqCarID: string = req.params["vin"];
  try {
    const value = await redisclient.get(reqCarID);
    res.send(value);
  } catch {
    res.json({ err: "car with id not found" });
  }
});

// fake analytics route
app.get(
  "/analytics/:vin/:field/:interval",
  async (req: Request, res: Response) => {
    const vin: string = req.params["vin"];
    const field: string = req.params["field"];
    const interval: string = req.params["interval"];

    const post_data = {
      vin,
      field,
      interval,
    };
    const post_data_json: string = JSON.stringify(post_data);

    const options = {
      port: 8082,
      host: "node.analytics",
      method: "POST",
      path: "/analytics",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(post_data_json),
      },
    };

    const req_proxy = http.request(options);
    req_proxy.write(post_data_json);
    req_proxy.on("response", (response) => response.pipe(res));
  }
);

app.get("/fleet", (_: Request, res: Response) => {
  const options = {
    port: 8082,
    host: "node.analytics",
    method: "GET",
    path: "/fleet",
  };

  //const req_proxy = http.request(options);
  //req_proxy.on("response", (response) => response.pipe(res));
  res.json({
    miniBus: { fuel: 0, distance: 0, number_of_bus: 0 },
    doubleDecker: { fuel: 0, distance: 0, number_of_bus: 0 },
    coach: { fuel: 0, distance: 0, number_of_bus: 0 },
    express: { fuel: 0, distance: 0, number_of_bus: 0 },
  });
});

app.get("/search", (req: Request, res: Response) => {
  const searchTerm: string = req.query.q as string;

  if (searchTerm == "check") {
    res.json({ carList: [] });
  } else {
    const options = {
      port: 8081,
      host: "node.fuzz",
      method: "GET",
      path: `/search?q=${searchTerm}`,
    };
    const req_proxy = http.request(options);
    req_proxy.end();
    req_proxy.on("response", (response) => response.pipe(res));
  }
});

app.listen(8080, () => {
  console.log("server is up and running on port 8080");
});
