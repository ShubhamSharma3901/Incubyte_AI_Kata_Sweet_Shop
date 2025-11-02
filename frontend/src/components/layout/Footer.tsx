import * as React from "react";

const footerLinks = [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Support", href: "#" },
];

const Footer: React.FC = () => {
    return (
        <footer className="relative mt-auto border-t border-white/40 bg-white/60 px-3 py-4 text-sm text-neutral-500 shadow-inner shadow-white/40 backdrop-blur-xl transition-colors dark:border-neutral-800/70 dark:bg-neutral-950/70 dark:text-neutral-400 dark:shadow-black/40 safe-area-inset xs:px-4 xs:py-6 sm:px-6">
            <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[60%] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
            </div>
            <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 xs:gap-4 sm:flex-row">
                <div className="flex flex-col items-center gap-1 sm:items-start">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary xs:tracking-[0.4em]">
                        Sweet Shop
                    </span>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        © {new Date().getFullYear()} Crafted with love and sugar.
                    </p>
                </div>
                <nav className="flex items-center gap-2 xs:gap-4">
                    {footerLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="touch-target rounded-full border border-white/40 bg-white/70 px-2.5 py-1 text-xs font-medium text-neutral-600 shadow-sm shadow-white/40 transition hover:-translate-y-[1px] hover:bg-white hover:text-primary dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-300 dark:shadow-black/30 dark:hover:bg-neutral-900 dark:hover:text-primary xs:px-3"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
};

export { Footer };
