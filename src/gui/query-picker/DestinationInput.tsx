import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import QueryT from "../../types/QueryT";
import makeStyles from "@material-ui/core/styles/makeStyles";
import KnownObjectTypeInput from "./KnownObjectTypeInput";
import DistanceInput from "./DistanceInput";
import SearchOsmRow from "./SearchOsmRow";
import useAppDispatch from "../hooks/useAppDispatch";

const useClasses = makeStyles(theme => ({
    input_root: {
        display: "flex",
        flexDirection: "column",
    }
}), {name: "DestinationInput"});

export default function DestinationInput() {
    const classes = useClasses();
    const dispatch = useAppDispatch();
    const [object_type, setObjectType] = useState<QueryT.KnownObjectTypes | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);


    function handleObjectTypeChange(object_type: QueryT.KnownObjectTypes | null) {
        setObjectType(object_type);
        // emitRightChange();
    }

    const display_latlng = object_type == "lat_lng";

    return <div>
        <div className={classes.input_root}>

            <KnownObjectTypeInput value={object_type} onChange={type => handleObjectTypeChange(type)}/>

            <TextField
                label="Szerokość"
                type="number"
                variant="outlined"
                margin="dense"
                value={longitude ?? ""}
                onChange={event => {
                    const num = parseFloat(event.target.value);
                    setLongitude(Number.isNaN(num) ? null : num);
                }}
                style={{
                    display: display_latlng ? undefined : "none"
                }}
            />
            <TextField
                label="Długość"
                type="number"
                variant="outlined"
                margin="dense"
                value={latitude ?? ""}
                onChange={event => {
                    const num = parseFloat(event.target.value);
                    setLatitude(Number.isNaN(num) ? null : num);
                }}
                style={{
                    display: object_type == "lat_lng" ? undefined : "none"
                }}
            />

        </div>
    </div>
}