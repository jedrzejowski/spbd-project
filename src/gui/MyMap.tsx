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
    const criterions = useAppSelector(state => state.criterions);
    const results = useAppSelector(state => state.results);
    const query_state = useAppSelector(state => state.query_state);

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
        onViewportChange={event => {
            const {zoom, center} = event;
            if (typeof zoom === "number") setZoom(zoom);
            if (center) setMapCenter(center);
        }}
    >
        <ZoomControl position="topright"/>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        {query_state == "result" && results
            ?.map((result, index) => {
                return <ResultAssets key={index} result={result}/>
            })}

        {query_state == "picker" && Object.keys(criterions)
            .map((criterion_id, index) => {
                return <MapCriterionAssets key={criterion_id} index={index} criterion_id={criterion_id}/>
            })}

    </Map>
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
                <Popup>A pretty CSS3 popup.<br/>Easily customizable.</Popup>
            </Marker>
        </>
    }
    return <></>;
}

function ResultAssets(props: {
    result: QueryT.Result
}) {
    const {result} = props;

    switch (result.geo_json.type) {
        case "Point": {
            const point = result.geo_json as GeoJson.Point;
            const [longitude, latitude] = point.coordinates;

            return <>
                <Marker position={[latitude, longitude] as LatLngTuple}>
                    <Popup>{result.name}</Popup>
                </Marker>
            </>
        }

        default:
            return <></>
    }
}

