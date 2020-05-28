export function createSelect(args: {
    select: string[]
    from: string[]
    where: string
    orderBy?: string
    limit?: string
}) {
    let select = args.select.join(', \n');
    if (select === '') select = '*';

    let from = args.from.join(', \n');

    return `select ${select} from ${from} where ${args.where}`
}

export function brackets(expr: string): string {
    return '(' + expr + ')';
}

export function and(expr: string[]): string {
    return expr.map(brackets).join(' and ')
}

export function or(expr: string[]): string {
    return expr.map(brackets).join(' or ')
}

export function planetPoint(lng: number, lat: number): string {
    return `'SRID=4326;POINT(${lng} ${lat})'::geometry`;
}

export function planetDistance(p1: string, p2: string,
                               planet = `'SPHEROID["WGS 84",6378137,298.257223563]'`): string {
    return `ST_DistanceSpheroid(${p1}, ${p2}, ${planet})`;
}

let i = 0;

export function genName() {
    return `object${++i}`;
}