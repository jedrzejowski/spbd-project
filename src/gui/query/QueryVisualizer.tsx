import React from "react";
import DestinationObject from "./DestinationObject";
import CriterionObjects from "./CriterionObjects";
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useClasses = makeStyles(theme => ({
    root: {
        "&> * + *": {
            marginTop: theme.spacing(2)
        }
    }
}), {name: "QueryVisualizer"});

export default function QueryVisualizer() {
    const classes = useClasses();


    return <div className={classes.root}>
        <Card>
            <CardHeader title="Cel podróży"/>
            <CardContent>
                <DestinationObject/>
            </CardContent>
        </Card>

        <CriterionObjects/>
    </div>
}
