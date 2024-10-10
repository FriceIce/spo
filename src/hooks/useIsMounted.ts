import { useEffect, useRef } from 'react'

const useComponentIsMounted = ( fn: () => void, deps:any[] = [] ) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if(isMounted.current === false) {
      isMounted.current = true;
      return
    } 

    fn(); 

  }, deps)
  
  
}

export default useComponentIsMounted
