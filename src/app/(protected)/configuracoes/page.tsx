import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpgradeModal } from "@/components/dashboard/upgrade-modal";
import { SharedTopBar } from "@/components/dashboard/shared-top-bar";

export default function ConfiguracoesPage() {
    return (
        <div className="flex flex-col w-full animate-fade-in-up">
            <SharedTopBar title="Configurações" />

            <div className="mx-auto w-full max-w-[1200px] p-4 md:p-8 space-y-8">
                <div>
                    <p className="text-[#888880] text-[15px]">Gerencie seu perfil, slug profissional e detalhes da conta.</p>
                </div>

                <div className="grid gap-8 max-w-4xl">
                    <Card className="bg-[#111111] border-[rgba(255,255,255,0.06)]">
                        <CardHeader>
                            <CardTitle className="font-serif text-2xl">Perfil Profissional</CardTitle>
                            <CardDescription className="text-fz-text-secondary">
                                Suas informações como fotógrafo que aparecerão no seu portfólio.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nome Artístico</Label>
                                <Input placeholder="John Doe Photography" className="bg-fz-bg-base border-fz-border" />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug do Portfólio (URL)</Label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-fz-border bg-fz-bg-elevated text-fz-text-secondary sm:text-sm">
                                        framez.com/portfolio/
                                    </span>
                                    <Input placeholder="johndoe" className="rounded-l-none bg-fz-bg-base border-fz-border" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Biografia Curta</Label>
                                <textarea
                                    className="w-full min-h-[100px] border border-fz-border bg-fz-bg-base p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-fz-accent"
                                    placeholder="Conte um pouco sobre seu estilo fotográfico..."
                                />
                            </div>
                            <Button className="bg-fz-accent hover:bg-fz-accent-hover text-white">
                                Salvar Alterações
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111111] border-[rgba(255,255,255,0.06)]">
                        <CardHeader>
                            <CardTitle className="font-serif text-2xl">Plano de Assinatura</CardTitle>
                            <CardDescription className="text-fz-text-secondary">
                                Gerencie seus limites de armazenamento e funcionalidades premium.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center p-4 bg-fz-bg-base rounded-md border border-fz-border mb-4">
                                <div>
                                    <div className="font-semibold text-fz-text-primary">Plano Free</div>
                                    <div className="text-sm text-fz-text-secondary">Máx. 3 ensaios, 150 fotos.</div>
                                </div>
                                <UpgradeModal>
                                    <Button variant="outline" className="border-fz-accent text-fz-accent hover:bg-fz-accent hover:text-white transition-colors cursor-pointer">
                                        Fazer Upgrade
                                    </Button>
                                </UpgradeModal>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
