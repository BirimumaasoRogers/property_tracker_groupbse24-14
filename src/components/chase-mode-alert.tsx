import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChaseModeAlertProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ChaseModeAlert({ open, onConfirm, onCancel }: ChaseModeAlertProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-full sm:w-[50%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Geofence Alert</AlertDialogTitle>
          <AlertDialogDescription>
            The item has left the geofence. Is it you who left the area?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Yes, it's me</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive hover:bg-red-600" onClick={onConfirm}>No, activate Chase Mode</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
