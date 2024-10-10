import { useNavigate } from "react-router"
const useNav = () => {
  const navigate = useNavigate(); 
  const nextPath = (id: string, path: string) => navigate(`/spotify-web/${path}/${id}`);
  return nextPath;
}

export default useNav
