import React, {useState} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import QueryT from "../../types/QueryT";

interface KnowObjectType {
    label: string,
    type: QueryT.KnownObjectTypes
}

const known_object_types: KnowObjectType[] = [{
    label: "Współrzędne",
    type: "lat_long"
}, {
    label: "Hotel",
    type: "hotel"
}, {
    label: "Drzewo",
    type: "tree"
}];

export default function QueryObject() {

    const [known_object_type, setKnownObjectType] = useState<KnowObjectType | null>(null);

    // const [query_point, setQueryPoint] = useState<QueryPoint>({
    //     type
    // });

    return <div>
        <Autocomplete
            options={known_object_types}
            getOptionLabel={(option) => option.label}
            onChange={(event: object, option: KnowObjectType | null) => setKnownObjectType(option)}
            style={{width: 300}}
            renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined"/>}
        />

        <div style={{
            display: known_object_type ? "block" : "none"
        }}>
            <TextField
                label="Szerokość"
                type="number"
                variant="outlined"
            />
            <TextField
                label="Długość"
                type="number"
                variant="outlined"
            />
        </div>
    </div>
}