import React from "react";
import CriterionObjects from "./CriterionObjects";
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DestinationInput from "./DestinationInput";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import useAppDispatch from "../hooks/useAppDispatch";

const useClasses = makeStyles(theme => ({
    root: {
        "&> * + *": {
            marginTop: theme.spacing(2)
        }
    }
}), {name: "QueryVisualizer"});

export default function QueryPiker() {
    const classes = useClasses();
    const dispatch = useAppDispatch();

    function startQuery() {
        dispatch("QUERY_STATE_SET", "querying");
    }

    return <div className={classes.root}>
        <Card>
            <CardHeader title="Cel podróży"/>
            <CardContent>
                <DestinationInput/>
            </CardContent>
            <CardActions>
                <Button onClick={startQuery}>
                    Szukaj
                </Button>
                <Button>
                    Wyczyść
                </Button>
            </CardActions>
        </Card>

        <CriterionObjects/>
    </div>
}
