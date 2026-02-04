
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, User, Heart, LogOut } from 'lucide-react';


export default function Sidebar() {
    const pathname = usePathname();

    // Hide sidebar on auth and onboarding pages
    const hideSidebar = ['/auth', '/onboarding', '/'].includes(pathname) || pathname.startsWith('/auth');

    if (hideSidebar) return null;

    const navItems = [
        { href: '/swipe', icon: Layers, label: 'Feed' },
        { href: '/matches', icon: Heart, label: 'Matches' },
        { href: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <aside className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-2 z-50 md:sticky md:top-0 md:left-0 md:h-screen md:w-20 md:flex-col md:py-8 md:border-t-0 md:border-r md:justify-start">

            <div className="hidden md:block mb-12">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-xl italic">S</span>
                </div>
            </div>

            <nav className="flex w-full justify-around md:w-auto md:flex-col md:gap-8 md:flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all relative group text-xs ${isActive
                                ? 'bg-black text-white'
                                : 'text-gray-400 hover:text-black hover:bg-gray-50'
                                } md:p-3 md:px-3 md:py-3 md:text-base`}
                        >
                            <Icon size={22} className="md:size-6" />
                            <span className="md:hidden text-[11px] font-medium">{item.label}</span>

                            {/* Tooltip */}
                            <span className="hidden md:block absolute left-full ml-4 px-3 py-1 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="hidden md:block mt-auto">
                <button
                    onClick={() => {
                        // Handle logout - simplified for MVP
                        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                        window.location.href = '/auth';
                    }}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                    <LogOut size={24} />
                </button>
            </div>
        </aside>
    );
}
