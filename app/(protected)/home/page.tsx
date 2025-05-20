"use client";

import {useEffect, useState} from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Eye,    // Para el botón de modal en la tarjeta
    ArrowDownToLine, // Para el botón de importar en la tarjeta
    FilePlus2,       // Para el FAB de "Nuevo Dato Propio"
    UploadCloud,     // Para el FAB de "Importar Externo"
    // Edit3,        // Opcional, si quieres más acciones en tarjeta
    // Trash2        // Opcional, si quieres más acciones en tarjeta
} from "lucide-react";
import {ModeToggle} from "@/components/ModeToggle";
import {deleteOwnAccountById, getExternalAccounts, getOwnAccounts} from "@/lib/actions";
import {ShowAccountQr} from "@/components/modal/ShowAccountQr";
import AddOwnAccount from "@/components/modal/AddOwnAccount";
import {SignedIn, SignedOut, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";
import {SwipeTabsWrapper} from "@/app/(protected)/home/SwipeTabsWrapper";


export interface Account {
    id: number;
    name: string;
    rut: string;
    bank: string;
    email: string | null;
    alias: string | null;
    accountType: "vista" | "corriente" | "ahorro" | null;
    accountNumber: string;
    isMine: boolean;
    userId: string;
    created_at: Date;
}


export default function HomePage() {
    const [activeTab, setActiveTab] = useState<string>("myAccounts");
    const [myAccounts, setMyAccounts] = useState<Account[]>([]);
    const [externalAccounts, setExternalAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [showAddAccountModal, setShowAddAccountModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([getOwnAccounts(), getExternalAccounts()]).then(
            ([own, external]) => {
                setMyAccounts(own);
                setExternalAccounts(external);
            }
        ).finally(() => setIsLoading(false));
    }, []);

    function handleDeleteAccount(id: number) {
        deleteOwnAccountById(id)
            .then(() => {
                getOwnAccounts().then(setMyAccounts)
            })
            .catch(err => {
                console.error(err)
            })
    }

    // Componente para el Botón de Acción Flotante (FAB)
    const FabButton = () => {
        if (activeTab === "myAccounts") {
            return (
                <Button
                    onClick={() => setShowAddAccountModal(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50 flex items-center justify-center p-0 bg-primary text-primary-content"
                    aria-label="Agregar nuevo dato propio"
                    title="Agregar nuevo dato propio"
                >
                    <FilePlus2 size={28} />
                </Button>
            );
        }
        if (activeTab === "externalAccounts") {
            return (
                <Button
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50 flex items-center justify-center p-0 bg-accent text-accent-content"
                    aria-label="Importar nuevo dato externo"
                    title="Importar nuevo dato externo"
                >
                    <UploadCloud size={28} />
                </Button>
            );
        }
        return null; // No mostrar FAB si no hay pestaña activa o es una no reconocida
    };
    const AccountCardSkeleton = () => (
        <Card className="w-full animate-pulse dark:bg-gray-800">
            <CardHeader>
                <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-600 rounded" />
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-600 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-600 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-600 rounded" />
            </CardContent>
            <CardFooter className="flex gap-2 justify-end pt-4">
                <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
            </CardFooter>
        </Card>
    );

    return (
        <>
            <header className="flex items-center justify-end m-2">
                <div className="flex gap-4 items-center">
                    <ModeToggle />
                    <SignedOut>
                        <SignInButton />
                        <SignUpButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton showName={true} />
                    </SignedIn>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 md:p-8 max-w-3xl"> {/* max-w-3xl para mejor lectura en desktop, en móvil será full width */}
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                    Gestión de Datos
                </h1>
                <SwipeTabsWrapper
                    onSwipeLeft={() => setActiveTab((prev) => (prev === "myAccounts" ? "externalAccounts" : prev))}
                    onSwipeRight={() => setActiveTab((prev) => (prev === "externalAccounts" ? "myAccounts" : prev))}
                >
                    <Tabs defaultValue="myAccounts" onValueChange={setActiveTab} className="w-full">
                        {/* Hacemos la lista de pestañas "sticky" para que se mantenga visible al hacer scroll */}
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="myAccounts" className="cursor-pointer">Mis Cuentas</TabsTrigger>
                            <TabsTrigger value="externalAccounts" className="cursor-pointer">Otras Cuentas</TabsTrigger>
                        </TabsList>

                        {/* Contenido de la Pestaña "Mis Datos Propios" */}
                        <TabsContent value="myAccounts">
                            <div className="space-y-4"> {/* Usamos space-y para espaciar las tarjetas verticalmente */}
                                {isLoading
                                    ? Array.from({ length: 1 }).map((_, i) => <AccountCardSkeleton key={i} />)
                                    : myAccounts.length > 0
                                        ? myAccounts.map((account) => (
                                                <Card
                                                    key={account.id}
                                                    className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800"
                                                >
                                                    <CardHeader>
                                                        <CardTitle className="text-lg text-blue-600 dark:text-blue-400">
                                                            {account.name}
                                                        </CardTitle>
                                                        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                                            {account.bank} • {account.accountType}
                                                        </CardDescription>
                                                    </CardHeader>

                                                    <CardContent className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                                        <div>
                                                            <strong>N° Cuenta:</strong> {account.accountNumber}
                                                        </div>
                                                        {account.alias && (
                                                            <div>
                                                                <strong>Alias:</strong> {account.alias}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <strong>RUT:</strong> {account.rut}
                                                        </div>
                                                        {account.email && (
                                                            <div>
                                                                <strong>Email:</strong> {account.email}
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                                            Creado:{" "}
                                                            {new Date(account.created_at).toLocaleDateString("es-CL", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </p>
                                                    </CardContent>

                                                    <CardFooter className="flex justify-end pt-4 gap-2">
                                                        <Button
                                                            onClick={() => handleDeleteAccount(account.id)} // <- dejar vacío por ahora
                                                            variant="destructive"
                                                            size="sm"
                                                        >
                                                            Eliminar
                                                        </Button>
                                                        <Button
                                                            onClick={() => setSelectedAccount(account)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                                        >
                                                            <Eye className="size-4 mr-2" />
                                                            Ver QR
                                                        </Button>

                                                    </CardFooter>
                                                </Card>
                                            )

                                        ) : (
                                            <div className="text-center py-10">
                                                <p className="text-gray-500 dark:text-gray-400">No tienes datos propios todavía.</p>
                                                <Button
                                                    className="mt-4" variant="outline">
                                                    <FilePlus2 className="mr-2 h-4 w-4" /> Crear mi primer dato
                                                </Button>
                                            </div>
                                        )}
                            </div>
                        </TabsContent>

                        {/* Contenido de la Pestaña "Importar Datos" */}
                        <TabsContent value="externalAccounts">
                            <div className="space-y-4">
                                {externalAccounts.length > 0 ? (
                                    externalAccounts.map((account) => (
                                        <Card key={account.id} className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-green-600 dark:text-green-400">{account.name}</CardTitle>
                                                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                                    Origen: {account.bank}
                                                </CardDescription>
                                            </CardHeader>
                                            {account.created_at && (
                                                <CardContent>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        Última importación: {new Date(account.created_at).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </p>
                                                </CardContent>
                                            )}
                                            <CardFooter className="flex justify-end pt-4">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
                                                >
                                                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                                                    Importar este dato
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles para importar en este momento.</p>
                                        <Button
                                            className="mt-4" variant="outline">
                                            <UploadCloud className="mr-2 h-4 w-4" /> Buscar datos para importar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </SwipeTabsWrapper>

                {/* Botón Flotante que cambia según la pestaña activa */}
                <FabButton />

                <ShowAccountQr account={selectedAccount} open={!!selectedAccount} onCloseAction={() =>setSelectedAccount(null)} />
                <AddOwnAccount open={showAddAccountModal} onCloseAction={setShowAddAccountModal} onSaveAction={() => setShowAddAccountModal(false)} />

            </main>
            <footer className="bg-green-300">footer</footer>
        </>
    )
}
