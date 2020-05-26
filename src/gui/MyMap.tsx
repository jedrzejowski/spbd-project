import React, {useState} from 'react'
import {Circle, Map, Marker, Popup, TileLayer, ZoomControl} from "react-leaflet"
import {LatLngTuple} from "leaflet";
import useAppSelector from "./hooks/useAppSelector";
import QueryT from "../types/QueryT";
import useAppDispatch from "./hooks/useAppDispatch";


export default function MyMap() {
    const dispatch = useAppDispatch();
    const [zoom, setZoom] = useState<number>(13);
    const criterions = useAppSelector(state => state.criterions);
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

        {Object.keys(criterions).map((criterion_id, index) => {

            return <MapCriterionAssets
                key={criterion_id}
                index={index}
                criterion_id={criterion_id}/>
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

    if (criterion.type === "lat_lng") {
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