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
  vin: string;
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
    vin: string;
    fuel: number;
    speed: number;
    location: [number, number];
    avg_distance: number;
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

  const updateParamVariable = (paramType: "delta_d" | "speed") =>
    updateQueryParams_({ ...queryParams, param: paramType });
  const updateTimeVariable = (timeType: "1h" | "30m" | "15m") =>
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
                  id="paramradio3"
                  autoComplete="off"
                  onClick={() => updateParamVariable("delta_d")}
                  checked={queryParams.param == "delta_d" ? true : false}
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
      <div key={value["vin"]} onClick={() => props.getInfo(value["vin"])}>
        <p className="p-2 hover:cursor-pointer">{value["vin"]}</p>
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
              search vehicle by vin?
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>enter vehicle vin?</p>
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
    <div className="w-full rounded-md p-4 text-zinc-50">
      <h3 className="text-center text-green-500 underline underline-offset-4">
        car status
      </h3>
      <h4>car_id: {props.info.vin}</h4>
      <h4>fuel: {props.info.fuel}</h4>
      <h4>current speed: {props.info.speed}</h4>
      <h4>
        current location:{" "}
        {props.info.location[0] + "," + props.info.location[1]}
      </h4>
      <h4>avg distance covered: {props.info.avg_distance}</h4>
    </div>
  );
}

export function NavBar(props: NavBarProps) {
  var isHome: Boolean = false;
  var isStatus: Boolean = false;
  var isAnalytics: Boolean = false;
  var isFleetView: Boolean = false;

  if (props.type == "home") {
    isHome = true;
  }

  if (props.type == "status") {
    isStatus = true;
  }

  if (props.type == "analytics") {
    isAnalytics = true;
  }

  if (props.type == "fleetview") {
    isFleetView = true;
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
          <li className="nav-item">
            <a
              className={"nav-link" + (isFleetView ? " active" : "")}
              href="/fleetview.html"
            >
              fleetview
            </a>
          </li>
        </ul>
        <form className="d-flex" role="search">
          {isAnalytics && <AnalyticsQueryBtn />}
          {!isFleetView && <VehicleSearchBtn />}
        </form>
      </div>
    </div>
  );
}

export function FleetStatus(props: any) {
  return (
    <div className="w-full p-10">
      <div className="flex justify-between text-zinc-50 w-1/2 relative left-1/4 mb-10">
        <div className="space-y-2">
          <h3>Mini Bus</h3>
          <img src="/miniBus.jpg" className="img-fluid" alt="miniBus"></img>
          <p>fuel: {props.fleetInfo.miniBus.fuel}</p>
          <p>distance covered: {props.fleetInfo.miniBus.distance}</p>
          <p>number of buses: {props.fleetInfo.miniBus.number_of_bus}</p>
        </div>
        <div className="space-y-2">
          <h3>Double Decker Bus</h3>
          <img
            src="/doubleDecker.jpg"
            className="img-fluid"
            alt="doubleDecker"
          ></img>
          <p>fuel: {props.fleetInfo.doubleDecker.fuel}</p>
          <p>distance covered: {props.fleetInfo.doubleDecker.distance}</p>
          <p>number of buses: {props.fleetInfo.doubleDecker.number_of_bus}</p>
        </div>
      </div>
      <div className="flex justify-between text-zinc-50 w-1/2 relative left-1/4">
        <div className="space-y-2">
          <h3>Coach Bus</h3>
          <img src="/coach.jpg" className="img-fluid" alt="coach"></img>
          <p>fuel: {props.fleetInfo.miniBus.fuel}</p>
          <p>distance covered: {props.fleetInfo.coach.distance}</p>
          <p>number of buses: {props.fleetInfo.coach.number_of_bus}</p>
        </div>

        <div className="space-y-2">
          <h3>Express Bus</h3>
          <img src="/express.jpg" className="img-fluid" alt="express"></img>
          <p>fuel: {props.fleetInfo.miniBus.fuel}</p>
          <p>distance covered: {props.fleetInfo.express.distance}</p>
          <p>number of buses: {props.fleetInfo.express.number_of_bus}</p>{" "}
        </div>
      </div>
    </div>
  );
}
