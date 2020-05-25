import React from "react";
import MyMap from "./MyMap";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import QueryVisualizer from "./query/QueryVisualizer";
import {LatLngTuple} from "leaflet";

const useClasses = makeStyles(theme => ({
    root: {
        height: "100vh",
        width: "100%"
    },
    layout_root: {
        position: "relative",
        width: "100%",
        height: "100%"
    },
    query_root: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "350px",
        overflowY: "scroll",
        padding: theme.spacing(2),
        paddingBottom: "50%",
        background: "rgba(0, 0, 0, 0.3)",
        "&::-webkit-scrollbar": {
            display: "none"
        },
        zIndex: 2
    },
    map_root: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
    }
}), {name: "App"});

export default function App() {
    const classes = useClasses();

    function centerChanged(center: LatLngTuple) {
    }

    return <div className={classes.root}>

        <div className={classes.layout_root}>

            <div className={classes.map_root}>
                <MyMap onChangeCenter={centerChanged}/>
            </div>

            <div className={classes.query_root}>
                <QueryVisualizer/>
            </div>

        </div>

    </div>
}