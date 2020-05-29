import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import QueryT from "../../types/QueryT";
import CriterionInput from "./CriterionInput";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import Dictionary from "../../types/Dictionary";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";

const useClasses = makeStyles(theme => ({
    title_root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline"
    },
    title: {
        flexGrow: 1
    },
    criterions_root: {
        "&> * + *": {
            marginTop: theme.spacing(2)
        }
    },
    footer_root: {
        marginTop: theme.spacing(3),
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    }
}), {name: "CriterionObjects"});


let dynamic_id = 0;

export default function CriterionObjects() {
    const classes = useClasses();
    const dispatch = useAppDispatch();
    const criterions = useAppSelector(state => state.criterions);

    function handleAddCriterion() {
        dispatch("CRITERION_SET", {criterion_id: (++dynamic_id) + "", criterion: null});
    }

    function handleDeleteCriterion(criterion_id: string) {
        dispatch("CRITERION_DELETE", {criterion_id});
    }

    return <>
        <div className={classes.criterions_root}>
            {Object.keys(criterions).map((criterion_id, index) => {

                return <Card key={criterion_id}>
                    <CardHeader title={`Kryterium #${index + 1}`}/>
                    <CardContent>
                        <CriterionInput id={criterion_id}/>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={event => handleDeleteCriterion(criterion_id)}>
                            Usuń kryterium
                        </Button>
                    </CardActions>
                </Card>
            })}
        </div>

        <div className={classes.footer_root} onClick={handleAddCriterion}>
            <Button variant="contained" color="secondary">
                Dodaj kryterium
            </Button>
        </div>
    </>
}