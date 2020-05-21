import * as inquirer from "inquirer";
import {selectObject} from "./select/selectObject";

inquirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"));

(async () => {

    while (true) {
        let obj = await selectObject();
        console.log(obj);
    }

})();
