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
    type: "lng_lat"
}, {
    label: "Apteka",
    type: "pharmacy"
}, {
    label: "Bank",
    type: "bank"
}, {
    label: "Bankomat",
    type: "atm"
}, {
    label: "Biblioteka",
    type: "library"
}, {
    label: "Drzewo",
    type: "tree"
}, {
    label: "Hostel",
    type: "hostel"
}, {
    label: "Hotel",
    type: "hotel"
}, {
    label: "Ławka",
    type: "bench"
}, {
    label: "Motel",
    type: "motel"
}, {
    label: "Muzeum",
    type: "museum"
}, {
    label: "Piekarnia",
    type: "bakery"
}, {
    label: "Poczta",
    type: "post_office"
}, {
    label: "Restauracja fast food",
    type: "fast_food"
}, {
    label: "Sklep z alkoholem",
    type: "alcohol"
}, {
    label: "Supermarket",
    type: "supermarket"
}, {
    label: "ZOO",
    type: "zoo"
}];

const options_without_lnglat = options.filter(option => option.type !== "lng_lat")

export default function KnownObjectTypeInput(props: {
    value?: QueryT.KnownObjectTypes | null
    onChange?: (type: QueryT.KnownObjectTypes | null) => void,
    showLngLat?: boolean
}) {
    const showLngLat = props.showLngLat ?? true;
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
        options={showLngLat ? options : options_without_lnglat}
        getOptionLabel={(option) => option.label}
        onChange={(event: object, option: OptionDef | null) => handleChange(option)}
        renderInput={(params) => {
            return <TextField {...params} label="Typ punktu" variant="outlined"/>
        }}
    />
}
