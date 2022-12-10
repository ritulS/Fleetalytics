import express, { Express, Request, Response } from "express";
import cors from "cors";
import pg from "pg";

/*
 * Postgres setup
 * Schema design
 * {
 *  vin:
 *  latitude:
 *  longitude:
 *  latitude:
 *  time:
 *  fuel:
 *  speed:
 *  distance:
 * }
 */

const pg_client = new pg.Client({
  host: "postgres.database",
  port: 5432,
  password: "password",
  user: "node_analytics",
});

pg_client
  .connect()
  .then(() => console.log("node analytics is now connected to pg database"))
  .catch(() => console.log("error in connection"));

function convert_to_iso_time_format(
  hr: number,
  min: number,
  secs: number
): string {
  var hr_st: string;
  var min_st: string;
  var secs_st: string;

  if (hr < 10) {
    hr_st = "0" + hr.toString();
  } else {
    hr_st = hr.toString();
  }

  if (min < 10) {
    min_st = "0" + min.toString();
  } else {
    min_st = min.toString();
  }

  if (secs < 10) {
    secs_st = "0" + secs.toString();
  } else {
    secs_st = secs.toString();
  }

  return `${hr_st}:${min_st}:${secs_st}`;
}

function convert_to_iso_date_format(
  date: number,
  month: number,
  year: number
): string {
  var date_st: string;
  var month_st: string;
  var year_st = year.toString();

  if (date < 10) {
    date_st = "0" + date.toString();
  } else {
    date_st = date.toString();
  }

  if (month < 9) {
    month_st = "0" + (month + 1).toString();
  } else {
    month_st = month.toString();
  }

  return `${year_st}-${month_st}-${date_st}`;
}

// for now only gets intervals for current date
function generate_query_intervals(type: String): string[] {
  const cur_date = new Date();

  var cur_hour = cur_date.getHours();
  var cur_minutes = cur_date.getMinutes();
  var cur_seconds = cur_date.getSeconds();

  var intervals = [];

  if (type == "hr") {
    // generating query intervals for hours
    for (let i = Math.max(0, cur_hour - 12); i < cur_hour; i--) {
      intervals.push(convert_to_iso_time_format(i, cur_minutes, cur_seconds));
    }
  } else {
    // generating query intervals for minute
    var min_add = 30;
    var st = Math.max(0, cur_hour - 12);
    var min_st = 0;

    if (type == "15m") {
      min_add = 15;
    }

    var count = 0;
    while (count < 12) {
      min_st += min_add;
      if (min_st > 60) {
        st += 1;
        min_st = 0;
      }
      intervals.push(convert_to_iso_time_format(st, min_st, cur_seconds));
    }
  }

  return intervals;
}

/**
 *
 *  @description Function for querying server using interval generated
 *
 *
 */
async function interval_query_pgserver(
  vin: string,
  intervals: string[],
  field: string
) {
  var query_promises = [];
  var cur_date = new Date();
  var year = cur_date.getFullYear();
  var month = cur_date.getMonth();
  var date = cur_date.getDate();

  var cur_iso_date = convert_to_iso_date_format(date, month, year);

  // generating the analytics promises
  for (let i = 1; i < intervals.length; i++) {
    var stval = intervals[i - 1];
    var endval = intervals[i];
    query_promises.push(
      pg_client.query(
        `SELECT AVG(${field}) FROM car_logs WHERE date = ${cur_iso_date} AND time >= ${stval} AND time < ${endval} AND vin = ${vin}`
      )
    );
  }

  var results = await Promise.all(query_promises);
  return results;
}

const app: Express = express();
app.use(cors());
app.use(express.json());

/*
 * {
 * labels: []
 * datasets: [{label, data:[], borderWidth:1}]
 * }
 * example:
 * res.json({
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
    }) 
 *
 */

app.post("/analytics", async (req: Request, res: Response) => {
  try {
    const type: string = req.body["interval"];
    const field: string = req.body["field"];
    const vin: string = req.body["vin"];
    var intervals = generate_query_intervals(type);
    const response = await interval_query_pgserver(vin, intervals, field);
    res.json({ query: response });
  } catch (e) {
    res.json({ error: { type: (e as Object).toString() } });
  }
});

app.listen(8082, () =>
  console.log("analytics server is up and running on port 8082")
);
