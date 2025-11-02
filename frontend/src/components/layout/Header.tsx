import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import {
	IconBell,
	IconMenu2,
	IconSearch,
	IconLogout,
	IconUser,
	IconUserCog,
} from "@tabler/icons-react";

interface HeaderProps {
	onSearch?: (term: string) => void;
	onToggleSidebar?: () => void;
	isSidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({
	onSearch,
	onToggleSidebar,
	isSidebarOpen,
}) => {
	const [searchTerm, setSearchTerm] = React.useState("");
	const { user, isAuthenticated, logout } = useAuthStore();
	const navigate = useNavigate();

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		onSearch?.(value);
	};

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<header className="relative z-30 w-full rounded-t-3xl border-b border-white/40 bg-white/70 px-4 py-4 shadow-lg shadow-primary/5 backdrop-blur-xl transition-colors dark:border-neutral-800/70 dark:bg-neutral-950/70 dark:shadow-black/40 sm:px-6">
			<div className="absolute inset-0 overflow-hidden rounded-t-3xl">
				<div className="pointer-events-none absolute -top-36 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
			</div>
			<div className="relative flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					{onToggleSidebar && (
						<button
							type="button"
							onClick={onToggleSidebar}
							className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/40 bg-white/80 text-neutral-600 shadow-sm shadow-white/40 transition hover:-translate-y-[1px] hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-200 dark:shadow-black/40 lg:hidden"
							aria-expanded={isSidebarOpen}
							aria-label="Toggle navigation menu"
						>
							<IconMenu2 className="h-5 w-5" />
						</button>
					)}
					<Link
						to="/"
						className="group hidden flex-col text-left lg:flex"
					>
						<span className="text-xs font-medium uppercase tracking-[0.3em] text-primary/80">
							Sweet Shop
						</span>
						<span className="text-sm font-semibold text-neutral-700 transition group-hover:text-primary dark:text-neutral-200">
							Delight in every bite
						</span>
					</Link>
				</div>

				{isAuthenticated ? (
					<div className="flex flex-1 items-center gap-3 sm:gap-4 lg:gap-6">
						<div className="relative hidden flex-1 items-center md:flex">
							<IconSearch className="pointer-events-none absolute left-4 h-4 w-4 text-neutral-400" />
							<Input
								value={searchTerm}
								onChange={handleSearchChange}
								type="search"
								placeholder="Search sweets, categories, or users..."
								className="h-11 w-full rounded-full border border-white/60 bg-white/70 pl-11 pr-4 text-sm text-neutral-700 shadow-inner shadow-white/40 transition focus-visible:ring-2 focus-visible:ring-primary/50 dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-200 dark:shadow-black/40"
							/>
						</div>

						<div className="flex items-center gap-2 sm:gap-3">
							<Button
								variant="ghost"
								size="icon"
								className="relative h-11 w-11 rounded-2xl border border-white/40 bg-white/70 text-neutral-600 shadow-sm shadow-white/40 transition hover:-translate-y-[1px] hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-200 dark:shadow-black/40"
								aria-label="Notifications"
							>
								<IconBell className="h-5 w-5" />
								<span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_0_2px] shadow-white dark:shadow-neutral-900" />
							</Button>

							<div className="hidden items-center gap-2 rounded-full border border-white/40 bg-white/60 px-3 py-2 shadow-sm shadow-white/40 dark:border-neutral-800 dark:bg-neutral-900/70 dark:shadow-black/40 md:flex">
								<div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-gradient-to-br from-primary/20 to-sky-500/20 shadow-sm shadow-white/40 dark:border-neutral-800 dark:shadow-black/40">
									{user?.role === 'ADMIN' ? (
										<IconUserCog className="h-4 w-4 text-primary" />
									) : (
										<IconUser className="h-4 w-4 text-primary" />
									)}
								</div>
								<div className="flex flex-col leading-tight">
									<span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
										{user?.name || "User"}
									</span>
									{user?.role && (
										<span className="text-[11px] uppercase tracking-[0.2em] text-primary">
											{user.role.toLowerCase()}
										</span>
									)}
								</div>
							</div>

							<Button
								variant="ghost"
								size="icon"
								onClick={handleLogout}
								className="h-11 w-11 rounded-2xl border border-white/40 bg-white/70 text-rose-500 shadow-sm shadow-white/40 transition hover:-translate-y-[1px] hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-rose-400 dark:shadow-black/40"
								aria-label="Logout"
							>
								<IconLogout className="h-5 w-5" />
							</Button>
						</div>
					</div>
				) : (
					<div className="ml-auto flex items-center gap-2">
						<Link to="/login">
							<Button
								variant="ghost"
								size="sm"
								className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm shadow-white/40 transition hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-200 dark:shadow-black/30"
							>
								Login
							</Button>
						</Link>
						<Link to="/register">
							<Button
								size="sm"
								className="rounded-full bg-gradient-to-r from-primary to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/40 transition hover:shadow-xl"
							>
								Sign Up
							</Button>
						</Link>
					</div>
				)}
			</div>
		</header>
	);
};

export { Header };
