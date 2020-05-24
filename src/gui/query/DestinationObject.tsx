import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import QueryT from "../../types/QueryT";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import KnownObjectTypeInput from "../input/KnownObjectTypeInput";
import DistancesInput from "./DistancesInput";
import SearchOsmInput from "../input/SearchOsmInput";
import DistanceInput from "./DistanceInput";
import {LatLngTuple} from "leaflet";


const useClasses = makeStyles(theme => ({
    input_root: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(1),
        "& > * + *": {
            marginTop: theme.spacing(1),
            width: "100%"
        }
    }
}), {name: "DestinationObject"});

export default function DestinationObject(props:{
    onDistanceChange?: (point: QueryT.Distance) => void,
    onObjectTypeChange?: (point: QueryT.KnownObjectTypes) => void
}) {
    const [distance, setDistance] = useState<QueryT.Distance | null>();

    const classes = useClasses();

    const [object_type, setObjectType] = useState<QueryT.KnownObjectTypes | null>(null);

    function handleDistanceChange(distance: QueryT.Distance | undefined | null){

        if (props.onDistanceChange && distance) {
            props.onDistanceChange(distance);
            setDistance(distance);
        }
    }

    function handleObjectTypeChange(objectType: QueryT.KnownObjectTypes | undefined | null){
        if (props.onObjectTypeChange && objectType) {
            props.onObjectTypeChange(objectType);
            setObjectType(objectType);
        }
    }

    return <div>
        <Paper elevation={3}>
            <div className={classes.input_root}>
                <KnownObjectTypeInput
                    onChange={type =>
                        handleObjectTypeChange(type)
                    }/>

                <TextField
                    label="Szerokość"
                    type="number"
                    variant="outlined"
                    style={{
                        display: object_type == "lat_long" ? undefined : "none"
                    }}
                />
                <TextField
                    label="Długość"
                    type="number"
                    variant="outlined"
                    style={{
                        display: object_type == "lat_long" ? undefined : "none"
                    }}
                />

                <DistanceInput
                    distance={distance}
                    onChange={value => {
                        handleDistanceChange(value);
                    }}/>

            </div>
        </Paper>
    </div>
}