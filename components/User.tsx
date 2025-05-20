import { useUser } from "@clerk/nextjs";

export function UserComponent() {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded) {
        return <div>Cargando...</div>;
    }

    if (!isSignedIn) {
        return <div>Por favor, inicia sesión para continuar.</div>;
    }

    return <div>Tu ID de usuario es: {user.id}</div>;
}
