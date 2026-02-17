import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Settings, LogOut, FileText, ChevronRight, PiggyBank, HelpCircle, Smartphone } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();
    const signOut = useAuthStore((state) => state.signOut);
    const { t } = useTranslation();

    const links = [
        { name: t('nav.dashboard'), icon: LayoutDashboard, path: '/' },
        { name: t('nav.transactions'), icon: Wallet, path: '/transactions' },
        { name: 'Bizum', icon: Smartphone, path: '/bizum' },
        { name: 'Ahorro', icon: PiggyBank, path: '/savings' },
        { name: t('nav.files'), icon: FileText, path: '/files' },
        { name: t('nav.settings'), icon: Settings, path: '/settings' },
        { name: 'Ayuda', icon: HelpCircle, path: '/help' },
    ];

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <>
            <div
                className={clsx(
                    "fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden transition-opacity",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside className={clsx(
                "fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 text-white transform transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen shadow-2xl",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    <div className="h-24 flex items-center px-8">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                FinanzasApp
                            </h1>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Personal Edition</p>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={onClose}
                                    className={clsx(
                                        "group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={clsx("h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                                        <span className="font-medium">{link.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="h-4 w-4 text-indigo-200" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 border-t border-white/5">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all font-medium group"
                        >
                            <LogOut className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                            {t('nav.logout')}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
