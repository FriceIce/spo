import { useEffect, useRef } from "react";

const useComponentIsMounted = (
  fn: () => void,
  deps: React.DependencyList = []
) => {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return; // Ensures the initial render does not trigger fn
    }

    // Call the function
    fn();

    // Optional cleanup function if needed
    return () => {
      hasMounted.current = false;
    };
  }, deps);
};

export default useComponentIsMounted;
