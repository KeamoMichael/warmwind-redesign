import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Maximize2, Minimize2, ChevronDown, ChevronRight } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ConversationWidgetProps {
    messages: Message[];
    agentSteps: string[];
    activeStepIndex: number;
    isAgenticMode: boolean;
    onSendMessage: (message: string) => void;
    onClose: () => void;
    isResponding: boolean;
    currentAssistantMessage: string;
}

const ConversationWidget: React.FC<ConversationWidgetProps> = ({
    messages,
    agentSteps,
    activeStepIndex,
    isAgenticMode,
    onSendMessage,
    onClose,
    isResponding,
    currentAssistantMessage
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current && isExpanded) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isExpanded, currentAssistantMessage]);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Determine widget size variants
    const variants = {
        compact: {
            width: 500,
            height: isAgenticMode ? 180 : 80,
            borderRadius: 32,
        },
        expanded: {
            width: 600,
            height: 500,
            borderRadius: 24,
        }
    };

    return (
        <motion.div
            layout
            initial="compact"
            animate={isExpanded ? "expanded" : "compact"}
            variants={variants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50 overflow-hidden flex flex-col relative"
        >
            {/* Header Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
                >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-red-50 rounded-full transition-colors text-neutral-400 hover:text-red-500"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-hide">
                {!isExpanded ? (
                    /* Compact View */
                    <div className="flex flex-col h-full justify-center">
                        {isAgenticMode ? (
                            /* Agentic Steps View */
                            <div className="flex flex-col items-center justify-center w-full">
                                <AnimatePresence mode="popLayout">
                                    {agentSteps.map((step, idx) => {
                                        const relativePos = idx - activeStepIndex;
                                        if (relativePos < 0 || relativePos > 1) return null;

                                        return (
                                            <motion.div
                                                key={step + idx}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{
                                                    y: relativePos === 0 ? 0 : 20,
                                                    opacity: relativePos === 0 ? 1 : 0.4,
                                                    scale: relativePos === 0 ? 1 : 0.95
                                                }}
                                                exit={{ y: -20, opacity: 0 }}
                                                className="flex items-center gap-3 w-full justify-center mb-2"
                                            >
                                                {relativePos === 0 && (
                                                    <div className="w-2 h-2 rounded-full bg-[#4db7ae] animate-pulse shadow-[0_0_8px_#4db7ae]" />
                                                )}
                                                <span className={`text-[15px] ${relativePos === 0 ? 'text-neutral-800 font-medium' : 'text-neutral-400'}`}>
                                                    {step}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* Simple Message View */
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center text-center"
                            >
                                <span className="text-[17px] text-neutral-700 font-light leading-relaxed px-8">
                                    {currentAssistantMessage || "I'm ready to help."}
                                </span>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    /* Expanded Conversation View */
                    <div className="flex flex-col gap-4 pb-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${msg.role === 'user'
                                            ? 'bg-[#4db7ae] text-white rounded-br-none shadow-sm'
                                            : 'bg-neutral-100 text-neutral-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Current generating message or Thinking state */}
                        {isResponding && (
                            <div className="flex justify-start w-full">
                                <div className="bg-neutral-50 text-neutral-500 rounded-2xl rounded-bl-none px-4 py-3 text-[14px] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    <span className="ml-1">{isAgenticMode ? "Processing task..." : "Thinking..."}</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Footer / Input Area (Only in Expanded Mode) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-4 border-t border-neutral-100 bg-white/50"
                    >
                        <div className="relative flex items-center bg-white rounded-full border border-neutral-200 px-4 py-2 shadow-sm focus-within:border-[#4db7ae] focus-within:ring-1 focus-within:ring-[#4db7ae]/20 transition-all">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Reply..."
                                className="flex-1 bg-transparent border-none outline-none text-[15px] text-neutral-800 placeholder-neutral-400"
                                autoFocus
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="ml-2 p-1.5 bg-[#4db7ae] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click-to-expand hint for Compact Mode */}
            {!isExpanded && (
                <motion.div
                    className="absolute bottom-2 w-full flex justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-neutral-300"
                    onClick={() => setIsExpanded(true)}
                >
                    <ChevronDown size={20} />
                </motion.div>
            )}
        </motion.div>
    );
};

export default ConversationWidget;
