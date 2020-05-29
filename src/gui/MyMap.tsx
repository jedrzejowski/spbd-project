import React, {useState} from 'react'
import {Circle, Map, Marker, Popup, TileLayer, ZoomControl} from "react-leaflet"
import {LatLngTuple} from "leaflet";
import useAppSelector from "./hooks/useAppSelector";
import QueryT from "../types/QueryT";
import useAppDispatch from "./hooks/useAppDispatch";
import type GeoJson from "geojson";

export default function MyMap() {
    const dispatch = useAppDispatch();
    const [zoom, setZoom] = useState<number>(13);
    const map_center = useAppSelector(state => state.map_center);

    function setMapCenter(center: LatLngTuple) {
        dispatch("MAP_CENTER_SET", center);
    }

    return <Map
        center={map_center}
        zoom={zoom}
        zoomControl={false}
        style={{
            height: "100%",
            width: "100%"
        }}
        onzoomend={event => setZoom(event.target.getZoom())}
        onmoveend={event => {
            const center = event.target.getCenter();
            setMapCenter([center.lat, center.lng]);
        }}
    >
        <ZoomControl position="topright"/>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        <MapResults/>
        <MapCriterions/>

    </Map>
}

function MapCriterions() {
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

function MapResults() {
    const query_state = useAppSelector(state => state.query_state);
    const results = useAppSelector(state => state.results);

    if (query_state != "result" || !results) {
        return <></>;
    }

    return <>
        {results.map((result, index) => {
            return <MapResultAssets key={index} resultIndex={index}/>
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


function MapResultAssets(props: {
    resultIndex: number
}) {
    const dispatch = useAppDispatch();
    const result = useAppSelector(state => state.results?.[props.resultIndex]);
    const expanded = useAppSelector(state => state.result_expanded_index) === props.resultIndex;

    if (!result) {
        return <></>
    }

    function expandMe() {
        dispatch("RESULT_EXPANDED_INDEX_SET", props.resultIndex);
    }

    let main: JSX.Element = <></>;

    switch (result.way.type) {
        case "Point": {
            const point = result.way as GeoJson.Point;
            const [longitude, latitude] = point.coordinates;

            main = <Marker
                ref={ref => {
                    // zamykanie popupa w zależności od stanu
                    if (ref) {
                        if (expanded) ref.leafletElement.openPopup();
                        else ref.leafletElement.closePopup();
                    }
                }}
                position={[latitude, longitude] as LatLngTuple}
                onclick={expandMe}
            >
                <Popup autoPan={false}>{result.name ?? "null"}</Popup>
            </Marker>;
            break;
        }
    }

    return <>
        {main}
    </>
}

