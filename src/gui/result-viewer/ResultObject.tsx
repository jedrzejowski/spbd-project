import React, {useState} from "react";
import clsx from 'clsx';
import CardHeader from "@material-ui/core/CardHeader";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Collapse from '@material-ui/core/Collapse';
import makeStyles from "@material-ui/core/styles/makeStyles";
import type QueryT from "../../types/QueryT";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import {Typography} from "@material-ui/core";

const useClasses = makeStyles(theme => ({
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expand_open: {
        transform: 'rotate(180deg)',
    },
}), {name: "ResultObject"});

export default function ResultObject(props: {
    resultIndex: number
}) {
    const classes = useClasses();
    const dispatch = useAppDispatch();
    const result = useAppSelector(state => state.results?.[props.resultIndex]);
    const expanded = useAppSelector(state => state.result_expanded_index) === props.resultIndex;

    console.log(result);
    if (!result) {
        return <></>
    }

    function expandMe() {
        dispatch("RESULT_EXPANDED_INDEX_SET", expanded ? -1 : props.resultIndex);
    }

    return <div>
        <Card>
            <CardHeader
                title={result.name ?? "null"}
                subheader={`OSM_ID: ${result.osm_id}`}
                action={
                    <IconButton className={clsx(classes.expand, {
                        [classes.expand_open]: expanded,
                    })} onClick={expandMe}>
                        <ExpandMoreIcon/>
                    </IconButton>
                }/>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Kryteria:
                    </Typography>

                    {result.criterions.map(criterion=>{

                    })}
                </CardContent>
            </Collapse>
        </Card>
    </div>
}