import React from "react";
import ReactDOM from "react-dom";
import {Provider as StoreProvider} from "react-redux";
import {createStore} from "redux";
import "./leaflet-fix"
import App from "./App";
import {CssBaseline} from "@material-ui/core";
import myApp from "./redux/myApp";

// window.location.replace("chrome://gpu");

const app = document.createElement("div");
app.id = "app";
document.body.append(app);

// @ts-ignore
const store = createStore(myApp);

ReactDOM.render(
    <StoreProvider store={store}>
        <CssBaseline/>
        <App/>
    </StoreProvider>,
    app);
