"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
    const router = useRouter();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/dashboard");
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
                        <Input id="name" type="text" placeholder="Seu nome artístico" className="bg-fz-bg-base border-fz-border" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-fz-text-primary">Email</Label>
                        <Input id="email" type="email" placeholder="nome@exemplo.com" className="bg-fz-bg-base border-fz-border" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-fz-text-primary">Senha</Label>
                        <Input id="password" type="password" className="bg-fz-bg-base border-fz-border" />
                    </div>
                    <Button type="submit" className="w-full bg-fz-accent hover:bg-fz-accent-hover text-white rounded-md h-10">
                        Criar Conta
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
