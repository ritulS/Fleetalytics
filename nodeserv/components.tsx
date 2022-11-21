import { useEffect, useState } from "react";
import "./styles.css";

// function for testing things out
export function Hello() {
  return (
    <div>
      <p>Hello World!</p>
    </div>
  );
}

interface NavBarProps {
  type: string;
}

interface carIdInterface {
  id: string;
}

interface VehicleSearchModalListProps {
  carList: [carIdInterface];
  getInfo: Function;
}

interface VehicleSearchModalProps {
  update_carID: Function;
}

interface VehicleStatusCompProps {
  info: {
    cid: string;
    fuel: number;
    speed: number;
    location: [number, number];
    avg_distance: number;
    avg_speed: number;
  };
}

function VehicleSearchBtn() {
  return (
    <>
      <button
        className="ml-2 btn btn-outline-success"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#vehicleSearchModal"
      >
        search
      </button>
    </>
  );
}

function AnalyticsQueryBtn() {
  return (
    <>
      <button
        className="btn btn-outline-primary"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#analyticsQueryModal"
      >
        query
      </button>
    </>
  );
}

export function AnalyticsQueryModal(props: { updateQueryParams: Function }) {
  const [queryParams, updateQueryParams_] = useState({
    param: "speed",
    time: "day",
    plot: "line",
  });

  const updateQueryParams = (e: React.FormEvent<HTMLButtonElement>) =>
    props.updateQueryParams(queryParams);

  const updateParamVariable = (paramType: "speed" | "distance" | "fuel") =>
    updateQueryParams_({ ...queryParams, param: paramType });
  const updateTimeVariable = (timeType: "12-hrs" | "day" | "week") =>
    updateQueryParams_({ ...queryParams, time: timeType });
  const updatePlotVariable = (plotType: "line" | "bar") =>
    updateQueryParams_({ ...queryParams, plot: plotType });

  return (
    <>
      <div
        className="modal fade"
        id="analyticsQueryModal"
        tabIndex={-1}
        aria-labelledby="analyticsQueryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="analyticsQueryModalLabel">
                set analytics query parameters?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div
                className="btn-group"
                role="group"
                aria-label="Basic radio toggle button group"
              >
                <input
                  type="radio"
                  className="btn-check"
                  name="paramradio"
                  id="paramradio1"
                  autoComplete="off"
                  checked={queryParams.param == "speed" ? true : false}
                  onClick={() => updateParamVariable("speed")}
                ></input>
                <label
                  className="btn btn-outline-primary"
                  htmlFor="paramradio1"
                >
                  speed
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="paramradio"
                  id="paramradio2"
                  autoComplete="off"
                  onClick={() => updateParamVariable("fuel")}
                  checked={queryParams.param == "fuel" ? true : false}
                ></input>
                <label
                  className="btn btn-outline-primary"
                  htmlFor="paramradio2"
                >
                  fuel
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="paramradio"
                  id="paramradio3"
                  autoComplete="off"
                  onClick={() => updateParamVariable("distance")}
                  checked={queryParams.param == "distance" ? true : false}
                ></input>
                <label
                  className="btn btn-outline-primary"
                  htmlFor="paramradio3"
                >
                  distance
                </label>
              </div>
              <br></br>
              <div
                className="btn-group mt-2"
                role="group"
                aria-label="Basic radio toggle button group"
              >
                <input
                  type="radio"
                  className="btn-check"
                  name="timeradio"
                  id="timeradio1"
                  autoComplete="off"
                  checked={queryParams.time == "12-hrs" ? true : false}
                  onClick={() => updateTimeVariable("12-hrs")}
                ></input>
                <label className="btn btn-outline-primary" htmlFor="timeradio1">
                  12-hrs
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="timeradio"
                  id="timeradio2"
                  autoComplete="off"
                  checked={queryParams.time == "day" ? true : false}
                  onClick={() => updateTimeVariable("day")}
                ></input>
                <label className="btn btn-outline-primary" htmlFor="timeradio2">
                  day
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="timeradio"
                  id="timeradio3"
                  autoComplete="off"
                  checked={queryParams.time == "week" ? true : false}
                  onClick={() => updateTimeVariable("week")}
                ></input>
                <label className="btn btn-outline-primary" htmlFor="timeradio3">
                  week
                </label>
              </div>
              <br></br>

              <div
                className="btn-group mt-2"
                role="group"
                aria-label="Basic radio toggle button group"
              >
                <input
                  type="radio"
                  className="btn-check"
                  name="plotradio"
                  id="plotradio1"
                  autoComplete="off"
                  checked={queryParams.plot == "line" ? true : false}
                  onClick={() => updatePlotVariable("line")}
                ></input>
                <label className="btn btn-outline-primary" htmlFor="plotradio1">
                  line
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="plotradio"
                  id="plotradio2"
                  autoComplete="off"
                  checked={queryParams.plot == "bar" ? true : false}
                  onClick={() => updatePlotVariable("bar")}
                ></input>
                <label className="btn btn-outline-primary" htmlFor="plotradio2">
                  bar
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={updateQueryParams}
              >
                query
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function VehicleSearchModalInput(props: { setSearch: Function }) {
  const setSearch = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length > 2) {
      props.setSearch(e.currentTarget.value);
    }
  };

  return (
    <form>
      <input
        type="text"
        className="form-control"
        id="vehicleSearch"
        aria-describedby="vehicleHelp"
        onChange={setSearch}
      ></input>
    </form>
  );
}

