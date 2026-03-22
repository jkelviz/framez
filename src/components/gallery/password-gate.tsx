"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordGateProps {
    onSuccess: () => void;
    sessionPasswordHash?: string | null;
}

export function PasswordGate({ onSuccess, sessionPasswordHash }: PasswordGateProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionPasswordHash) { 
            onSuccess(); 
            return;
        }

        setIsLoading(true);
        try {
            const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password.trim()));
            const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
            
            if (hash === sessionPasswordHash || password === sessionPasswordHash) {
                onSuccess();
            } else {
                setError("Senha incorreta");
            }
        } catch { 
            setError("Erro ao validar senha");
        } finally { 
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-fz-bg-base flex flex-col items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm text-center">
                <Lock className="mx-auto h-12 w-12 text-fz-text-secondary mb-6" />
                <h2 className="font-serif text-3xl mb-2">Galeria Privada</h2>
                <p className="text-fz-text-secondary mb-8">Insira a senha fornecida pelo fotógrafo.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }}
                        className={`bg-fz-bg-card border-fz-border h-12 text-center text-lg ${error ? 'border-[hsl(var(--destructive))]' : ''}`}
                    />
                    {error && <p className="text-[hsl(var(--destructive))] text-sm">{error}</p>}
                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-fz-accent hover:bg-fz-accent-hover text-white text-lg rounded-md">
                        {isLoading ? "Verificando..." : "Acessar Galeria"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
