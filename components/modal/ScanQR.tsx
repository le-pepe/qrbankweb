import {useEffect, useState} from "react";
import {centerText, Scanner, useDevices} from "@yudiel/react-qr-scanner";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Account} from "@/app/(protected)/home/page";
import {createExternalAccount} from "@/lib/actions";
import {toast} from "sonner";

interface ScanQRProps {
    isOpen: boolean;
    setOpenAction: (state: boolean) => void;
    onSaveAction: () => void;

}

export default function ScanQR({isOpen, setOpenAction, onSaveAction}: ScanQRProps) {
    const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
    const [pause, setPause] = useState(isOpen);

    const devices = useDevices()

    function parseAccountFromString(accountString: string): Account {
        const lines = accountString.split('\n');
        const accountData: Partial<Account> = {};

        for (const line of lines) {
            const [key, ...valueParts] = line.split(': ');
            const value = valueParts.join(': ').trim();

            switch (key.trim()) {
                case 'Nombre':
                    accountData.name = value;
                    break;
                case 'Rut':
                    accountData.rut = value;
                    break;
                case 'Email':
                    accountData.email = value === '' ? null : value;
                    break;
                case 'Banco':
                    accountData.bank = value;
                    break;
                case 'Tipo de cuenta':
                    if (value === 'vista' || value === 'corriente' || value === 'ahorro') {
                        accountData.accountType = value;
                    } else {
                        accountData.accountType = null;
                    }
                    break;
                case 'Número de cuenta':
                    accountData.accountNumber = value;
                    break;
                case 'Alias':
                    accountData.alias = value === '' ? null : value;
                    break;
            }
        }

        // Valores por defecto para los campos obligatorios que podrían faltar
        const defaultAccount: any = {
            name: '',
            rut: '',
            bank: '',
            email: null,
            alias: null,
            accountType: null,
            accountNumber: '',
            isMine: false,
        };

        return {...defaultAccount, ...accountData};
    }

    const handleScan = async (data: string) => {
        const account = parseAccountFromString(data);
        createExternalAccount(account)
            .then(() => {
                onSaveAction()
                toast.success("Cuenta importada correctamente")
            })
            .catch(() => {
                toast.error("Error al importar la cuenta");
            })
            .finally(() => {
                setOpenAction(false);
            });
    }

    const handleModalState = (state: boolean) => {
        setOpenAction(state);
    }
    useEffect(() => {
        if (devices.length > 0) {
            setDeviceId(devices[0].deviceId)
        }
    }, [devices])

    return (
        <Dialog open={isOpen} onOpenChange={handleModalState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>QR Scanner</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center flex-col gap-2">
                    <Select onValueChange={(v) => setDeviceId(v)}>
                        <SelectTrigger className="w-full">
                            <SelectValue
                                placeholder={deviceId ? devices.find(d => d.deviceId === deviceId)?.label : "Select a device"}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {devices.map((device) => (
                                    <SelectItem value={device.deviceId}
                                                key={device.deviceId}>{device.label}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Scanner
                        styles={{container: {height: 'auto', width: '100%'}}}
                        formats={[
                            "qr_code",
                            "micro_qr_code",
                            "rm_qr_code",
                        ]}
                        constraints={{
                            deviceId: deviceId,
                        }}
                        onScan={async (detectedCodes) => {
                            await handleScan(detectedCodes[0].rawValue);
                        }}
                        onError={(error) => {
                            toast.error("Ocurrió un error con el lector")
                        }}
                        components={{
                            onOff: true,
                            torch: true,
                            zoom: true,
                            finder: true,
                            tracker: centerText,
                        }}
                        allowMultiple={true}
                        scanDelay={2000}
                    />
                </div>
                <DialogFooter>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
