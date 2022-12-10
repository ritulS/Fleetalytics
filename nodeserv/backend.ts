import express, { Express, Request, Response } from "express";
import { createClient } from "redis";
import http from "http";

// backed to send car data to the frontend

// setting up redis connection
const redisclient = createClient({
  socket: {
    host: "redis.cache",
    port: 6379,
  },
  password: "hello",
});

redisclient.connect();
redisclient.on("connect", () =>
  console.log("client is now connected to redis cache!")
);
redisclient.on("error", (err) => console.log("error" + err));

// setting up express server
const app: Express = express();

app.use(express.static("public"));

app.get("/car_status/:carID", async (req: Request, res: Response) => {
  const reqCarID: string = req.params["carID"];
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
    const vin:string = req.params["vin"];
    const field:string = req.params["field"];
    res.json({
      labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          label: field,
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        },
      ],
    });
  }
);

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
    const req = http.request(options);
    req.end();
    req.on("response", (response) => response.pipe(res));
  }
});

app.listen(8080, () => {
  console.log("server is up and running on port 8080");
});
