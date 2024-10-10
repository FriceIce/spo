import { convertMilliseconds } from "../modules/convertMS";

const ConvertToMilisec = ({ value }: { value: number }) => {
  return (
    <div className="text-spotify_gray text-sm hidden md:block">
      {convertMilliseconds(value)}
    </div>
  );
};

export default ConvertToMilisec;
