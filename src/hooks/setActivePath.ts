import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useComponentIsMounted from "./useIsMounted";

const setActivePath = (path: null | "search" | "home" | "library") => {
  const active_path = useSelector((state: RootState) => state.user.active_path);
  const dispatch = useDispatch();

  useComponentIsMounted(() => {
    //path will only be null when used in UserLibraryList component and it is the first render.
    if (path === null) return;

    if (active_path !== path) {
      dispatch({ type: "user/setActivePath", payload: path });
    }
  }, []);
};

export default setActivePath;
