
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
        <aside className="sticky left-0 top-0 h-screen w-20 bg-white border-r border-gray-100 flex flex-col items-center py-8 z-50 shrink-0">

            <div className="mb-12">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-xl italic">S</span>
                </div>
            </div>

            <nav className="flex flex-col gap-8 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`p-3 rounded-2xl transition-all relative group ${isActive
                                ? 'bg-black text-white'
                                : 'text-gray-400 hover:text-black hover:bg-gray-50'
                                }`}
                        >
                            <Icon size={24} />

                            {/* Tooltip */}
                            <span className="absolute left-full ml-4 px-3 py-1 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
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
