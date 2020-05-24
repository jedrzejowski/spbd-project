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
    }
}));

export default function App() {
    const classes = useClasses();

    function centerChanged(center: LatLngTuple){
        //console.log(center);
    }
    return <div>
        <Grid container classes={{
            root: classes.root
        }}>
            <Grid item xs={6}>
                <QueryVisualizer/>
            </Grid>
            <Grid item xs={6}>
                <MyMap onChangeCenter={centerChanged}/>
            </Grid>
        </Grid>
    </div>
}