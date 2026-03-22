export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-fz-bg-base flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-4xl mb-2">FrameZ.</h1>
                    <p className="text-fz-text-secondary">Experiências premium para fotógrafos</p>
                </div>
                {children}
            </div>
        </div>
    );
}
