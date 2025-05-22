import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

type DeleteQrProps = {
    showConfirmDelete: number | null;
    setShowConfirmDelete: (id: number | null) => void;
    handleDeleteAccount: (id: number) => void;
    isDeletingId: number | null;
}

export default function DeleteQr({ showConfirmDelete, setShowConfirmDelete, handleDeleteAccount, isDeletingId}: DeleteQrProps) {
    return (
        <Dialog open={!!showConfirmDelete} onOpenChange={(val) => !val && setShowConfirmDelete(null)}>
            <DialogContent className="max-w-sm rounded-lg">
                <DialogTitle>¿Eliminar cuenta?</DialogTitle>
                <DialogDescription>
                    ¿Estás seguro de que quieres eliminar esta cuenta? Esta acción no se puede deshacer.
                </DialogDescription>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        onClick={() => handleDeleteAccount(showConfirmDelete!)}
                        disabled={isDeletingId !== null}
                    >
                        {isDeletingId !== null
                            ? (<><Loader2 className="animate-spin mr-2" size={16}/> Eliminando...</>)
                            : "Eliminar"}
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isDeletingId !== null}>
                            Cancelar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
