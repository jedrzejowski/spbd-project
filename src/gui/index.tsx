import React from "react";
import ReactDOM from "react-dom";
import "./leafletFix"
import App from "./App";
import {CssBaseline} from "@material-ui/core";


const app = document.createElement("div");
app.id = "app";
document.body.append(app);

ReactDOM.render(
    <>
        <CssBaseline/>
        <App/>
    </>,
    app);
