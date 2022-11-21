import express, { Express, Request, Response } from "express";
import FuzzySearch from "fuzzy-search";
import cars_json from "./cars.json";
import { createClient } from "redis";

// backed to send car data to the frontend

const CARS = cars_json["cars"];

const searcher = new FuzzySearch(CARS, ["id"], {
  caseSensitive: false,
  sort: true,
});

// setting up redis connection
const redisclient = createClient({
  socket: {
    host: "127.0.0.1",
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
  "/analytics/:carID/:queryParam/:time",
  async (req: Request, res: Response) => {
    const reqCarID: string = req.params["carID"];
    const reqQueryParam: string = req.params["queryParam"];
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
          label: reqQueryParam,
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        },
      ],
    });
  }
);

// fuzzy searching for the car id
app.get("/search", (req: Request, res: Response) => {
  const searchTerm: string = req.query.q as string;
  if (searchTerm == "check") {
    res.json({ carList: [] });
  } else {
    res.json({ carList: searcher.search(searchTerm).splice(0, 4) });
  }
});

app.listen(8080, () => {
  console.log("server is up and running on port 8080");
});
