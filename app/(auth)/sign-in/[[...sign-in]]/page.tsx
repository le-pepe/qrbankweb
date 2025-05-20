import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="relative flex min-h-dvh flex-col-reverse md:flex-row">
            {/* Left side - Sign In */}
            <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-background p-4 md:w-1/2 md:p-8">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <SignIn />
                </div>
            </div>

            {/* Right side - Gradient */}
            <div className="w-full bg-gradient-to-br from-primary/20 via-primary/10 to-background md:w-1/2" />
        </div>
    );
}
