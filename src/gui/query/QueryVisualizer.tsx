import React, {useState} from "react";
import QueryObject from "./QueryObject";
import Button from "@material-ui/core/Button";
import DestinationObject from "./DestinationObject";
import CriterionObjects from "./CriterionObjects";
import Typography from "@material-ui/core/Typography";
import QueryT from "../../types/QueryT";

export default function QueryVisualizer() {

    function distanceChanged(distance: QueryT.Distance) {
        console.log('visualizer', distance);
    }

    function ObjectTypeChanged(objectType: QueryT.KnownObjectTypes) {
        console.log('visualizer', objectType);
    }

    return <div>
        <Typography variant="h6" gutterBottom>
            Cel
        </Typography>
        <DestinationObject onDistanceChange={distanceChanged} onObjectTypeChange={ObjectTypeChanged}/>
        <CriterionObjects/>
    </div>
}
