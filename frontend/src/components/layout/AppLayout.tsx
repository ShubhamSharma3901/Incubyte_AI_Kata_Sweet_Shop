import * as React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ErrorBoundary } from "@/components/ui/error";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import {
	IconDashboard,
	IconCandy,
	IconUser,
	IconUserCog,
} from "@tabler/icons-react";

interface AppLayoutProps {
	children: React.ReactNode;
	onSearch?: (term: string) => void;
	showSidebar?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
	children,
	onSearch,
	showSidebar = false,
}) => {
	const { user, isAuthenticated } = useAuthStore();
	const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
	const [isDesktop, setIsDesktop] = React.useState<boolean>(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(min-width: 1024px)").matches;
	});

	const shouldShowSidebar = showSidebar && isAuthenticated;

	// Keep sidebar state in sync with viewport size
	React.useEffect(() => {
		if (typeof window === "undefined") return;
		if (!shouldShowSidebar) {
			setIsDesktop(false);
			setIsSidebarOpen(false);
			return;
		}

		const mediaQuery = window.matchMedia("(min-width: 1024px)");

		const syncSidebarState = (matches: boolean) => {
			setIsDesktop(matches);
			setIsSidebarOpen(false);
		};

		syncSidebarState(mediaQuery.matches);
		const listener = (event: MediaQueryListEvent) =>
			syncSidebarState(event.matches);
		mediaQuery.addEventListener("change", listener);

		return () => mediaQuery.removeEventListener("change", listener);
	}, [shouldShowSidebar]);

	const navigationLinks = React.useMemo(() => {
		const baseLinks = [
			{
				label: "Dashboard",
				href: "/dashboard",
				icon: <IconDashboard className='h-5 w-5' />,
			},
			{
				label: "Browse Sweets",
				href: "/sweets",
				icon: <IconCandy className='h-5 w-5' />,
			},
		];

		if (user?.role === "ADMIN") {
			baseLinks.push(
				{
					label: "Admin Panel",
					href: "/admin",
					icon: <IconUserCog className='h-5 w-5 text-orange-500' />,
				}
			);
		}

		return baseLinks;
	}, [user?.role]);

	const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

	return (
		<ErrorBoundary>
			<div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-sky-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950'>
				<div className='pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/15 via-transparent to-transparent dark:from-primary/10' />

				<div className='relative mx-auto flex min-h-screen w-full max-w-[1520px] flex-col gap-4 px-2 pb-6 pt-4 sm:px-4 lg:flex-row lg:gap-6 lg:px-6'>
					{shouldShowSidebar && (
						<>
							<Sidebar
								open={isSidebarOpen}
								setOpen={setIsSidebarOpen}
								animate={true}>
								<SidebarBody className='justify-between gap-8'>
									<div className='flex flex-1 flex-col overflow-hidden'>
										<Logo expanded={isSidebarOpen} />
										<nav className='mt-10 flex flex-col gap-1'>
											{navigationLinks.map((link) => (
												<SidebarLink key={link.href} link={link} />
											))}
										</nav>
									</div>
									<div>
										<SidebarLink
											link={{
												label: user?.name || "Profile",
												href: "/profile",
												icon: (
													<div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-primary/20 to-sky-500/20 shadow-sm">
														{user?.role === 'ADMIN' ? (
															<IconUserCog className="h-4 w-4 text-primary" />
														) : (
															<IconUser className="h-4 w-4 text-primary" />
														)}
													</div>
												),
											}}
										/>
									</div>
								</SidebarBody>
							</Sidebar>
						</>
					)}

					<div
						className={cn(
							"relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-xl shadow-primary/5 backdrop-blur-xl transition-colors dark:border-neutral-800/60 dark:bg-neutral-900/80 dark:shadow-black/40",
							!shouldShowSidebar && "mx-auto w-full max-w-6xl"
						)}>
						<Header
							onSearch={onSearch}
							onToggleSidebar={shouldShowSidebar ? toggleSidebar : undefined}
							isSidebarOpen={
								shouldShowSidebar && !isDesktop ? isSidebarOpen : undefined
							}
						/>

						<main className='flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-10'>
							<div className='mx-auto w-full max-w-6xl space-y-6'>
								{children}
							</div>
						</main>

						<Footer />
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
};

const Logo: React.FC<{ expanded: boolean }> = ({ expanded }) => {
	return (
		<div className={cn(
			'flex items-center rounded-2xl border border-white/50 bg-white/70 py-3 shadow-sm shadow-neutral-200/50 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70 dark:shadow-black/30 transition-all duration-200',
			expanded ? 'gap-3 px-4 justify-start' : 'px-3 justify-start'
		)}>
			<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/70 via-primary to-primary/80 text-white shadow-md dark:from-primary/60 dark:via-primary/70 flex-shrink-0'>
				<span className='text-lg font-semibold'>SS</span>
			</div>
			{expanded && (
				<div className='flex flex-col overflow-hidden'>
					<span className='text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap'>
						Sweet Shop
					</span>
				</div>
			)}
		</div>
	);
};

export { AppLayout };
