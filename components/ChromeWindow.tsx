import React from 'react';
import { motion } from 'framer-motion';

interface ChromeWindowProps {
    onClose: () => void;
}

export const ChromeWindow: React.FC<ChromeWindowProps> = ({ onClose }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-[800px] h-[580px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-neutral-200"
            style={{ zIndex: 10 }}
        >
            {/* Window Title Bar */}
            <div className="h-10 bg-[#e8eaed] flex items-center justify-between px-3 shrink-0">
                {/* Left: Chrome Logo & Title */}
                <div className="flex items-center gap-2">
                    <img
                        src="/assets/Chrome-Logo.png"
                        alt="Chrome"
                        className="w-4 h-4"
                    />
                    <span className="text-sm text-neutral-700 font-medium">Chrome</span>
                </div>

                {/* Right: Window Controls */}
                <div className="flex items-center gap-2">
                    <button className="w-3 h-3 rounded-full hover:bg-neutral-300 transition-colors" />
                    <button className="w-3 h-3 rounded-full hover:bg-neutral-300 transition-colors" />
                    <button
                        onClick={onClose}
                        className="w-3 h-3 rounded-full bg-[#e81123] hover:bg-[#d00515] flex items-center justify-center transition-colors group"
                    >
                        <svg
                            width="6"
                            height="6"
                            viewBox="0 0 6 6"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <path
                                d="M0.5 0.5 L5.5 5.5 M5.5 0.5 L0.5 5.5"
                                stroke="white"
                                strokeWidth="1"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Tab Bar */}
            <div className="h-11 bg-[#dee1e6] flex items-center px-2 shrink-0">
                {/* Tabs Container */}
                <div className="flex items-center gap-1 flex-1">
                    {/* Dropdown Menu */}
                    <button className="w-6 h-8 flex items-center justify-center hover:bg-white/30 rounded transition-colors">
                        <svg width="12" height="8" viewBox="0 0 12 8">
                            <path d="M6 8L0 0h12z" fill="#5f6368" />
                        </svg>
                    </button>

                    {/* Active Tab */}
                    <div className="bg-white rounded-t-lg h-9 px-3 flex items-center gap-2 min-w-[200px] shadow-sm">
                        <img
                            src="/assets/Chrome-Logo.png"
                            alt="Chrome"
                            className="w-4 h-4"
                        />
                        <span className="text-sm text-neutral-800 flex-1">New Tab</span>
                        <button className="w-5 h-5 hover:bg-neutral-200 rounded flex items-center justify-center transition-colors">
                            <svg width="10" height="10" viewBox="0 0 10 10">
                                <path
                                    d="M1 1 L9 9 M9 1 L1 9"
                                    stroke="#5f6368"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* New Tab Button */}
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-white/30 rounded-full transition-colors">
                        <svg width="14" height="14" viewBox="0 0 14 14">
                            <path
                                d="M7 1 V13 M1 7 H13"
                                stroke="#5f6368"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="h-12 bg-white border-b border-neutral-200 flex items-center px-3 gap-3 shrink-0">
                {/* Navigation Buttons */}
                <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors">
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path
                                d="M10 5 L6 9 L10 13"
                                stroke="#5f6368"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors">
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path
                                d="M8 5 L12 9 L8 13"
                                stroke="#5f6368"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors">
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path
                                d="M9 3 A6 6 0 1 1 9 15 A6 6 0 1 1 9 3"
                                stroke="#5f6368"
                                strokeWidth="2"
                                fill="none"
                            />
                        </svg>
                    </button>
                </div>

                {/* Address Bar */}
                <div className="flex-1 h-9 bg-[#f1f3f4] hover:bg-white hover:shadow-md border border-transparent hover:border-neutral-300 rounded-full px-4 flex items-center gap-2 transition-all">
                    <svg width="16" height="16" viewBox="0 0 16 16">
                        <circle cx="6" cy="6" r="5" stroke="#5f6368" strokeWidth="1.5" fill="none" />
                        <path d="M10 10 L14 14" stroke="#5f6368" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search Google or type a URL"
                        className="flex-1 bg-transparent outline-none text-sm text-neutral-800 placeholder-neutral-500"
                    />
                    <svg width="16" height="16" viewBox="0 0 16 16">
                        <circle cx="8" cy="6" r="2.5" fill="#4285f4" />
                        <path d="M4 10 Q8 14 12 10" fill="#4285f4" />
                    </svg>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors">
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path
                                d="M9 2 L11 7 L16 7 L12 11 L14 16 L9 12 L4 16 L6 11 L2 7 L7 7 Z"
                                stroke="#5f6368"
                                strokeWidth="1.5"
                                fill="none"
                            />
                        </svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors">
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <rect x="4" y="4" width="10" height="10" rx="2" stroke="#5f6368" strokeWidth="1.5" fill="none" />
                        </svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors">
                        <svg width="4" height="16" viewBox="0 0 4 16">
                            <circle cx="2" cy="2" r="2" fill="#5f6368" />
                            <circle cx="2" cy="8" r="2" fill="#5f6368" />
                            <circle cx="2" cy="14" r="2" fill="#5f6368" />
                        </svg>
                    </button>
                    <button className="w-7 h-7 rounded-full overflow-hidden border-2 border-transparent hover:border-neutral-300 transition-colors">
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors">
                        <svg width="4" height="16" viewBox="0 0 4 16">
                            <circle cx="2" cy="2" r="2" fill="#5f6368" />
                            <circle cx="2" cy="8" r="2" fill="#5f6368" />
                            <circle cx="2" cy="14" r="2" fill="#5f6368" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Bookmarks Bar */}
            <div className="h-9 bg-white border-b border-neutral-200 flex items-center px-3 gap-2 shrink-0">
                <button className="flex items-center gap-2 px-2 h-6 hover:bg-neutral-100 rounded transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14">
                        <path d="M2 2 V12 H12 V2 Z M2 4 H12" stroke="#5f6368" strokeWidth="1.5" fill="none" />
                    </svg>
                    <span className="text-xs text-neutral-700">Personal</span>
                </button>
                <button className="flex items-center gap-2 px-2 h-6 hover:bg-neutral-100 rounded transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14">
                        <path d="M2 2 V12 H12 V2 Z M2 4 H12" stroke="#5f6368" strokeWidth="1.5" fill="none" />
                    </svg>
                    <span className="text-xs text-neutral-700">Work</span>
                </button>
                <button className="flex items-center gap-2 px-2 h-6 hover:bg-neutral-100 rounded transition-colors">
                    <img
                        src="/assets/gmail icon.png"
                        alt="Gmail"
                        className="w-4 h-4"
                    />
                    <span className="text-xs text-neutral-700">Gmail</span>
                </button>
            </div>

            {/* Content Area - Google Homepage */}
            <div className="flex-1 bg-white overflow-auto flex flex-col items-center justify-center pt-16">
                {/* Google Logo */}
                <div className="mb-8">
                    <svg width="272" height="92" viewBox="0 0 272 92">
                        {/* Google logo SVG - simplified version */}
                        <text x="0" y="70" fontSize="80" fontFamily="Product Sans, Arial" fontWeight="500">
                            <tspan fill="#4285F4">G</tspan>
                            <tspan fill="#EA4335">o</tspan>
                            <tspan fill="#FBBC04">o</tspan>
                            <tspan fill="#4285F4">g</tspan>
                            <tspan fill="#34A853">l</tspan>
                            <tspan fill="#EA4335">e</tspan>
                        </text>
                    </svg>
                </div>

                {/* Search Bar */}
                <div className="w-full max-w-2xl px-4">
                    <div className="w-full h-12 bg-white border border-neutral-300 hover:shadow-lg rounded-full px-5 flex items-center gap-3 transition-shadow">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <circle cx="8" cy="8" r="6" stroke="#9aa0a6" strokeWidth="2" fill="none" />
                            <path d="M12 12 L17 17" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search Google or type a URL"
                            className="flex-1 bg-transparent outline-none text-base text-neutral-800 placeholder-neutral-500"
                        />
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <circle cx="12" cy="9" r="3" fill="#4285f4" />
                            <path d="M6 15 Q12 21 18 15" fill="#4285f4" />
                        </svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="3" fill="#4285f4" />
                            <circle cx="12" cy="4" r="2" fill="#ea4335" />
                            <circle cx="20" cy="12" r="2" fill="#fbbc04" />
                            <circle cx="12" cy="20" r="2" fill="#34a853" />
                        </svg>
                    </div>
                </div>

                {/* Shortcuts */}
                <div className="flex items-center gap-12 mt-12">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-[#e8f0fe] rounded-full flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <rect x="6" y="6" width="12" height="14" rx="1" fill="#4285f4" />
                                <path d="M9 3 V8 M15 3 V8" stroke="#4285f4" strokeWidth="2" />
                            </svg>
                        </div>
                        <span className="text-xs text-neutral-700">Work Docs</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-[#fef7e0] rounded-full flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <rect x="6" y="3" width="12" height="18" rx="1" fill="#fbbc04" />
                                <text x="12" y="14" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">31</text>
                            </svg>
                        </div>
                        <span className="text-xs text-neutral-700">Work Calendar</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-[#e6f4ea] rounded-full flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M6 6 L12 3 L18 6 V18 L12 21 L6 18 Z" fill="#34a853" />
                            </svg>
                        </div>
                        <span className="text-xs text-neutral-700">Google Drive</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-[#e8f0fe] rounded-full flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M12 5 V19 M5 12 H19" stroke="#4285f4" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-xs text-neutral-700">Add shortcut</span>
                    </div>
                </div>

                {/* Customize Button */}
                <div className="absolute bottom-6 right-6">
                    <button className="px-5 py-2 bg-white border border-neutral-300 hover:shadow-md rounded-full flex items-center gap-2 transition-shadow">
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="6" stroke="#5f6368" strokeWidth="1.5" fill="none" />
                            <path d="M8 5 V11 M5 8 H11" stroke="#5f6368" strokeWidth="1.5" />
                        </svg>
                        <span className="text-sm text-neutral-700">Customize Chrome</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
