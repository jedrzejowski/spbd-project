import React, {useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import QueryT from "../../types/QueryT";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useClasses = makeStyles(theme => ({
    input_root: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(1),
    },
    spacer: {
        display: "block",
        height: theme.spacing(0.5),
    },
    input: {
        width: "100%"
    }
}), {name: "QueryObject"});

export default function DistanceInput(props: {
    distance?: QueryT.Distance | null
    onChange: (value: QueryT.Distance | null) => void
}) {
    const {distance, onChange} = props;
    const classes = useClasses();

    const [distance_type, setDistanceType] = useState<QueryT.DistanceType | undefined>(distance?.type);
    const [distance_value, setDistanceValue] = useState<number | undefined>(distance?.value);
    const [distance_operator, setDistanceOperator] = useState<QueryT.DistanceOperator | undefined>(distance?.operator);


    function handleChange() {
        if (
            distance_type != undefined &&
            distance_value != undefined &&
            distance_operator != undefined
        ) {
            onChange({
                type: distance_type,
                value: distance_value,
                operator: distance_operator
            });
        }
    }

    return <div>

        <FormControl variant="outlined" margin="dense" className={classes.input}>
            <InputLabel id="distance-type">Typ dystansu</InputLabel>
            <Select
                labelId="value-type"
                label="Typ dystansu"
                value={distance?.type}
                onChange={event => {
                    setDistanceType(event.target.value as QueryT.DistanceType)
                    handleChange();
                }}
            >
                <MenuItem value="straight_line">Linia prosta [m]</MenuItem>
                <MenuItem value="car_distance">Odległość w trasie [m]</MenuItem>
                <MenuItem value="car_time">Czas dojazdu [s]</MenuItem>
            </Select>
        </FormControl>

        <div className={classes.spacer}/>

        <TextField
            className={classes.input}
            label="Wartość odległości"
            type="number"
            variant="outlined"
            margin="dense"
            value={distance?.value}
            onChange={event => {
                let num = parseFloat(event.target.value);
                setDistanceValue(Number.isNaN(num) ? undefined : num);
                handleChange();
            }}
        />

        <div className={classes.spacer}/>

        <FormControl variant="outlined" margin="dense" className={classes.input}>
            <InputLabel id="distance-operatos">Operator</InputLabel>
            <Select
                label="Operator"
                labelId="value-operator"
                value={distance?.operator}
                onChange={event => {
                    setDistanceOperator(event.target.value as QueryT.DistanceOperator)
                    handleChange();
                }}
            >
                <MenuItem value="less_than">Mniej niż</MenuItem>
                <MenuItem value="more_than">Więcej niź</MenuItem>
            </Select>
        </FormControl>
    </div>
}