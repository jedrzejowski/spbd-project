import type QueryT from "../types/QueryT";


function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function spbd_algorithm(args: {
    criterions: QueryT.CriterionAny[]
}): Promise<QueryT.Result[]> {
    await wait(1000);
    return [];
}