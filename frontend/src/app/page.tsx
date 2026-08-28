export default function Home() {
  return (
    <div className="text-slate-800 antialiased min-h-screen flex flex-col font-sans bg-[#f1f5f9]">
      <style>{`
        .bevel-plate {
            background-color: #e2e8f0;
            border-top: 2px solid #ffffff;
            border-left: 2px solid #ffffff;
            border-right: 2px solid #94a3b8;
            border-bottom: 2px solid #94a3b8;
            box-shadow: 2px 2px 0px 0px #cbd5e1;
        }
        .bevel-plate-dark {
            background-color: #1e293b;
            border-top: 2px solid #334155;
            border-left: 2px solid #334155;
            border-right: 2px solid #0f172a;
            border-bottom: 2px solid #0f172a;
            color: white;
        }
        .text-nav-gold { color: #fbbf24; }
        .bg-signal { background-color: #ef4444; }
        .bg-carbon { background-color: #1e293b; }
        .bg-amber { background-color: #f59e0b; }
        .border-carbon { border-color: #1e293b; }
      `}</style>
      {/* Inject HTML converted to JSX */}
      

        <header className="bevel-plate-dark p-4 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2 md:mb-0">
            <span className="text-nav-gold">KELANA</span>AI
        </h1>
        <nav className="flex gap-4 uppercase text-xs font-bold tracking-wider">
            <a href="#" className="text-nav-gold hover:text-amber">Home</a>
            <a href="#" className="text-gray-300 hover:text-white">Destinations</a>
            <a href="#" className="text-gray-300 hover:text-white">About</a>
        </nav>
    </header>

        <main className="flex-grow container mx-auto p-4 md:p-8 max-w-4xl">
        
                <section className="bevel-plate mb-8 p-1 relative overflow-hidden bg-slate-300">
                        <div className="relative w-full h-64 md:h-80 bg-slate-700 overflow-hidden border-2 border-slate-400">
                <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1200&h=400" alt="Paris Destination" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
                <div className="absolute inset-0 bg-blue-900/30"></div>
                
                <div className="absolute bottom-6 left-6">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tighter" >
                        START YOUR JOURNEY
                    </h2>
                </div>
            </div>
        </section>

                <section className="bevel-plate p-6">
            <div className="bg-carbon text-white uppercase text-xs font-bold tracking-widest px-3 py-1 mb-4 inline-block border border-slate-600">
                PLANNER MODULE
            </div>

            <form className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex flex-col w-full">
                    <label htmlFor="destination" className="uppercase text-xs font-bold text-slate-700 mb-1">Destination</label>
                    <input type="text" id="destination" placeholder="e.g. Kyoto, Japan" className="p-2 border-2 border-slate-400 bg-slate-50 focus:outline-none focus:border-carbon rounded-none" />
                </div>

                <div className="flex flex-col w-full md:w-32">
                    <label htmlFor="days" className="uppercase text-xs font-bold text-slate-700 mb-1">Days</label>
                    <input type="number" id="days" placeholder="3" min="1" className="p-2 border-2 border-slate-400 bg-slate-50 focus:outline-none focus:border-carbon rounded-none" />
                </div>

                <div className="flex flex-col w-full md:w-48">
                    <label htmlFor="budget" className="uppercase text-xs font-bold text-slate-700 mb-1">Budget (USD)</label>
                    <input type="number" id="budget" placeholder="1000" min="1" className="p-2 border-2 border-slate-400 bg-slate-50 focus:outline-none focus:border-carbon rounded-none" />
                </div>

                <button type="button" className="w-full md:w-auto bg-signal hover:bg-red-600 text-white font-bold uppercase text-sm py-2 px-6 border-2 border-red-800 shadow-[2px_2px_0px_#7f1d1d] active:shadow-none active:translate-y-0.5 active:translate-x-0.5 transition-all">
                    Generate
                </button>
            </form>
        </section>

    </main>

        <footer className="bevel-plate-dark mt-auto p-6 flex flex-col md:flex-row justify-between items-center text-xs">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-amber text-carbon px-2 py-0.5 font-bold rounded-sm border border-orange-600">
                SYSTEM OK
            </div>
            <span className="text-slate-400">&copy; 2026 KelanaAI Network</span>
        </div>
        
        <div className="flex gap-4 uppercase tracking-wider font-bold">
            <a href="#" className="text-slate-400 hover:text-nav-gold">Privacy Certified</a>
            <a href="#" className="text-slate-400 hover:text-nav-gold">Terms</a>
            <a href="#" className="text-slate-400 hover:text-nav-gold">Help</a>
        </div>
    </footer>


    </div>
  );
}
