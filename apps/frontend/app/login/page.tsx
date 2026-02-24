import { GoogleLoginButton } from "@/components/GoogleLoginButton";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
            <div className="z-10 max-w-md w-full items-center justify-between flex-col flex gap-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-muted-foreground">
                        Sign in to your account using Google to continue.
                    </p>
                </div>

                <div className="w-full p-8 border rounded-xl shadow-sm bg-card">
                    <GoogleLoginButton />
                </div>
            </div>
        </div>
    );
}
