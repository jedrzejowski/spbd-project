import AppData from "../redux/AppData";
import {useSelector} from "react-redux";

export default function useAppSelector<T>(
    functor: (state: AppData.State) => T
): T {
    return useSelector(functor);
}