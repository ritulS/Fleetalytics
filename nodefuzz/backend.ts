import FuzzySearch from "fuzzy-search";
import cars_json from "./cars.json";
import express, { Express, Request, Response } from "express";
import cors from "cors";

const CARS = cars_json["cars"];

const searcher = new FuzzySearch(CARS, ["vin"], {
  caseSensitive: false,
  sort: true,
});

// setting up express server
const app: Express = express();

app.use(cors());

// fuzzy searching for the car id
app.get("/search", (req: Request, res: Response) => {
  const searchTerm: string = req.query.q as string;
  res.json({ carList: searcher.search(searchTerm).splice(0, 4) });
});

app.listen(8081, () => {
  console.log("server is up and running on port 8081");
});
