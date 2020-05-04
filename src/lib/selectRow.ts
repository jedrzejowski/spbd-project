import inquirer, {ChoiceOptions} from "inquirer";
import {queryDatabase} from "../database";
import {PlanetOsmRowReference} from "../types/_planet_osm";

export async function selectRow<T extends PlanetOsmRowReference>(
    msg: string,
    query: string
): Promise<T> {
    let out = await inquirer.prompt([{
        type: "autocomplete",
        name: "from",
        message: msg,
        source: async function (answersSoFar: unknown, input: string) {
            if (!input || input.length < 3) {
                return [];
            }

            let resp = await queryDatabase(query, [input]);

            return resp.rows.map(row => {
                return {
                    name: row.name,
                    value: row
                }
            })
        }
    }]);

    return out.from as T;
}