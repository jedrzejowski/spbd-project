import React, {useState} from "react";
import DistanceInput from "./DistanceInput";
import Typography from "@material-ui/core/Typography";
import {IconButton} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import makeStyles from "@material-ui/core/styles/makeStyles";
import QueryT from "../../types/QueryT";
import DestinationObject from "./DestinationObject";


const useClasses = makeStyles(theme => ({
    title_root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline"
    },
    title: {
        flexGrow: 1
    }
}), {name: "CriterionObjects"});

export default function CriterionObjects(props: {
    distances?: QueryT.PointBase[],
    onChange?: (distances: QueryT.PointBase[]) => void
}) {
    const {onChange} = props;
    const classes = useClasses();

    const [criterions, setCriterions] = useState<(QueryT.PointBase | null)[]>([]);

    function setDistances(distances: (QueryT.PointBase | null)[]) {
        setCriterions(distances);
        onChange?.(distances.filter(distance => distance !== null) as QueryT.PointBase[]);
    }

    function handleAddCriterion() {
        setDistances([
            ...criterions,
            null,
        ]);
    }

    function handleChangeCriterion(index: number, distance: QueryT.PointBase | null) {

        setDistances(
            criterions.map((d, i) => {
                return i === index ? distance : d;
            })
        )
    }

    function handleDeleteCriterion(index: number) {
        setDistances(
            criterions.filter((d, i) => i !== index)
        )
    }

    return <>
        <div className={classes.title_root}>
            <Typography
                className={classes.title}
                variant="h6"
                gutterBottom
            >
                Kryteria
            </Typography>

            <IconButton size="small" onClick={() => handleAddCriterion()}>
                <AddIcon fontSize="small"/>
            </IconButton>
        </div>

        <div>
            {criterions.map((distance, i) => {
                return <div key={i}>

                    <div className={classes.title_root}>

                        <Typography
                            className={classes.title}
                            variant="subtitle2"
                            gutterBottom
                        >#{i}</Typography>

                        <IconButton size="small" onClick={() => handleDeleteCriterion(i)}>
                            <DeleteIcon fontSize="small"/>
                        </IconButton>

                    </div>

                    <DestinationObject/>
                </div>
            })}
        </div>
    </>
}