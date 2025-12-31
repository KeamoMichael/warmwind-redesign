import React from 'react';
import { useInteraction } from '../contexts/InteractionContext';
import AgentCursor from './AgentCursor';
import { AnimatePresence, motion } from 'framer-motion';

const VisualInteractionLayer: React.FC = () => {
    const { cursor } = useInteraction();

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {cursor.isVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    // We use direct style for performance on x/y updates, or simple motion values
                    // Since cursor.x/y changes every frame during animation, passing them as props to AgentCursor
                    // handled via context is one way.
                    // Here we just render the AgentCursor at the position.
                    >
                        <AgentCursor
                            x={cursor.x}
                            y={cursor.y}
                            isVisible={true} // Controlled by parent AnimatePresence
                        // We can extend AgentCursor to support isDown visual state
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Debug Layer (Optional) - visualize click arguments */}
            {/* <div className="absolute w-2 h-2 bg-red-500 rounded-full" style={{ left: cursor.x, top: cursor.y, opacity: cursor.isDown ? 0.8 : 0 }} /> */}
        </div>
    );
};

export default VisualInteractionLayer;
