import React from "react";
import useAppSelector from "../hooks/useAppSelector";
import ResultObject from "./ResultObject";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import useAppDispatch from "../hooks/useAppDispatch";

export default function ResultViewer() {
    const dispatch = useAppDispatch();
    const results = useAppSelector(state => state.results);

    if (results === null) {
        return <></>
    }

    function backToQueryPicker() {
        dispatch("RESULTS_SET", null);
        dispatch("QUERY_STATE_SET", "picker");
    }

    const title = `Wyniki: ${results.length > 0 ? results.length : "brak wyników :("}`

    return <div>
        <Card>
            <CardHeader title={title}/>
            <CardActions>
                <Button onClick={backToQueryPicker}>
                    Wróć
                </Button>
            </CardActions>
        </Card>

        {results.map((result, i) => {
            return <ResultObject key={i} result={result}/>
        })}

    </div>
}