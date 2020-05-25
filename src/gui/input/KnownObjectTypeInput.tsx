import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, {useState} from "react";
import QueryT from "../../types/QueryT";

interface OptionDef {
    label: string,
    type: QueryT.KnownObjectTypes
}

const options: OptionDef[] = [{
    label: "Współrzędne",
    type: "lat_lng"
}, {
    label: "Hotel",
    type: "hotel"
}, {
    label: "Drzewo",
    type: "tree"
}];


export default function KnownObjectTypeInput(props: {
    value?: QueryT.KnownObjectTypes | null
    onChange?: (type: QueryT.KnownObjectTypes | null) => void
}) {

    const default_value = options.find(option => option.type === props.value);
    const [option, setOption] = useState<OptionDef | null>(default_value ?? null);


    function handleChange(option: OptionDef | null) {
        setOption(option)

        if (props.onChange) {
            props.onChange(option?.type ?? null);
        }
    }

    return <Autocomplete
        defaultValue={default_value ?? undefined}
        options={options}
        getOptionLabel={(option) => option.label}
        onChange={(event: object, option: OptionDef | null) => handleChange(option)}
        renderInput={(params) => {
            return <TextField {...params} label="Typ punktu" variant="outlined"/>
        }}
    />
}
