import React, {useState} from "react";
import DistanceInput from "./DistanceInput";
import Typography from "@material-ui/core/Typography";
import {IconButton} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import makeStyles from "@material-ui/core/styles/makeStyles";
import QueryT from "../../types/QueryT";


const useClasses = makeStyles(theme => ({
    title_root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline"
    },
    title: {
        flexGrow: 1
    }
}), {name: "DistancesInput"});

export default function DistancesInput(props: {
    distances?: QueryT.Distance[],
    onChange?: (distances: QueryT.Distance[]) => void
}) {
    const {onChange} = props;
    const classes = useClasses();

    const [distances, setDistances_] = useState<(QueryT.Distance | null)[]>([]);

    function setDistances(distances: (QueryT.Distance | null)[]) {
        setDistances_(distances);
        onChange?.(distances.filter(distance => distance !== null) as QueryT.Distance[]);
    }

    function handleAddDistance() {
        setDistances([
            ...distances,
            null,
        ]);
    }

    function handleChangeDistance(index: number, distance: QueryT.Distance | null) {

        setDistances(
            distances.map((d, i) => {
                return i === index ? distance : d;
            })
        )
    }

    function handleDeleteDistance(index: number) {
        setDistances(
            distances.filter((d, i) => i !== index)
        )
    }

    return <>
        <div className={classes.title_root}>
            <Typography
                className={classes.title}
                variant="subtitle1"
                gutterBottom
            >
                Dystanse
            </Typography>

            <IconButton size="small" onClick={() => handleAddDistance()}>
                <AddIcon fontSize="small"/>
            </IconButton>
        </div>

        <div>
            {distances.map((distance, i) => {
                return <div key={i}>

                    <div className={classes.title_root}>

                        <Typography
                            className={classes.title}
                            variant="subtitle2"
                            gutterBottom
                        >#{i}</Typography>

                        <IconButton size="small" onClick={() => handleDeleteDistance(i)}>
                            <DeleteIcon fontSize="small"/>
                        </IconButton>

                    </div>

                    <DistanceInput
                        distance={distance}
                        onChange={value => {
                            handleChangeDistance(i, distance);
                        }}
                    />
                </div>
            })}
        </div>
    </>
}