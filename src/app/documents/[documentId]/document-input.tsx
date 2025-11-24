"use client";

import { useDebounce } from "@/hooks/use-debouce";
import { useSyncStatus } from "@liveblocks/react/suspense";
import { useMutation } from "convex/react";
import { LoaderIcon } from "lucide-react";
import { useRef, useState } from "react";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { toast } from "sonner";
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
  const [isError, setIsError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const updateDocument = useMutation(api.documents.updateById);

  const status = useSyncStatus({ smooth: true });
  const isLiveblocksSyncing = status !== "synchronized";
  const showLoader = isPending || isLiveblocksSyncing;
  const showError = !isPending && !isLiveblocksSyncing && isError;

  const debouncedUpdate = useDebounce((newValue: string) => {
    if (newValue === title) return;
    setIsPending(true);
    setIsError(false);

    updateDocument({ id, title: newValue })
      .then(() => {
        toast.success("Document updated");
        setIsError(false);
      })
      .catch(() => {
        toast.error("Something went wrong");
        setIsError(true);
      })
      .finally(() => {
        setIsPending(false);
      });
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  const onBlur = () => {
    setIsEditing(false);
  };

  const handleSumit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setIsError(false);
    updateDocument({ id, title: value })
      .then(() => {
        toast.success("Document updated");
        setIsError(false);
      })
      .catch(() => {
        toast.error("Something went wrong");
        setIsError(true);
      })
      .finally(() => {
        setIsPending(false);
        setIsEditing(false);
      });
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing && canEdit ? (
        <form onSubmit={handleSumit} className="relative w-fit max-w-[50ch]">
          <span className="invisible whitespace-pre px-1.5 text-lg">{value || " "}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
          />
        </form>
      ) : (
        <span
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
        >
          {value}
        </span>
      )}
      {showError && <BsCloudSlash className="size-4" />}
      {!showError && !showLoader && <BsCloudCheck className="size-4" />}
      {showLoader && <LoaderIcon className="size-4 animate-spin text-muted-foreground" />}
    </div>
  );
};
