import React, {useState} from 'react'
import {Map, Marker, Popup, TileLayer} from "react-leaflet"
import {LatLngTuple} from "leaflet";

const positionStart: LatLngTuple = [51.505, 22.09];


export default function MyMap(props: {
    onChangeCenter?: (center: LatLngTuple) => void
}) {
    const [center, setCenter] = useState<LatLngTuple>(positionStart);
    function handleChange(center :LatLngTuple){
        setCenter(center);
        //props.onChangeCenter?.(center);
        if (props.onChangeCenter){
            props.onChangeCenter(center);
        }
    }
    return <Map center={positionStart} zoom={13} style={{
        height: "100%",
        width: "100%"
    }} onViewportChange={event => {
        const center = event.center;
        if (center)
            handleChange(center)
    }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker position={center}>
            <Popup>A pretty CSS3 popup.<br/>Easily customizable.</Popup>
        </Marker>
    </Map>
}