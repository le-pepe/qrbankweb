'use client'
import React from "react";
import { useQRCode } from "next-qrcode";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Asegúrate de tener este componente
import { Account } from "@/app/(protected)/home/page";

interface ShowAccountQrProps {
    account: Account | null;
    open: boolean;
    onCloseAction: (state: boolean) => void;
}

export function ShowAccountQr({ account, open, onCloseAction }: ShowAccountQrProps) {
    const { Canvas } = useQRCode();

    if (!account) return null;

    const formattedAccount = [
        `Nombre: ${account.name}`,
        `Rut: ${account.rut}`,
        `Email: ${account.email}`,
        `Banco: ${account.bank}`,
        `Tipo de cuenta: ${account.accountType}`,
        `Número de cuenta: ${account.accountNumber}`,
        `Alias: ${account.alias}`,
    ].join("\n");

    const handleDownload = () => {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `qr-${account.alias || "cuenta"}.png`;
        link.click();
    };
    const handleShare = () => {
        //transform canvas content to blob and use navigator share
        const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const blob = new Blob([url], { type: "image/png" });
        const file = new File([blob], "qr.png", { type: "image/png" });
        const shareData = {
            title: "Comparte este QR",
            text: "Comparte este QR",
            files: [file],
        }
        navigator.share(shareData).then(() => alert("Compartido!")).catch(() => alert("No se pudo compartir!"));
    }

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Comparte este QR</DialogTitle>
                    <DialogDescription className="flex justify-center">
                        <Canvas
                            text={formattedAccount}
                            options={{ width: 256 }}
                        />
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={handleShare}>Compartir</Button>
                    <Button onClick={handleDownload}>Descargar QR</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
