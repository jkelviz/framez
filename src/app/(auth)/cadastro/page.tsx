"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess("Verifique seu email para confirmar o cadastro");
                // Clear form
                setName("");
                setEmail("");
                setPassword("");
            }
        } catch (err) {
            setError("Ocorreu um erro ao criar sua conta. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-fz-bg-card border-fz-border">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-serif">Comece grátis</CardTitle>
                <CardDescription className="text-fz-text-secondary">
                    Crie sua conta e transforme a entrega dos seus ensaios
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-fz-text-primary">Nome Completo</Label>
                        <Input 
                            id="name" 
                            type="text" 
                            placeholder="Seu nome artístico" 
                            className="bg-fz-bg-base border-fz-border"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                            minLength={6}
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="text-green-500 text-sm text-center">
                            {success}
                        </div>
                    )}
                    <Button 
                        type="submit" 
                        className="w-full bg-fz-accent hover:bg-fz-accent-hover text-white rounded-md h-10"
                        disabled={loading}
                    >
                        {loading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-fz-text-secondary">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-fz-accent hover:underline">
                        Entrar
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
