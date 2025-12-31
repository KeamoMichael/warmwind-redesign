import { useCallback } from 'react';
import { useInteraction } from '../contexts/InteractionContext';

export interface AgentAction {
    type: 'click' | 'type' | 'move' | 'wait';
    targetId?: string; // ID of element registry
    position?: { x: number, y: number }; // Absolute fallback
    text?: string;
}

export const useInputController = () => {
    const { moveCursorTo, clickArguments, getElementBounds, getElementMetadata } = useInteraction();

    const executeAction = useCallback(async (action: AgentAction) => {
        switch (action.type) {
            case 'click':
                let targetX = 0;
                let targetY = 0;

                if (action.targetId) {
                    const bounds = getElementBounds(action.targetId);
                    if (bounds) {
                        // Target center
                        targetX = bounds.left + bounds.width / 2;
                        targetY = bounds.top + bounds.height / 2;
                    } else {
                        console.warn(`Target ${action.targetId} not found in registry`);
                        // Fallback to center screen or error?
                        return;
                    }
                } else if (action.position) {
                    targetX = action.position.x;
                    targetY = action.position.y;
                }

                // 1. Move
                await moveCursorTo(targetX, targetY, 800); // 800ms human-like movement

                // 2. Click
                await clickArguments(targetX, targetY);
                break;

            case 'type':
                if (!action.text) return;

                if (action.targetId) {
                    const metadata = getElementMetadata(action.targetId);
                    if (metadata?.onInput) {
                        // Simulate character by character typing
                        const textToType = action.text;
                        let currentText = "";

                        // NOTE: In a real system we might read initial value. 
                        // For now we assume typing starts fresh or appends to internal tracked state?
                        // Let's assume we are typing the 'text' fully.

                        for (let i = 0; i < textToType.length; i++) {
                            currentText += textToType[i];
                            metadata.onInput(currentText);
                            // Random typing delay (human cadence)
                            await new Promise(r => setTimeout(r, 50 + Math.random() * 80));
                        }
                    } else {
                        console.warn(`Element ${action.targetId} has no onInput handler logic`);
                    }
                }
                break;

            case 'wait':
                await new Promise(r => setTimeout(r, 500));
                break;
        }
    }, [moveCursorTo, clickArguments, getElementBounds, getElementMetadata]);

    return { executeAction };
};
