import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import {
	IconMenu2,
	IconLogout,
	IconUser,
	IconUserCog,
} from "@tabler/icons-react";

interface HeaderProps {
	onToggleSidebar?: () => void;
	isSidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({
	onToggleSidebar,
	isSidebarOpen,
}) => {
	const { user, isAuthenticated, logout } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<header className="relative z-20 w-full rounded-t-3xl border-b border-white/40 bg-white/70 px-3 py-3 safe-area-inset shadow-lg shadow-primary/5 backdrop-blur-xl transition-colors xs:px-4 xs:py-4 sm:px-6">
			<div className="absolute inset-0 overflow-hidden rounded-t-3xl">
				<div className="pointer-events-none absolute -top-36 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
			</div>
			<div className="relative flex flex-wrap items-center justify-between gap-2 xs:gap-3">
				<div className="flex items-center gap-3">
					{onToggleSidebar && (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								console.log('Sidebar toggle clicked'); // Debug log
								onToggleSidebar();
							}}
							className="touch-target inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/40 bg-white/80 text-neutral-600 shadow-sm shadow-white/40 transition hover:-translate-y-[1px] hover:bg-white xs:h-11 xs:w-11 lg:hidden"
							aria-expanded={isSidebarOpen}
							aria-label="Toggle navigation menu"
						>
							<IconMenu2 className="h-4 w-4 xs:h-5 xs:w-5" />
						</button>
					)}
					<Link
						to="/"
						className="group hidden flex-col text-left lg:flex"
					>
						<span className="text-xs font-medium uppercase tracking-[0.3em] text-primary/80">
							Sweet Shop
						</span>
						<span className="text-sm font-semibold text-neutral-700 transition group-hover:text-primary">
							Delight in every bite
						</span>
					</Link>
				</div>

				{isAuthenticated ? (
					<div className="flex items-center gap-1 xs:gap-2 sm:gap-3 ml-auto">
						<div className="hidden items-center gap-2 rounded-full border border-white/40 bg-white/60 px-2 py-1.5 shadow-sm shadow-white/40 sm:px-3 sm:py-2 lg:flex">
							<div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/60 bg-gradient-to-br from-primary/20 to-sky-500/20 shadow-sm shadow-white/40 sm:h-7 sm:w-7 lg:h-8 lg:w-8">
								{user?.role === 'ADMIN' ? (
									<IconUserCog className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
								) : (
									<IconUser className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
								)}
							</div>
							<div className="flex flex-col leading-tight">
								<span className="text-xs font-semibold text-neutral-700 sm:text-xs">
									{user?.name || "User"}
								</span>
								{user?.role && (
									<span className="text-[10px] uppercase tracking-[0.2em] text-primary sm:text-[11px]">
										{user.role.toLowerCase()}
									</span>
								)}
							</div>
						</div>

						<Button
							variant="ghost"
							size="icon"
							onClick={handleLogout}
							className="touch-target h-9 w-9 rounded-2xl border border-white/40 bg-white/70 text-rose-500 shadow-sm shadow-white/40 transition hover:-translate-y-[1px] hover:bg-white xs:h-10 xs:w-10 sm:h-11 sm:w-11"
							aria-label="Logout"
						>
							<IconLogout className="h-4 w-4 xs:h-5 xs:w-5" />
						</Button>
					</div>
				) : (
					<div className="ml-auto flex items-center gap-1 xs:gap-2">
						<Link to="/login">
							<Button
								variant="ghost"
								size="sm"
								className="touch-target rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm shadow-white/40 transition hover:bg-white xs:px-4 xs:py-2 xs:text-sm"
							>
								Login
							</Button>
						</Link>
						<Link to="/register">
							<Button
								size="sm"
								className="touch-target rounded-full bg-gradient-to-r from-primary to-sky-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-primary/40 transition hover:shadow-xl xs:px-4 xs:py-2 xs:text-sm"
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
