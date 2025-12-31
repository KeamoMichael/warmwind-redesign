import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, ChevronDown } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ConversationWidgetProps {
    messages: Message[];
    agentSteps: string[];
    activeStepIndex: number;
    isAgenticMode: boolean;
    onSendMessage: (message: string) => void; // Kept for interface compatibility, though unused internally now
    onClose: () => void;
    isResponding: boolean;
    currentAssistantMessage: string;
    agentStatus?: "thinking" | "keyboard" | "clicking" | null;
}

const ConversationWidget: React.FC<ConversationWidgetProps> = ({
    messages,
    agentSteps,
    activeStepIndex,
    isAgenticMode,
    onClose,
    isResponding,
    currentAssistantMessage,
    agentStatus
}) => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current && isExpanded) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isExpanded, currentAssistantMessage]);

    // Animation variants
    const variants = {
        compact: {
            width: 380, // Matches InputBar width roughly
            height: 60,
            borderRadius: 30,
            y: 0
        },
        expanded: {
            width: 600,
            height: 500,
            borderRadius: 32,
            y: -20 // Slight lift
        }
    };

    return (
        <motion.div
            layout
            initial="expanded"
            animate={isExpanded ? "expanded" : "compact"}
            variants={variants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50 overflow-hidden flex flex-col relative"
        >
            {/* Expanded Header Controls */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-5 right-5 flex items-center gap-2 z-20"
                    >
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
                        >
                            <Minimize2 size={18} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-red-50 rounded-full transition-colors text-neutral-400 hover:text-red-500"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {!isExpanded ? (
                        /* Collapsed: Active Agentic Steps / Status */
                        <motion.div
                            key="collapsed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-between px-6 cursor-pointer hover:bg-black/5 transition-colors"
                            onClick={() => setIsExpanded(true)}
                        >
                            <div className="flex items-center gap-3">
                                {isResponding ? (
                                    <>
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#4db7ae] animate-pulse" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#4db7ae] animate-pulse delay-75" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#4db7ae] animate-pulse delay-150" />
                                        </div>
                                        <span className="text-[15px] font-medium text-neutral-600 truncate max-w-[200px]">
                                            {(isAgenticMode && activeStepIndex >= 0 && agentSteps[activeStepIndex])
                                                ? agentSteps[activeStepIndex]
                                                : agentStatus === 'keyboard' ? 'Typing...'
                                                    : agentStatus === 'clicking' ? 'Interacting...'
                                                        : 'Thinking...'}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-[15px] font-medium text-neutral-500">
                                        View conversation
                                    </span>
                                )}
                            </div>
                            <Maximize2 size={16} className="text-neutral-400" />
                        </motion.div>
                    ) : (
                        /* Expanded: Conversation History */
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full overflow-y-auto px-6 pt-12 pb-6 scrollbar-hide"
                        >
                            <div className="flex flex-col gap-6">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm ${msg.role === 'user'
                                                ? 'bg-[#4db7ae] text-white rounded-br-none'
                                                : 'bg-neutral-50 text-neutral-800 rounded-bl-none border border-neutral-100'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}

                                {/* Agentic Steps Visualization Inline */}
                                {isAgenticMode && isResponding && agentSteps.length > 0 && (
                                    <div className="flex justify-start w-full">
                                        <div className="bg-neutral-50 border border-neutral-100 rounded-2xl rounded-bl-none px-5 py-4 w-full max-w-[85%]">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-2 text-[#4db7ae] text-sm font-medium">
                                                    <div className="w-2 h-2 rounded-full bg-[#4db7ae] animate-pulse" />
                                                    Processing Task
                                                </div>
                                                <div className="space-y-2">
                                                    {agentSteps.map((step, idx) => {
                                                        const isCurrent = idx === activeStepIndex;
                                                        const isPast = idx < activeStepIndex;

                                                        // Only show current and recent past steps to keep it clean
                                                        if (idx > activeStepIndex + 1 || idx < activeStepIndex - 2) return null;

                                                        return (
                                                            <div key={idx} className={`flex items-start gap-3 text-[14px] transition-colors ${isCurrent ? 'text-neutral-800' : isPast ? 'text-neutral-400' : 'text-neutral-300'}`}>
                                                                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${isCurrent ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                                                                <span>{step}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Thinking Indicator if no steps yet */}
                                {isResponding && (!isAgenticMode || agentSteps.length === 0) && (
                                    <div className="flex justify-start w-full">
                                        <div className="bg-neutral-50 border border-neutral-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ConversationWidget;
