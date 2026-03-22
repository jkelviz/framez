export function LogosBar() {
  const categories = [
    "Casamentos",
    "Ensaios",
    "Eventos",
    "Newborn",
    "Gestante",
    "Família",
    "15 Anos",
    "Corporativo",
    "Formaturas",
    "Aniversários",
  ]

  return (
    <section className="py-8 border-t border-[rgba(255,255,255,0.05)] overflow-hidden">
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10" />
        
        {/* Marquee */}
        <div className="flex animate-marquee">
          {[...categories, ...categories].map((category, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-6 py-2 mx-2 bg-[rgba(255,255,255,0.04)] rounded-full border border-[rgba(255,255,255,0.1)] text-[#888880] text-[13px]"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
