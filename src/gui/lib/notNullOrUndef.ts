export default function notNullOrUndef<T>(value: T | undefined | null): value is T {
    return value !== null && value !== undefined;
}