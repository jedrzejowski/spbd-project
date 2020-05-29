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

    const [distance, setDistance] = useState<QueryT.Distance | null>();
    const [osm_row, setOsmRow] = useState<QueryT.OsmRowReference | null>(null);
    const map_center = useAppSelector(state => state.map_center);

    function emitChange(criterion: QueryT.CriterionAny | null) {
        dispatch("CRITERION_SET", {criterion_id, criterion});
    }

    useEffect(() => {

        if (distance == null || object_type == null) {
            emitChange(null);
            return;
        }

        if (object_type == "lng_lat") {
            if (latitude != null && longitude != null) {
                let criterion: QueryT.CriterionLatLng = {
                    type: "lng_lat",
                    distance,
                    lat: latitude,
                    lng: longitude,
                };
                emitChange(criterion);
            } else {
                emitChange(null);
            }
        } else {
            let criterion: QueryT.CriterionPoint = {
                type: object_type,
                distance,
                osm_row
            };
            emitChange(criterion);
        }
    }, [object_type, latitude, longitude, distance])

    useEffect(() => {
        if (object_type === "lng_lat") {
            setLatitude(map_center[0]);
            setLongitude(map_center[1]);
        }
    }, [object_type])

    useEffect(() => {
        if (criterion?.type === "lng_lat") {
            const criterion_typed = criterion as QueryT.CriterionLatLng;

            // badamy czy zostało zmienione w tym komponencie, czy na zewnątrz (poprzez przemieszczenie markera)
            if (criterion_typed.lat !== latitude || criterion_typed.lng !== longitude) {
                setLatitude(criterion_typed.lat);
                setLongitude(criterion_typed.lng);
            }
        }

    }, [criterion])

    const display_rowsearch = object_type !== null && object_type != "lng_lat";
    const display_latlng = object_type == "lng_lat";

    return <div>
        <div className={classes.input_root}>

            <KnownObjectTypeInput value={object_type} onChange={type => setObjectType(type)}/>

            {/*<div style={{*/}
            {/*    display: display_rowsearch ? undefined : "none",*/}
            {/*}}>*/}
            {/*    <SearchOsmRow type={object_type} onChange={osm_ref => setOsmRow(osm_ref)}/>*/}
            {/*</div>*/}

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
                    display: object_type == "lng_lat" ? undefined : "none"
                }}
            />

            <DistanceInput onChange={value => setDistance(value)}/>

        </div>
    </div>
}