function VehicleSearchModalList(props: VehicleSearchModalListProps) {
  const id_tsx = props.carList.map((value) => {
    return (
      <div key={value.id} onClick={() => props.getInfo(value.id)}>
        <p className="p-2 hover:cursor-pointer">{value.id}</p>
      </div>
    );
  });

  return <div>{id_tsx}</div>;
}

export function VehicleSearchModal(props: VehicleSearchModalProps) {
  const [search, setSearch] = useState("check");
  const [carList, updateCarList] = useState([]);

  // get fuzzy search on input into the box
  useEffect(() => {
    fetch("/search?q=" + search)
      .then((resp) => resp.json())
      .then((resp: { carList: [] }) => updateCarList(resp.carList));
  }, [search]);

  return (
    <div
      className="modal fade"
      id="vehicleSearchModal"
      tabIndex={-1}
      aria-labelledby="vehicleSearchModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="vehicleSearchModalLabel">
              search vehicle by id?
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>enter vehicle id?</p>
            <VehicleSearchModalInput setSearch={setSearch} />
            <VehicleSearchModalList
              carList={carList as unknown as [carIdInterface]}
              getInfo={props.update_carID}
            />
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={() => props.update_carID(search)}
            >
              info
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VehicleStatusComp(props: VehicleStatusCompProps) {
  return (
    <div className="w-full relative h-screen">
      <div className="m-0 w-1/2 absolute left-1/4 top-1/4 text-green-600 bg-neutral-700 rounded-md p-4">
        <h1 className="text-center text-green-500 underline underline-offset-4">
          car status
        </h1>
        <h3>car_id: {props.info.cid}</h3>
        <h3>fuel: {props.info.fuel}</h3>
        <h3>current speed: {props.info.speed}</h3>
        <h3>
          current location:{" "}
          {props.info.location[0] + "," + props.info.location[1]}
        </h3>
        <h3>avg distance covered: {props.info.avg_distance}</h3>
        <h3>avg speed: {props.info.avg_speed}</h3>
      </div>
    </div>
  );
}

export function NavBar(props: NavBarProps) {
  var isHome: Boolean = false;
  var isStatus: Boolean = false;
  var isAnalytics: Boolean = false;
  if (props.type == "home") {
    isHome = true;
  }

  if (props.type == "status") {
    isStatus = true;
  }

  if (props.type == "analytics") {
    isAnalytics = true;
  }

  return (
    <div className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/index.html">
          fleetalytics
        </a>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a
              className={"nav-link" + (isHome ? " active" : "")}
              href="/index.html"
            >
              home
            </a>
          </li>
          <li className="nav-item">
            <a
              className={"nav-link" + (isStatus ? " active" : "")}
              href="/status.html"
            >
              car status
            </a>
          </li>
          <li className="nav-item">
            <a
              className={"nav-link" + (isAnalytics ? " active" : "")}
              href="/analytics.html"
            >
              analytics
            </a>
          </li>
        </ul>
        <form className="d-flex" role="search">
          {isAnalytics && <AnalyticsQueryBtn />}
          <VehicleSearchBtn />
        </form>
      </div>
    </div>
  );
}
