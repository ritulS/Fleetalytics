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

export function VehicleSearchBtn() {
  return (
    <div>
      <button
        className="btn btn-primary"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#vehicleSearchModal"
      >
        Search for Vehicle
      </button>
    </div>
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
      <div id={value.id} onClick={() => props.getInfo()}>
        <p className="p-2 hover:cursor-pointer">{value.id}</p>
      </div>
    );
  });

  return <div>{id_tsx}</div>;
}

export function VehicleSearchModal() {
  const [search, setSearch] = useState("check");
  const [carList, updateCarList] = useState([]);

  // get fuzzy search on input into the box
  useEffect(() => {
    fetch("/search?q=" + search)
      .then((resp) => resp.json())
      .then((resp: { carList: [] }) => updateCarList(resp.carList));
  }, [search]);

  const fake_get_info = () =>
    console.log("fake get info button has been clicked");

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
              getInfo={fake_get_info}
            />
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={fake_get_info}
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
      </div>
    </div>
  );
}
