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
  user: "postgres",
  database: "db2",
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
function generate_query_intervals(type: string): string[] {
  const cur_date = new Date();

  var cur_hour = cur_date.getHours();
  var cur_minutes = cur_date.getMinutes();
  var cur_seconds = cur_date.getSeconds();

  var intervals = [];

  if (type == "hr") {
    // generating query intervals for hours
    for (let i = Math.max(0, cur_hour - 12); i < cur_hour; i++) {
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

      count += 1
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
  field: string
) {
  var query_promises = [];
  var cur_date = new Date();
  var year = cur_date.getFullYear();
  var month = cur_date.getMonth();
  var date = cur_date.getDate();

  var cur_iso_date = convert_to_iso_date_format(date, month, year);

  // generating the analytics promises - need to be checked
  if (field == "delta_d"){
        query_promises.push(pg_client.query(
    `SELECT vin, SUM(delta_d) AS sum, WHERE date = current_date and vin = ${vin} and time > LOCALTIME(0) - INTERVAL '15 minutes'`
  ));

query_promises.push(pg_client.query(
    `SELECT vin, SUM(delta_d) AS sum, WHERE date = current_date and vin = ${vin} and time > LOCALTIME(0) - INTERVAL '30 minutes'`
  ));

query_promises.push(pg_client.query(
    `SELECT vin, SUM(delta_d) AS sum, WHERE date = current_date and vin = ${vin} and time > LOCALTIME(0) - INTERVAL '45 minutes'`
  ));

  } else {
        query_promises.push(pg_client.query(
    `SELECT vin, AVG(speed) AS sum, WHERE date = current_date and vin = ${vin} and time > LOCALTIME(0) - INTERVAL '15 minutes'`
  ));

query_promises.push(pg_client.query(
    `SELECT vin, AVG(speed) AS sum, WHERE date = current_date and vin = ${vin} and time > LOCALTIME(0) - INTERVAL '15 minutes'`
  ));

query_promises.push(pg_client.query(
    `SELECT vin, AVG(speed) AS sum, WHERE date = current_date and vin = ${vin} and time > LOCALTIME(0) - INTERVAL '15 minutes'`
  ));


  }
  var query_results = await Promise.all(query_promises); 
  const ret_results = {};

  // @ts-ignore
  ret_results["labels"] = ["< 15 mins", "< 30 mins", "< 45 mins"]

  var label = field;
  var borderWidth = 1;
  var data = [];

  for (let results of query_results) {
    console.log(results.rows)
    // @ts-ignore
    data.push(results.rows[0]["avg"]);
  }

  //@ts-ignore
  ret_results["datasets"] = [{ label, data, borderWidth }];
  console.log(ret_results);
  return ret_results;
}

function get_bus_type(typeInDB: string): string {
  if (typeInDB == "M") {
    return "miniBus";
  }

  if (typeInDB == "D") {
    return "doubleDecker";
  }
  if (typeInDB == "E") {
    return "express";
  }

  return "coach";
}

function get_fuel_used(distance: number, type:string): number {
  return 0;
}

/**
 *
 *@description Function for querying server for fleet data of all
 *
 */
async function fleet_query_pgserver() {
  //const intervals = generate_query_intervals("hr"); 
  //console.log(intervals)

  //const hour_2_interval = intervals[-3];
  //var cur_date = new Date();
  //var year = cur_date.getFullYear();
  //var month = cur_date.getMonth();
  //var date = cur_date.getDate();
  //var cur_iso_date = convert_to_iso_date_format(date, month, year);

  var result = await pg_client.query(
    "SELECT type, SUM(delta_d) AS sum, COUNT(1) AS total FROM bus_data WHERE date = current_date GROUP BY type"
  );

  console.log(result.rows);
  var miniBus = {fuel:0, distance:0, number_of_bus:0};
  var doubleDecker = {fuel:0, distance:0, number_of_bus:0};
  var coach = {fuel:0, distance:0, number_of_bus:0};
  var express = {fuel:0, distance:0, number_of_bus:0};


  for (let bus of result.rows) {
    console.log(bus)

    if (get_bus_type((bus as any)["type"].trim()) == "miniBus") {
      miniBus = {
        fuel: get_fuel_used((bus as any)["sum"], (bus as any)["type"].trim()),
        distance: (bus as any)["sum"],
        number_of_bus: (bus as any)["total"],
      };
    }

    if (get_bus_type((bus as any)["type"].trim()) == "doubleDecker") {
      doubleDecker = {
        fuel: get_fuel_used((bus as any)["sum"], (bus as any)["type"].trim()),
        distance: (bus as any)["sum"],
        number_of_bus: (bus as any)["total"],
      };
    }

    if (get_bus_type((bus as any)["type"].trim()) == "coach") {
      coach = {
        fuel: get_fuel_used((bus as any)["sum"], (bus as any)["type"].trim()),
        distance: (bus as any)["sum"],
        number_of_bus: (bus as any)["total"],
      };
    }

    if (get_bus_type((bus as any)["type"].trim()) == "express") {
      express = {
        fuel: get_fuel_used((bus as any)["sum"], (bus as any)["type"].trim()),
        distance: (bus as any)["sum"],
        number_of_bus: (bus as any)["total"],
      };
    }
  }

  const ret_results = {
    miniBus,
    doubleDecker,
    coach,
    express,
  };

  return ret_results
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

    console.log(response);
    res.json({ response });
  } catch (e) {
    res.json({ error: { type: (e as Object).toString() } });
  }
});

app.get("/fleet", async (_: Request, res: Response) => {
  try {
    console.log("query received")
    const response = await fleet_query_pgserver();
    res.json(response);
  } catch (e) {
    res.json({ error: { type: (e as Object).toString() } });
  }
});

app.listen(8082, () =>
  console.log("analytics server is up and running on port 8082")
);
