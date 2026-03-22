"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login form submitted with email:", email);
        setError("");
        setLoading(true);

        try {
            const supabase = createClient();
            console.log("Attempting to sign in with Supabase...");
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            console.log("Sign in result:", { data, error });

            if (error) {
                console.error("Login error:", error);
                setError(error.message);
            } else {
                console.log("Login successful, redirecting to dashboard...");
                router.push("/dashboard");
            }
        } catch (err) {
            console.error("Unexpected login error:", err);
            setError("Ocorreu um erro ao fazer login. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-fz-bg-card border-fz-border">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-serif">Entrar</CardTitle>
                <CardDescription className="text-fz-text-secondary">
                    Insira seu email e senha para acessar seu painel
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-fz-text-primary">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="nome@exemplo.com" 
                            className="bg-fz-bg-base border-fz-border"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-fz-text-primary">Senha</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            className="bg-fz-bg-base border-fz-border"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <Button 
                        type="submit"
                        className="w-full bg-fz-accent hover:bg-fz-accent-hover text-white rounded-md h-10"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-fz-text-secondary">
                    Não tem uma conta?{" "}
                    <Link href="/cadastro" className="text-fz-accent hover:underline">
                        Cadastre-se grátis
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
