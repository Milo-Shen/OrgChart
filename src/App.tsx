import React from "react";
import logo from "./logo.svg";
import "./App.css";

// Import Utils
import { mock_org_chart_data } from "./Utils/mock_org_chart_data";

let now = performance.now();
let data = mock_org_chart_data(100);
console.log(data, `${performance.now() - now} ms`);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
