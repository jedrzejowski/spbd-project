import React, {useEffect, useState} from "react";
import QueryT from "../../types/QueryT";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import useQueryDatabase from "../useQueryDatabase";
import FormControl from "@material-ui/core/FormControl";

export default function SearchOsmRow(props: {
    type: QueryT.KnownObjectTypes | null,
    onChange?: (osm_ref: QueryT.OsmRowReference | null) => void
}) {
    const queryDatabase = useQueryDatabase();

    const [options, setOptions] = useState<QueryT.OsmRowReference[]>([]);

    useEffect(() => {
        setOptions([]);
    }, [props.type]);

    function handleChange(osm_ref: QueryT.OsmRowReference | null) {

    }

    return <FormControl
        variant="outlined"
        margin="dense"
        style={{
            width: "100%"
        }}
    >
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name}
            onChange={(event: object, option: QueryT.OsmRowReference | null) => handleChange(option)}
            renderInput={(params) => {
                return <TextField {...params} label="Typ punktu" variant="outlined"/>
            }}
        />
    </FormControl>
}