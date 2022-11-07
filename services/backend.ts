import express, { Express, Request, Response } from "express";

// backed to send car data to the frontend

const app: Express = express();

app.use(express.static("public"));

app.get("/car_status/:carID", (req: Request, res: Response) => {
  const reqCarID: String = req.params["carID"];
  res.send(`${reqCarID} request was received at the backend`);
});

app.listen(8080, () => {
  console.log("server is up and running on port 8080");
});
