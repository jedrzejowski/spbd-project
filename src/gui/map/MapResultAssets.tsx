import useAppDispatch from "../hooks/useAppDispatch";
import useAppSelector from "../hooks/useAppSelector";
import GeoJson from "geojson";
import {Marker, Polyline, Popup, GeoJSON as ReactGeoJSON} from "react-leaflet";
import {LatLngTuple} from "leaflet";
import React from "react";

export default function MapResults() {
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
        {expanded ? result.criterions.map((criterion, index) => {
            return <React.Fragment key={index}>

                {/*{criterion.type === "straight_line" ? criterion.matches.map((match, i) => {*/}
                {/*    return <ReactGeoJSON key={i} data={match.way}/>*/}
                {/*}) : undefined}*/}

                {/*{criterion.type === "car_distance" ? criterion.matches?.map((match, i) => {*/}
                {/*    return <CriterionAstarMatch key={i} match={match} unit="m"/>*/}
                {/*}) : undefined}*/}

                {/*{criterion.type === "car_time" ? criterion.matches?.map((match, i) => {*/}
                {/*    return <CriterionAstarMatch key={i} match={match} unit="s"/>*/}
                {/*}) : undefined}*/}

            </React.Fragment>
        }) : undefined}
    </>
}