import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

const GoBackArrow = () => {
  const navigate = useNavigate();

  return (
    <button
      className="absolute top-2 left-2 z-[1000] bg-[#00000062] rounded-full size-10 grid place-items-center cursor-pointer"
      onClick={() => navigate(-1)}
    >
      <ArrowLeftIcon className="size-6" />
    </button>
  );
};

export default GoBackArrow;
