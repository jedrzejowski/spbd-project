import React, {useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import QueryT from "../../types/QueryT";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useClasses = makeStyles(theme => ({
    input: {
        width: "100%"
    }
}), {name: "QueryObject"});

export default function DistanceInput(props: {
    defaultDistance?: QueryT.Distance | null
    onChange: (value: QueryT.Distance | null) => void
}) {
    const {onChange} = props;
    const classes = useClasses();

    const [distance_type, setDistanceType] = useState<QueryT.DistanceType | null>(props.defaultDistance?.type ?? null);
    const [distance_value, setDistanceValue] = useState<number | null>(props.defaultDistance?.value ?? null);

    useEffect(() => {
        if (distance_type != null && distance_value != null) {
            onChange({
                type: distance_type,
                value: distance_value,
            });
        } else {
            onChange(null);
        }
    }, [distance_type, distance_value])

    return <div>

        <FormControl variant="outlined" margin="dense" className={classes.input}>
            <InputLabel id="distance-type">Typ dystansu</InputLabel>
            <Select
                labelId="value-type"
                label="Typ dystansu"
                value={distance_type ?? ""}
                onChange={event => {
                    setDistanceType(event.target.value as QueryT.DistanceType)
                }}
            >
                <MenuItem value="straight_line">Linia prosta [m]</MenuItem>
                <MenuItem value="car_distance">Odległość w trasie [m]</MenuItem>
                <MenuItem value="car_time">Czas dojazdu [s]</MenuItem>
            </Select>
        </FormControl>

        <TextField
            className={classes.input}
            label="Wartość dystansu"
            type="number"
            variant="outlined"
            margin="dense"
            value={distance_value ?? ""}
            inputProps={{
                step: distance_value ? Math.round(distance_value * 0.1) : 1
            }}
            onChange={event => {
                let num = parseFloat(event.target.value);
                setDistanceValue(Number.isNaN(num) ? null : num);
            }}
        />
    </div>
}