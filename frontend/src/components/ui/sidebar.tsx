import React, { useState, createContext, useContext, useEffect, useRef } from "react";
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
    isDesktop = false,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
    isDesktop?: boolean;
}) => {
    const [openState, setOpenState] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

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
    isDesktop,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
    isDesktop?: boolean;
}) => (
    <SidebarProvider
        open={open}
        setOpen={setOpen}
        animate={animate}
        isDesktop={isDesktop}
    >
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
    const collapseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelScheduledCollapse = () => {
        if (collapseTimeout.current) {
            clearTimeout(collapseTimeout.current);
            collapseTimeout.current = null;
        }
    };

    const scheduleCollapse = () => {
        if (!isDesktop) return;
        cancelScheduledCollapse();
        collapseTimeout.current = setTimeout(() => setOpen(false), 180);
    };

    const handleExpand = () => {
        if (!isDesktop) return;
        cancelScheduledCollapse();
        setOpen(true);
    };

    useEffect(() => () => cancelScheduledCollapse(), []);

    return (
        <motion.aside
            className={cn(
                "relative hidden overflow-hidden rounded-3xl border border-border/70 bg-neutral-900 text-neutral-100 shadow-xl backdrop-blur lg:flex lg:flex-col",
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
            onMouseEnter={handleExpand}
            onMouseLeave={scheduleCollapse}
            onFocusCapture={handleExpand}
            onBlurCapture={scheduleCollapse}
            {...props}>
            <div className='relative flex h-full flex-col gap-6'>{content}</div>
        </motion.aside>
    );
};

export const MobileSidebar = ({
    className,
    children,
}: React.ComponentProps<"div">) => {
    const { open, setOpen, isDesktop } = useSidebar();
    const content = children as React.ReactNode;

    useEffect(() => {
        if (isDesktop) return;
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open, isDesktop]);

    if (isDesktop) return null;

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setOpen(false)}
            />
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex h-full w-[min(85vw,320px)] flex-col border-r border-border/70 bg-neutral-900 text-neutral-100 shadow-xl transition-transform duration-200 lg:hidden",
                    open ? "translate-x-0" : "-translate-x-full",
                    className
                )}
            >
                <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-200">
                        Menu
                    </span>
                    <button
                        onClick={() => setOpen(false)}
                        className="rounded-full p-2 text-neutral-300 transition hover:bg-neutral-800"
                        aria-label="Close sidebar"
                    >
                        <IconX className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="flex flex-col gap-1 text-sm font-medium text-neutral-300">
                        {content}
                    </div>
                </div>
            </div>
        </>
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
                    ? "text-white bg-primary/20"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-800",
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
                        ? "bg-primary/30 text-white"
                        : "bg-neutral-800 text-neutral-300 group-hover/sidebar:bg-neutral-700"
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
