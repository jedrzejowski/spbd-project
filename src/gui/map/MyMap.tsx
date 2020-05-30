import React, {useState} from 'react'
import {Map, TileLayer, ZoomControl} from "react-leaflet"
import {LatLngTuple} from "leaflet";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import MapResults from "./MapResultAssets";
import MapCriterions from "./MapCriterions";

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


