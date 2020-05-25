import React from "react";
import CriterionObjects from "./CriterionObjects";
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DestinationInput from "./DestinationInput";

const useClasses = makeStyles(theme => ({
    root: {
        "&> * + *": {
            marginTop: theme.spacing(2)
        }
    }
}), {name: "QueryVisualizer"});

export default function QueryPiker() {
    const classes = useClasses();


    return <div className={classes.root}>
        <Card>
            <CardHeader title="Cel podróży"/>
            <CardContent>
                <DestinationInput/>
            </CardContent>
        </Card>

        <CriterionObjects/>
    </div>
}
