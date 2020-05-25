import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import QueryT from "../../types/QueryT";
import DestinationObject from "./DestinationObject";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";

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

export default function CriterionObjects(props: {
    onChange?: (criterions: (QueryT.CriterionAny | null)[]) => void
}) {
    const {onChange} = props;
    const classes = useClasses();

    const [criterions, setCriterions_] = useState<(QueryT.CriterionAny | null)[]>([]);

    function setCriterions(distances: (QueryT.CriterionAny | null)[]) {
        setCriterions_(distances);
        onChange?.(distances.filter(distance => distance !== null) as QueryT.CriterionAny[]);
    }

    function handleAddCriterion() {
        setCriterions([
            ...criterions,
            null,
        ]);
    }

    function handleChangeCriterion(index: number, distance: QueryT.CriterionAny | null) {
        setCriterions(
            criterions.map((d, i) => {
                return i === index ? distance : d;
            })
        )
    }

    function handleDeleteCriterion(index: number) {
        setCriterions(
            criterions.filter((d, i) => i !== index)
        )
    }

    return <>
        <div className={classes.criterions_root}>
            {criterions.map((distance, i) => {
                return <Card key={i}>
                    <CardHeader title={`Kryterium #${i + 1}`}/>
                    <CardContent>
                        <DestinationObject onChange={criterion => handleChangeCriterion(i, criterion)}/>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={event => handleDeleteCriterion(i)}>
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