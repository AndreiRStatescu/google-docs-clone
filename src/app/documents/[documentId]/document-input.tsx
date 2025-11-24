"use client";

import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

interface DocumentInputProps {
  title: string;
  id: Doc<"documents">["_id"];
  canEdit: boolean;
}

export const DocumentInput = ({ title, id, canEdit }: DocumentInputProps) => {
  const [value, setValue] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const updateDocument = useMutation(api.documents.updateById);

  const handleSubmit = async (newTitle: string) => {
    const trimmedTitle = newTitle.trim();
    if (trimmedTitle === title || !trimmedTitle) return;

    setIsPending(true);
    try {
      await updateDocument({ id, title: trimmedTitle });
    } catch (error) {
      console.error("Failed to update document title:", error);
      setValue(title); // Revert on error
    } finally {
      setIsPending(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim()) {
      handleSubmit(value);
    } else {
      setValue(title); // Revert if empty
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setValue(title);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing && canEdit ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-lg px-1.5 truncate bg-transparent border-none outline-none focus:ring-0"
          autoFocus
        />
      ) : (
        <span
          className={`text-lg px-1.5 truncate ${canEdit ? "cursor-pointer" : "cursor-default"}`}
          onClick={() => canEdit && setIsEditing(true)}
        >
          {title}
        </span>
      )}
      {isPending ? <BsCloudSlash className="animate-pulse" /> : <BsCloudCheck />}
    </div>
  );
};
