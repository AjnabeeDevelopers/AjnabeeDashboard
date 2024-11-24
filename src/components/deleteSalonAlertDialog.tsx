import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteSalonData } from "@/utils/firebaseAuth";

type DeleteSalonAlertDialogType = {
  salonID: string;
  salonName: string;
};

export function DeleteSalonAlertDialog({
  salonID,
  salonName,
}: DeleteSalonAlertDialogType) {
  const [isLoading, setIsLoading] = useState(false);
  const {toast}=useToast()

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteSalonData(salonID);
      console.log(result.success)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          variant: "default", // Replace with appropriate variant
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive", // Replace with appropriate variant
        });
      }
    } catch (error: any) {
      toast({
        title: "Unexpected Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            salon and remove salon data from our servers with name {salonName}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
        <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-red-600 hover:bg-red-800"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
