'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {createOwnAccount} from "@/lib/actions";
import {toast} from "sonner";

export function formatRut(value: string): string {
    // Limpia todo lo que no sea dígito o 'k'/'K'
    const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();

    if (clean.length === 0) return "";

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);

    let formatted = "";
    for (let i = body.length - 1, j = 1; i >= 0; i--, j++) {
        formatted = body[i] + formatted;
        if (j % 3 === 0 && i !== 0) {
            formatted = "." + formatted;
        }
    }

    return `${formatted}-${dv}`;
}

export function isValidRut(rut: string): boolean {
    const cleanRut = rut.replace(/\./g, "").replace("-", "").toUpperCase();
    if (cleanRut.length < 2) return false;

    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDv = 11 - (sum % 11);
    let dvCalculated = expectedDv === 11 ? "0" : expectedDv === 10 ? "K" : expectedDv.toString();

    return dvCalculated === dv;
}

const formSchema = z.object({
    name: z.string().nonempty("El nombre es obligatorio"),
    rut: z
        .string()
        .nonempty("El RUT es obligatorio")
        .refine(isValidRut, "El RUT ingresado no es válido"),
    bank: z.string().nonempty("El banco es obligatorio"),
    accountType: z.string().nonempty("El tipo de cuenta es obligatorio"),
    accountNumber: z.string().nonempty("El número de cuenta es obligatorio"),
    email: z.string().optional(),
    alias: z.string().optional(),
});



export function NewAccountForm({submitAction}: {submitAction: () => void}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            rut: "",
            bank: "",
            accountType: "",
            accountNumber: "",
            email: "",
            alias: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // TODO: call addOwnAccount action
        const account = {...values, isMine: true};
        createOwnAccount(account).then(() => submitAction()).catch((err) => {
            toast.error(err.message)
        });
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input placeholder="Juan Pérez" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="rut"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>RUT</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="12.345.678-9"
                                    value={field.value}
                                    onChange={(e) => {
                                        const formatted = formatRut(e.target.value);
                                        field.onChange(formatted);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    name="bank"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Banco</FormLabel>
                            <FormControl>
                                <Input placeholder="Banco Ejemplo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="accountType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de cuenta</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona un tipo de cuenta" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-full">
                                    <SelectItem value="corriente">Cuenta Corriente</SelectItem>
                                    <SelectItem value="vista">Cuenta Vista</SelectItem>
                                    <SelectItem value="ahorro">Cuenta de Ahorro</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="accountNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número de cuenta</FormLabel>
                            <FormControl>
                                <Input placeholder="123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="correo@ejemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="alias"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Alias</FormLabel>
                            <FormControl>
                                <Input placeholder="Cuenta sueldo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Agregar cuenta
                </Button>
            </form>
        </Form>
    );
}
