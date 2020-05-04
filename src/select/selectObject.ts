import {PlanetOsmRow, PlanetOsmRowReference} from "../types/_planet_osm";
import inquirer from "inquirer";
import {BusStopDisplay, selectBusStop} from "../types/BusStop";
import {selectWaterObject, WaterPolygonDisplay} from "../types/Water";

type SelectObjectType = {
    name: string,
    select: () => Promise<PlanetOsmRowReference>
}

const select_object_types: {
    [key: string]: SelectObjectType
} = {
    "bus_stop": {
        name: BusStopDisplay,
        select: selectBusStop
    },
    "water_object": {
        name: WaterPolygonDisplay,
        select: selectWaterObject
    }
}

export async function selectObject(msg?: string): Promise<PlanetOsmRowReference> {


    let out = await inquirer.prompt([{
        type: "list",
        name: "type",
        message: msg ?? "Wybierz typ punktu",
        choices: Object.keys(select_object_types).map(key => {
            const select_point_type = select_object_types[key];
            return {
                name: select_object_types[key].name,
                value: select_point_type
            }
        })
    }]);

    let sot = out.type as SelectObjectType;

    return await sot.select();
}