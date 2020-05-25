import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import QueryT from "../../types/QueryT";
import makeStyles from "@material-ui/core/styles/makeStyles";
import KnownObjectTypeInput from "../input/KnownObjectTypeInput";
import DistanceInput from "../input/DistanceInput";
import SearchOsmRow from "../input/SearchOsmRow";
import useAppDispatch from "../hooks/useAppDispatch";

const useClasses = makeStyles(theme => ({
    input_root: {
        display: "flex",
        flexDirection: "column",
    }
}), {name: "DestinationObject"});

export default function CriterionInput(props: {
    id: string
}) {
    const criterion_id = props.id;
    const classes = useClasses();
    const dispatch = useAppDispatch();
    const [object_type, setObjectType] = useState<QueryT.KnownObjectTypes | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [distance, setDistance] = useState<QueryT.Distance | null>();

    function emitChange(criterion: QueryT.CriterionAny | null) {
        dispatch("CRITERION_SET", {criterion_id, criterion});
    }

    function emitRightChange() {
        if (distance == null || object_type == null) {
            emitChange(null);
            return;
        }

        if (object_type == "lat_lng") {
            if (latitude != null && longitude != null) {
                let criterion: QueryT.CriterionLatLng = {
                    type: "lat_lng",
                    distance,
                    lat: latitude,
                    lng: longitude,
                };
                emitChange(criterion);
            } else {
                emitChange(null);
            }
        } else {
            // let criterion: QueryT.CriterionPoint = {
            //     type: object_type,
            //     distance,
            //     lat: latitude,
            //     lng: longitude,
            // };
            emitChange(null);
        }
    }

    function handleDistanceChange(distance: QueryT.Distance | null) {
        setDistance(distance);
        emitRightChange();
    }

    function handleObjectTypeChange(object_type: QueryT.KnownObjectTypes | null) {
        setObjectType(object_type);
        emitRightChange();
    }

    const display_rowsearch = object_type !== null && object_type != "lat_lng";
    const display_latlng = object_type == "lat_lng";

    return <div>
        <div className={classes.input_root}>

            <KnownObjectTypeInput value={object_type} onChange={type => handleObjectTypeChange(type)}/>

            <div style={{
                display: display_rowsearch ? undefined : "none",
            }}>
                <SearchOsmRow type={object_type}/>
            </div>

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

            <DistanceInput onChange={value => handleDistanceChange(value)}/>

        </div>
    </div>
}