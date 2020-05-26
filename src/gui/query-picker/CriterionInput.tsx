import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import QueryT from "../../types/QueryT";
import makeStyles from "@material-ui/core/styles/makeStyles";
import KnownObjectTypeInput from "./KnownObjectTypeInput";
import DistanceInput from "./DistanceInput";
import SearchOsmRow from "./SearchOsmRow";
import useAppDispatch from "../hooks/useAppDispatch";
import useAppSelector from "../hooks/useAppSelector";

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
    const criterion = useAppSelector(state => state.criterions[criterion_id]);
    if (criterion?.type === "lat_lng"
        && (criterion as QueryT.CriterionLatLng).lat !== latitude // badamy czy zostało zmienione w tym komponencie, czy na zewnątrz (poprzez przemieszczenie markera)
        && (criterion as QueryT.CriterionLatLng).lng !== longitude
    ){
        setLatitude((criterion as QueryT.CriterionLatLng).lat);
        setLongitude((criterion as QueryT.CriterionLatLng).lng);
    }

    const [distance, setDistance] = useState<QueryT.Distance | null>();
    const map_center = useAppSelector(state => state.map_center);

    function emitChange(criterion: QueryT.CriterionAny | null) {
        dispatch("CRITERION_SET", {criterion_id, criterion});
    }

    useEffect(() => {

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
    }, [object_type, latitude, longitude, distance])

    useEffect(() => {
        if (object_type === "lat_lng") {
            setLatitude(map_center[0]);
            setLongitude(map_center[1]);
        }
    }, [object_type])

    const display_rowsearch = object_type !== null && object_type != "lat_lng";
    const display_latlng = object_type == "lat_lng";

    return <div>
        <div className={classes.input_root}>

            <KnownObjectTypeInput value={object_type} onChange={type => setObjectType(type)}/>

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

            <DistanceInput onChange={value => setDistance(value)}/>

        </div>
    </div>
}