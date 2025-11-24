import { BsCloudCheck } from "react-icons/bs";
import { Doc } from "../../../../convex/_generated/dataModel";

interface DocumentInputProps {
  title: string;
  id: Doc<"documents">["_id"];
}

export const DocumentInput = ({title, id}: DocumentInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg px-1.5 cursor-pointer truncate">{title}</span>
      <BsCloudCheck />
    </div>
  );
};
