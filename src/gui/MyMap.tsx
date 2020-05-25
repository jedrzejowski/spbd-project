import React from 'react'
import {Circle, Map, Marker, Popup, TileLayer, ZoomControl} from "react-leaflet"
import {LatLngTuple} from "leaflet";
import useAppSelector from "./hooks/useAppSelector";
import QueryT from "../types/QueryT";
import useAppDispatch from "./hooks/useAppDispatch";


export default function MyMap() {
    const dispatch = useAppDispatch();
    const criterions = useAppSelector(state => state.criterions);
    const map_center = useAppSelector(state => state.map_center);

    function setMapCenter(center: LatLngTuple) {
        dispatch("MAP_CENTER_SET", center);
    }

    return <Map
        center={map_center}
        zoom={13}
        zoomControl={false}
        style={{
            height: "100%",
            width: "100%"
        }}
        onViewportChange={event => {
            const center = event.center;
            if (center) setMapCenter(center);
        }}
    >
        <ZoomControl position="topright"/>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        {Object.keys(criterions).map(criterion_id => {
            const criterion = criterions[criterion_id];

            if (criterion === null)
                return [];

            return mapCriterion(criterion_id, criterion);
        }).flat()}

    </Map>
}

function mapCriterion(criterion_id: string, criterion: QueryT.CriterionAny) {

    if (criterion.type === "lat_lng") {
        const typed_criterion = criterion as QueryT.CriterionLatLng;
        const position = [typed_criterion.lat, typed_criterion.lng] as LatLngTuple;

        return [
            <Circle center={position} radius={typed_criterion.distance.value}/>,
            <Marker
                position={position}
                key={`marker_${criterion_id}`}
            >
                <Popup>A pretty CSS3 popup.<br/>Easily customizable.</Popup>
            </Marker>
        ];
    }

    return undefined;
}