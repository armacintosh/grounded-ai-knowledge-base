

export default function Footer() {
    return (
        <footer className="bg-slate-100 border-t border-slate-200 py-4 px-6 mt-auto">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 gap-2 max-w-screen-2xl mx-auto">
                <span>Designed Jan 2025</span>
                <a
                    href="https://alexandermacintosh.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-700 hover:text-sage-900 font-medium transition-colors"
                >
                    alexandermacintosh.ca
                </a>
            </div>
        </footer>
    );
}
