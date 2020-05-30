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
import geometryToString from "../lib/geometryToString";

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
                    {result.criterions.map((criterion, index) => {
                        return <React.Fragment key={index}>
                            <Typography variant="subtitle2" gutterBottom>
                                Kryterium #{index + 1}
                            </Typography>

                            {criterion.type === "straight_line" ? criterion.matches.map((match, i) => {
                                return <CriterionLineMatch key={i} match={match}/>
                            }) : undefined}

                            {criterion.type === "car_distance" ? criterion.matches?.map((match, i) => {
                                return <CriterionAstarMatch key={i} match={match} unit="m"/>
                            }) : undefined}

                            {criterion.type === "car_time" ? criterion.matches?.map((match, i) => {
                                return <CriterionAstarMatch key={i} match={match} unit="s"/>
                            }) : undefined}

                        </React.Fragment>
                    })}
                </CardContent>
            </Collapse>
        </Card>
    </div>
}

function CriterionLineMatch(props: {
    match: QueryT.CriterionLineMatch
}) {
    const {match} = props;
    let text = [`w odległości ${match.distance.toFixed(2)} [m] od`];

    if (match.name) {
        text.push(match.name)
    }

    if (match.osm_id) {
        text.push(`[OSM_ID ${match.osm_id}]`);
    }

    text.push(geometryToString(match.way));

    return <Typography variant="body2" paragraph>
        {text.join(' ')}.
    </Typography>
}

function CriterionAstarMatch(props: {
    match: QueryT.CriterionAstarMatch
    unit: "s" | "m"
}) {
    const {match} = props;
    let text = [`W odległości ${match.sum.toFixed(2)} [${props.unit}] od`];

    if (match.name) {
        text.push(match.name)
    }

    if (match.osm_id) {
        text.push(`[OSM_ID ${match.osm_id}]`);
    }

    return <Typography variant="body2" paragraph>
        {text.join(' ')}.
    </Typography>
}
