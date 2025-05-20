import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import React from "react";
import {NewAccountForm} from "@/components/NewAccountForm";

interface AddOwnAccountProps {
    open: boolean;
    onCloseAction: (state: boolean) => void;
    onSaveAction: (state: boolean) => void;
}

export default function AddOwnAccount({ open, onCloseAction, onSaveAction}: AddOwnAccountProps) {
    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-2">Nueva Cuenta</DialogTitle>

                        <NewAccountForm submitAction={() => onSaveAction} />
                </DialogHeader>

            </DialogContent>
        </Dialog>
    )
}
