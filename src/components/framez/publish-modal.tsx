import { X, CheckCircle2, Copy, ExternalLink, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface PublishSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    galleryUrl: string;
    sessionId?: string;
}

export function PublishSuccessModal({ isOpen, onClose, galleryUrl, sessionId }: PublishSuccessModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
        // Redirect to session edit page after closing
        if (sessionId) {
            router.push(`/ensaios/${sessionId}`);
        } else {
            router.push('/ensaios');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(galleryUrl);
        toast.success("Link copiado com sucesso!");
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=Seu ensaio está pronto! Veja aqui: ${galleryUrl}`, '_blank');
    };

    const handleOpen = () => {
        window.open(galleryUrl.startsWith('http') ? galleryUrl : `https://${galleryUrl}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111111] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-end">
                    <button onClick={handleClose} className="rounded-full p-1 text-[#888880] hover:bg-[#161616] hover:text-[#F5F5F0] transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(34,197,94,0.1)]">
                        <CheckCircle2 className="h-8 w-8 text-[#22C55E]" />
                    </div>
                    <h2 className="mb-2 text-2xl font-semibold tracking-[-0.05em] text-[#F5F5F0]">
                        Ensaio publicado!
                    </h2>
                    <p className="mb-6 text-[14px] text-[#888880]">
                        A galeria do seu cliente já está online e pronta para ser acessada.
                    </p>

                    <div className="mb-6 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#161616] p-4 text-left">
                        <span className="mb-2 block text-[12px] font-medium text-[#888880]">
                            Link da galeria
                        </span>
                        <div className="flex items-center gap-2">
                            <input
                                readOnly
                                value={galleryUrl}
                                className="w-full bg-transparent text-[13px] text-[#F5F5F0] outline-none font-mono"
                            />
                            <button onClick={handleCopy} className="rounded p-1.5 text-[#888880] hover:bg-[rgba(255,255,255,0.1)] hover:text-[#F5F5F0] transition-colors" title="Copiar link">
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-3">
                        <button onClick={handleWhatsApp} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#20BD5A]">
                            <Share2 className="h-4 w-4" />
                            Enviar por WhatsApp
                        </button>
                        <button onClick={handleOpen} className="flex w-full items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.15)] bg-transparent py-3 text-[14px] font-medium text-[#F5F5F0] transition-colors hover:bg-[rgba(255,255,255,0.05)]">
                            Acessar galeria
                            <ExternalLink className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
