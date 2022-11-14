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
