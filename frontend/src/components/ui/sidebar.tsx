import React, { useState, createContext, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface Links {
    label: string;
    href: string;
    icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animate: boolean;
    isDesktop: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
    undefined
);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    const [openState, setOpenState] = useState(false);
    const [isDesktop, setIsDesktop] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(min-width: 1024px)").matches;
    });

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mediaQuery = window.matchMedia("(min-width: 1024px)");

        const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
            const matches =
                "matches" in event ? event.matches : (event as MediaQueryList).matches;
            setIsDesktop(matches);
            if (openProp === undefined) {
                setOpen(false);
            }
        };

        handleChange(mediaQuery);
        const listener = (event: MediaQueryListEvent) => handleChange(event);
        mediaQuery.addEventListener("change", listener);
        return () => mediaQuery.removeEventListener("change", listener);
    }, [openProp, setOpen]);

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate, isDesktop }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({
    children,
    open,
    setOpen,
    animate,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
        {children}
    </SidebarProvider>
);

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
    const { isDesktop } = useSidebar();
    return (
        <>
            <DesktopSidebar {...props} />
            {!isDesktop && (
                <MobileSidebar {...(props as React.ComponentProps<"div">)} />
            )}
        </>
    );
};

export const DesktopSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<typeof motion.div>) => {
    const { open, animate, setOpen, isDesktop } = useSidebar();
    const content = children as React.ReactNode;

    return (
        <motion.aside
            className={cn(
                "relative hidden overflow-hidden rounded-3xl border border-white/20 bg-neutral-950/85 shadow-2xl shadow-primary/10 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80 lg:flex lg:flex-col",
                className
            )}
            animate={{
                width: animate ? (open ? "280px" : "92px") : "280px",
                paddingLeft: animate ? (open ? "20px" : "12px") : "20px",
                paddingRight: animate ? (open ? "20px" : "12px") : "20px",
            }}
            transition={{
                duration: 0.25,
                ease: [0.25, 0.1, 0.25, 1],
                type: "tween",
            }}
            style={{
                paddingTop: "24px",
                paddingBottom: "24px",
            }}
            onMouseEnter={() => {
                if (isDesktop) setOpen(true);
            }}
            onMouseLeave={() => {
                if (isDesktop) setOpen(false);
            }}
            {...props}>
            {/* Simplified background effects */}
            <div className='pointer-events-none absolute inset-0'>
                <div className='absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl' />
                <div className='absolute bottom-0 right-0 h-44 w-44 translate-x-1/3 translate-y-1/3 rounded-full bg-sky-400/15 blur-3xl' />
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff0a,transparent_60%)]' />
            </div>

            {/* Content container */}
            <div className='relative flex h-full flex-col gap-6'>{content}</div>
        </motion.aside>
    );
};

export const MobileSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) => {
    const { open, setOpen, isDesktop } = useSidebar();
    if (isDesktop) return null;
    const content = children as React.ReactNode;

    const {
        onDrag,
        onDragEnd,
        onDragStart,
        onDrop,
        onDragEnter,
        onDragLeave,
        onDragOver,
        onAnimationStart,
        onAnimationEnd,
        onAnimationIteration,
        onTransitionEnd,
        ...safeProps
    } = props;

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key='sidebar-overlay'
                        className='fixed inset-0 z-[80] bg-neutral-950/70 backdrop-blur-xl lg:hidden'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onClick={() => setOpen(false)}
                    />
                    <motion.div
                        key='sidebar-panel'
                        initial={{ x: "-100%", opacity: 0, scale: 0.95 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: "-100%", opacity: 0, scale: 0.95 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.4, 0.0, 0.2, 1],
                            type: "tween",
                        }}
                        className={cn(
                            "fixed inset-y-0 left-0 z-[90] flex h-full w-[min(85vw,320px)] flex-col overflow-hidden rounded-r-3xl border border-white/20 bg-neutral-950/95 shadow-2xl shadow-primary/20 backdrop-blur-2xl dark:border-neutral-800",
                            className
                        )}
                        {...safeProps}>
                        <div className='flex items-center justify-between border-b border-white/10 px-6 py-5'>
                            <span className='text-sm font-semibold uppercase tracking-[0.2em] text-neutral-200'>
                                Menu
                            </span>
                            <button
                                onClick={() => setOpen(false)}
                                className='rounded-full p-2 text-neutral-300 transition hover:bg-white/10 hover:text-white'
                                aria-label='Close sidebar'>
                                <IconX className='h-5 w-5' />
                            </button>
                        </div>
                        <div className='flex-1 overflow-y-auto px-6 py-6'>{content}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

type SidebarLinkProps = {
    link: Links;
    className?: string;
} & Omit<React.ComponentProps<typeof Link>, "to">;

export const SidebarLink = ({
    link,
    className,
    ...props
}: SidebarLinkProps) => {
    const { open, animate, setOpen, isDesktop } = useSidebar();
    const location = useLocation();
    const isActive = location.pathname === link.href;
    const { onClick, ...restProps } = props;

    return (
        <Link
            to={link.href}
            className={cn(
                "group/sidebar relative flex items-center rounded-2xl transition-all duration-200",
                // Dynamic padding and justification based on open state
                animate
                    ? open
                        ? "gap-3 px-3 py-2.5 justify-start"
                        : "px-3 py-2.5 justify-start"
                    : "gap-3 px-3 py-2.5 justify-start",
                isActive
                    ? "text-white bg-gradient-to-r from-primary/90 to-sky-400/80 shadow-lg shadow-primary/25"
                    : "text-neutral-400 hover:text-white hover:bg-white/5",
                className
            )}
            onClick={(event) => {
                if (!isDesktop) {
                    setOpen(false);
                }
                onClick?.(event);
            }}
            {...restProps}>
            {/* Icon container with consistent size */}
            <div
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 flex-shrink-0",
                    isActive
                        ? "bg-white/15 text-white"
                        : "bg-white/5 text-neutral-300 group-hover/sidebar:bg-white/10"
                )}>
                {link.icon}
            </div>

            {/* Text container with smooth width animation */}
            <motion.div
                className='relative overflow-hidden'
                animate={{
                    width: animate ? (open ? "auto" : "0px") : "auto",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                transition={{
                    duration: 0.2,
                    ease: [0.25, 0.1, 0.25, 1],
                }}>
                <span className='block text-sm font-medium tracking-wide whitespace-nowrap'>
                    {link.label}
                </span>
            </motion.div>

            {/* Active indicator - only show when expanded */}
            {isActive && open && (
                <motion.div
                    className='absolute right-3 h-1.5 w-1.5 rounded-full bg-white/90 flex-shrink-0'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                />
            )}

            {/* Active indicator for collapsed state - small dot on icon */}
            {isActive && !open && animate && (
                <motion.div
                    className='absolute top-2 right-2 h-2 w-2 rounded-full bg-white/90'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </Link>
    );
};
