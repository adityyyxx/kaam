"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/sign-in-1";
import { DashedGridBackground } from "@/components/ui/home-section";
import { Chrome, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolverSafe } from "@/lib/zod-resolver-safe";
import { signUpSchema, type SignUpSchema } from "schemas";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getBackendApiUrl } from "@/lib/api-config";

export default function SignUpPage() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpSchema>({
    resolver: zodResolverSafe(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldFocusError: false,
    criteriaMode: 'all',
  });

  const handleGoogleSignUp = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = getBackendApiUrl('/api/v1/auth/google');
  };

  const handleEmailSignUpClick = () => {
    setShowEmailForm(true);
  };

  const handleBackToProviders = () => {
    setShowEmailForm(false);
    form.reset();
  };

  const onSubmit = async (data: SignUpSchema) => {
    const { username, email, password } = data;
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        toast.error(responseData.message || 'Sign up failed. Please try again.');
        setIsLoading(false);
        return;
      }
      
      if (responseData.success) {
        toast.success('Account created successfully!');
        router.push('/signin');
      } else {
        toast.error(responseData.message || 'Sign up failed. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = () => {
    // Show toast for validation errors
    const errors = form.formState.errors;
    if (errors.username) {
      toast.error(errors.username.message || 'Username is required');
    }
    if (errors.email) {
      toast.error(errors.email.message || 'Please enter a valid email address');
    }
    if (errors.password) {
      toast.error(errors.password.message || 'Password is required');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="min-h-screen w-full relative">
        <DashedGridBackground />
        
        {/* Back to Home Button */}
        <Link href="/" className="absolute top-4 left-4 z-20">
          <Button variant="ghost" size="icon" className="rounded-full bg-transparent hover:bg-background/50">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          {!showEmailForm ? (
            <AuthForm
              logoSrc="/vercel.svg"
              logoAlt="Company Logo"
              title="Sign Up"
              description="Create a new account to get started."
              primaryAction={{
                label: "Sign up with Google",
                icon: <Chrome className="mr-2 h-4 w-4" />,
                onClick: handleGoogleSignUp,
              }}
              secondaryActions={[
                {
                  label: "Sign up with Email",
                  icon: <Mail className="mr-2 h-4 w-4" />,
                  onClick: handleEmailSignUpClick,
                },
              ]}
              footerContent={
                <p>
                  Already have an account?{" "}
                  <Link href="/signin" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
                    Sign in
                  </Link>
                </p>
              }
            />
          ) : (
            <div className={cn("flex flex-col items-center justify-center w-full max-w-sm")}>
              <Card className={cn(
                "w-full",
                "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500"
              )}>
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                    <img src="/vercel.svg" alt="Company Logo" className="h-12 w-12 object-contain rounded-[4px]" />
                  </div>
                  <CardTitle className="text-2xl font-semibold tracking-tight">Sign Up</CardTitle>
                  <CardDescription>Create a new account to get started</CardDescription>
                </CardHeader>
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        {...form.register("username")}
                        className={form.formState.errors.username ? "border-destructive" : ""}
                      />
                      {form.formState.errors.username && (
                        <p className="text-xs text-red-500">{form.formState.errors.username.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...form.register("email")}
                        className={form.formState.errors.email ? "border-destructive" : ""}
                      />
                      {form.formState.errors.email && (
                        <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        {...form.register("password")}
                        className={form.formState.errors.password ? "border-destructive" : ""}
                      />
                      {form.formState.errors.password && (
                        <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full transition-transform hover:scale-[1.03]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full transition-transform hover:scale-[1.03]"
                      onClick={handleBackToProviders}
                      disabled={isLoading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  </CardContent>
                </form>
                <CardFooter className="flex flex-col">
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/signin" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
