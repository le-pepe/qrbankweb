'use client'
import React, {useEffect, useState} from "react";
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

export default function ShowAccountQr({ account, open, onCloseAction }: ShowAccountQrProps) {

    const [canDownload, setCanDownload] = useState(false);

    useEffect(() => {
        const prepareFileAndCheckShareability = async () => {
            const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
            if (!canvas) {
                setCanDownload(false);
                return;
            }

            const dataUrl = canvas.toDataURL("image/png");

            try {
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                const file = new File([blob], "qr.png", { type: "image/png" });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    setCanDownload(true);
                } else {
                    setCanDownload(false);
                }
            } catch (error) {
                console.error("Error al procesar el canvas para compartir:", error);
                setCanDownload(false);
            }
        };

        prepareFileAndCheckShareability().then();
    }, []);
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
        console.log(blob);
        const file = new File([blob], "qr.png", { type: "image/png" });
        console.log(file);
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
                </DialogHeader>
                <div className="flex justify-center">
                    <Canvas
                        text={formattedAccount}
                        options={{ width: 256 }}
                    />
                </div>
                <DialogFooter>
                    {canDownload && <Button variant="ghost" onClick={handleShare}>Compartir</Button>}
                    <Button onClick={handleDownload}>Descargar QR</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
