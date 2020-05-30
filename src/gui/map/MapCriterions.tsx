import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import QueryT from "../../types/QueryT";
import {LatLngTuple} from "leaflet";
import {Circle, Marker} from "react-leaflet";
import React from "react";

export default function MapCriterions() {
    const query_state = useAppSelector(state => state.query_state);
    const criterions = useAppSelector(state => state.criterions);

    if (query_state != "picker") {
        return <></>;
    }

    return <>
        {Object.keys(criterions)
            .map((criterion_id, index) => {
                return <MapCriterionAssets key={criterion_id} index={index} criterion_id={criterion_id}/>
            })}
    </>
}

function MapCriterionAssets(props: {
    index: number,
    criterion_id: string,
}) {
    const dispatch = useAppDispatch();
    const criterion = useAppSelector(state => state.criterions[props.criterion_id]);

    if (criterion === null)
        return <></>;

    if (criterion.type === "lng_lat") {
        const typed_criterion = criterion as QueryT.CriterionLatLng;
        const position = [typed_criterion.lat, typed_criterion.lng] as LatLngTuple;

        return <>
            <Circle center={position} radius={typed_criterion.distance.value}/>
            <Marker
                draggable
                position={position}
                ondragend={event => {
                    const position = event.target.getLatLng();
                    dispatch("CRITERION_SET", {
                        criterion_id: props.criterion_id,
                        criterion: {
                            ...typed_criterion,
                            lat: position.lat as number,
                            lng: position.lng as number
                        }
                    })
                }}
            >
            </Marker>
        </>
    }
    return <></>;
}

