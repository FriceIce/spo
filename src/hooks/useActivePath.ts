import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

const useActivePath = (path: null | "search" | "home" | "library") => {
  const active_path = useSelector((state: RootState) => state.user.active_path);
  const dispatch = useDispatch();

  useEffect(() => {
    if (path && active_path !== path) {
      dispatch({ type: "user/setActivePath", payload: path });
    }
  }, [path]);
};

export default useActivePath;
