import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    return (
        <Card className="bg-fz-bg-card border-fz-border">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-serif">Entrar</CardTitle>
                <CardDescription className="text-fz-text-secondary">
                    Insira seu email e senha para acessar seu painel
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-fz-text-primary">Email</Label>
                    <Input id="email" type="email" placeholder="nome@exemplo.com" className="bg-fz-bg-base border-fz-border" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-fz-text-primary">Senha</Label>
                    <Input id="password" type="password" className="bg-fz-bg-base border-fz-border" />
                </div>
                <Button className="w-full bg-fz-accent hover:bg-fz-accent-hover text-white rounded-md h-10">
                    Entrar
                </Button>
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
