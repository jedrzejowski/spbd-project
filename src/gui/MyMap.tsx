import React from 'react'
import {Map, Marker, Popup, TileLayer} from "react-leaflet"
import {LatLngTuple} from "leaflet";

const position: LatLngTuple = [51.505, -0.09];

export default function MyMap() {

    return <Map center={position} zoom={13} style={{
        height: "100%",
        width: "100%"
    }} maxNativeZoom={21}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker position={position}>
            <Popup>A pretty CSS3 popup.<br/>Easily customizable.</Popup>
        </Marker>
    </Map>
}