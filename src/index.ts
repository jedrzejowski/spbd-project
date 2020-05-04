import inquirer from "inquirer";
import {selectObject} from "./select/selectObject";

inquirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"));

selectObject().then(point => console.log(point));
