import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import useAppSelector from "../hooks/useAppSelector";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import spbd_algorithm from "../spbd_algorithm";
import useAppDispatch from "../hooks/useAppDispatch";
import notNullOrUndef from "../lib/notNullOrUndef";

const useClasses = makeStyles(theme => ({
    title_root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        "& > * + *": {
            marginLeft: theme.spacing(3)
        }
    }
}), {name: "QueryDialog"});


export default function QueryDialog() {
    const classes = useClasses();
    const dispatch = useAppDispatch();
    const [dialog_title, setDialogTitle] = useState<string>("Ładowanie");
    const query_state = useAppSelector(state => state.query_state);
    const app_state = useAppSelector(state => state);

    useEffect(() => {
        if (query_state === "querying") {
            const criterions = Object.keys(app_state.criterions).map(criterion_id => {
                return app_state.criterions[criterion_id];
            }).filter(notNullOrUndef);

            if (app_state.destination === null) {
                console.error("to trzeba obsłużyć")
                return;
            }

            spbd_algorithm({
                destination: app_state.destination,
                criterions
            }).then(results => {
                dispatch("RESULT_EXPANDED_INDEX_SET", -1);
                dispatch("RESULTS_SET", results);
                dispatch("QUERY_STATE_SET", "result");
            }).catch(error => {
                console.log(error);
            });
        }
    }, [query_state])

    return <>
        <Dialog open={query_state === "querying"}>
            <DialogTitle>
                <div className={classes.title_root}>
                    <CircularProgress/>
                    <div>{dialog_title} ...</div>
                </div>
            </DialogTitle>
        </Dialog>
    </>
}

