const TopIsland: React.FC<{ isAgenticMode: boolean }> = ({ isAgenticMode }) => {
    const [showApps, setShowApps] = React.useState(false);
    const [showPlusButton, setShowPlusButton] = React.useState(false);

    React.useEffect(() => {
        if (isAgenticMode) {
            // Wait for logo to slide out (600ms) + island expansion (600ms) = 1200ms
            const plusTimer = setTimeout(() => setShowPlusButton(true), 1200);
            // Then show apps shortly after
            const appsTimer = setTimeout(() => setShowApps(true), 1400);

            return () => {
                clearTimeout(plusTimer);
                clearTimeout(appsTimer);
            };
        } else {
            setShowApps(false);
            setShowPlusButton(false);
        }
    }, [isAgenticMode]);

    const apps = [
        { domain: "gmail.com", alt: "Gmail" },
        { domain: "google.com", alt: "Chrome" },
        { domain: "docs.google.com", alt: "Docs" },
        { domain: "sheets.google.com", alt: "Sheets" },
    ];

    return (
        <motion.div
            layout
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
                scaleX: 1,
                opacity: 1
            }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{
                scaleX: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.4 },
                layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
            }}
            style={{ transformOrigin: "center" }}
            className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-[24px] shadow-lg border border-white/40 flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap pointer-events-auto relative"
        >
            {/* Gradient Fade Masks */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

            {/* Branding Logo - slides out when agentic mode starts */}
            <AnimatePresence>
                {!isAgenticMode && (
                    <motion.div
                        key="logo"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="relative h-11 flex items-center justify-center overflow-hidden"
                    >
                        <img
                            src="/assets/warmwind logo text.png"
                            alt="warmwind"
                            className="h-5 w-auto object-contain opacity-95 brightness-95"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* App Dock - appears after logo exits and island expands */}
            {isAgenticMode && (
                <div className="flex items-center gap-3">
                    {/* Apps */}
                    {showApps && (
                        <div className="flex items-center gap-3">
                            {apps.map((app, index) => (
                                <motion.div
                                    key={app.alt}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        delay: index * 0.1,
                                        duration: 0.5,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                    className="w-11 h-11 flex items-center justify-center p-2 rounded-[14px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-neutral-100/50 hover:scale-105 transition-transform cursor-pointer overflow-hidden shrink-0"
                                >
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`}
                                        alt={app.alt}
                                        className="w-full h-full object-contain"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Plus Button */}
                    {showPlusButton && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                duration: 0.5,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                            className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all shrink-0"
                        >
                            <img
                                src="/assets/plus button.png"
                                alt="Add"
                                className="w-full h-full object-contain drop-shadow-sm"
                            />
                        </motion.div>
                    )}
                </div>
            )}
        </motion.div>
    );
};
