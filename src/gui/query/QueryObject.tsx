import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import QueryT from "../../types/QueryT";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import KnownObjectTypeInput from "../input/KnownObjectTypeInput";
import DistancesInput from "./DistancesInput";
import SearchOsmInput from "../input/SearchOsmInput";


const useClasses = makeStyles(theme => ({
    input_root: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(1),
        "& > * + *": {
            marginTop: theme.spacing(1),
            width: "100%"
        }
    }
}), {name: "QueryObject"});

export default function QueryObject() {
    const classes = useClasses();

    const [object_type, setObjectType] = useState<QueryT.KnownObjectTypes | null>(null);

    // const [query_point, setQueryPoint] = useState<QueryPoint>({
    //     type
    // });

    return <div>
        <Paper elevation={3}>
            <div className={classes.input_root}>

                <Typography variant="h6" gutterBottom>
                    Punkt
                </Typography>

                <KnownObjectTypeInput
                    onChange={type => setObjectType(type)}
                />


                <SearchOsmInput
                    type={object_type}
                    onChange={osm_ref => {}}
                />

                <TextField
                    label="Szerokość"
                    type="number"
                    variant="outlined"
                    style={{
                        display: object_type == "lat_long" ? undefined : "none"
                    }}
                />
                <TextField
                    label="Długość"
                    type="number"
                    variant="outlined"
                    style={{
                        display: object_type == "lat_long" ? undefined : "none"
                    }}
                />

                <DistancesInput/>

            </div>
        </Paper>
    </div>
}