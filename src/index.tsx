import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();

/*document.head.append(
  document.createElement("link")
  <link
  href="https://fonts.googleapis.com/css?family=Open+Sans"
  rel="stylesheet"
/>;
)
*/
