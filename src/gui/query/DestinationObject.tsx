import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import QueryT from "../../types/QueryT";
import makeStyles from "@material-ui/core/styles/makeStyles";
import KnownObjectTypeInput from "../input/KnownObjectTypeInput";
import DistanceInput from "../input/DistanceInput";
import SearchOsmRow from "../input/SearchOsmRow";

const useClasses = makeStyles(theme => ({
    input_root: {
        display: "flex",
        flexDirection: "column",
    }
}), {name: "DestinationObject"});

export default function DestinationObject(props: {
    onChange?: (criterion: QueryT.CriterionAny | null) => void,
    onDistanceChange?: (distance: QueryT.Distance | null) => void,
    onObjectTypeChange?: (object_type: QueryT.KnownObjectTypes | null) => void
}) {
    const classes = useClasses();
    const [object_type, setObjectType] = useState<QueryT.KnownObjectTypes | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [distance, setDistance] = useState<QueryT.Distance | null>();

    function emitChange() {
        if (distance == null || object_type == null) {
            props.onChange?.(null);
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
                props.onChange?.(criterion);
            } else {
                props.onChange?.(null);
            }
        } else {
            // let criterion: QueryT.CriterionPoint = {
            //     type: object_type,
            //     distance,
            //     lat: latitude,
            //     lng: longitude,
            // };
            props.onChange?.(null);
        }
    }

    function handleDistanceChange(distance: QueryT.Distance | null) {
        setDistance(distance);
        props.onDistanceChange?.(distance);
        emitChange();
    }

    function handleObjectTypeChange(object_type: QueryT.KnownObjectTypes | null) {
        setObjectType(object_type);
        props.onObjectTypeChange?.(object_type);
        emitChange();
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
                value={longitude}
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
                value={latitude}
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