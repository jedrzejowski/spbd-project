import React, {useState} from "react";
import QueryT from "../../types/QueryT";
import makeStyles from "@material-ui/core/styles/makeStyles";
import KnownObjectTypeInput from "./KnownObjectTypeInput";
import useAppDispatch from "../hooks/useAppDispatch";

const useClasses = makeStyles(theme => ({
    input_root: {
        display: "flex",
        flexDirection: "column",
    }
}), {name: "DestinationInput"});

export default function DestinationInput() {
    const classes = useClasses();
    const dispatch = useAppDispatch();
    const [object_type, setObjectType] = useState<QueryT.KnownObjectTypes | null>(null);


    function handleObjectTypeChange(object_type: QueryT.KnownObjectTypes | null) {
        setObjectType(object_type);

        if (object_type === null || object_type === "lng_lat") {
            dispatch("DESTINATION_SET", null);
        } else {
            dispatch("DESTINATION_SET", {
                type: object_type
            })
        }
    }

    return <div>
        <div className={classes.input_root}>

            <KnownObjectTypeInput
                value={object_type}
                onChange={type => handleObjectTypeChange(type)}
                showLngLat={false}
            />

        </div>
    </div>
}