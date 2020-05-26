import React from "react";
import type QueryT from "../../types/QueryT";

export default function ResultObject(props: {
    result: QueryT.Result
}) {

    return <div>
        {JSON.stringify(props.result)}
    </div>
}