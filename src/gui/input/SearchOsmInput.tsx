import React, {useEffect, useState} from "react";
import QueryT from "../../types/QueryT";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import useQueryDatabase from "../useQueryDatabase";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";


const display_when: any[] = [
    "hotel"
];

export default function SearchOsmInput(props: {
    type: QueryT.KnownObjectTypes | null,
    onChange?: (osm_ref: QueryT.OsmReference) => void
}) {
    const queryDatabase = useQueryDatabase();

    const [options, setOptions] = useState<QueryT.OsmReference[]>([]);

    useEffect(() => {
        setOptions([]);
    }, [props.type]);

    function handleChange(osm_ref: QueryT.OsmReference | null) {

    }

    return <FormControl
        variant="outlined"
        margin="dense"
        style={{
            display: display_when.includes(props.type) ? undefined : "none"
        }}
    >
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name}
            onChange={(event: object, option: QueryT.OsmReference | null) => handleChange(option)}
            renderInput={(params) => {
                return <TextField {...params} label="Typ punktu" variant="outlined"/>
            }}
        />
    </FormControl>
}