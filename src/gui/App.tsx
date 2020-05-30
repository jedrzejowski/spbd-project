import React from "react";
import MyMap from "./map/MyMap";
import makeStyles from "@material-ui/core/styles/makeStyles";
import QueryPiker from "./query-picker/QueryPiker";
import useAppSelector from "./hooks/useAppSelector";
import ResultViewer from "./result-viewer/ResultViewer";
import QueryDialog from "./query-dialog/QueryDialog";

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
    menu_root: {
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
    const query_state = useAppSelector(state => state.query_state);

    return <div className={classes.root}>

        <div className={classes.layout_root}>

            <div className={classes.map_root}>
                <MyMap/>
            </div>

            <div className={classes.menu_root} style={{
                display: query_state === "picker" ? undefined : "none"
            }}>
                <QueryPiker/>
            </div>

            <div className={classes.menu_root} style={{
                display: query_state === "result" ? undefined : "none"
            }}>
                <ResultViewer/>
            </div>

            <QueryDialog/>

        </div>

    </div>
}