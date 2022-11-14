import express, { Express, Request, Response } from "express";
import FuzzySearch from "fuzzy-search";
import cars_json from "./cars.json";

// backed to send car data to the frontend

const CARS = cars_json["cars"];

const searcher = new FuzzySearch(CARS, ["id"], {
  caseSensitive: false,
  sort: true,
});

const app: Express = express();

app.use(express.static("public"));

app.get("/car_status/:carID", (req: Request, res: Response) => {
  const reqCarID: String = req.params["carID"];
  res.send(`${reqCarID} request was received at the backend`);
});

// fuzzy searching for the car id
app.get("/search", (req: Request, res: Response) => {
  const searchTerm: string = req.query.q as string;
  if (searchTerm == "check") {
    res.json({ carList: [] });
  }

  res.json({ carList: searcher.search(searchTerm).splice(0, 4) });
});

app.listen(8080, () => {
  console.log("server is up and running on port 8080");
});
