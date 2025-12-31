import { useCallback } from 'react';
import { useInteraction } from '../contexts/InteractionContext';

export interface AgentAction {
    type: 'click' | 'type' | 'move' | 'wait';
    targetId?: string; // ID of element registry
    position?: { x: number, y: number }; // Absolute fallback
    text?: string;
}

export const useInputController = () => {
    const { moveCursorTo, clickArguments, getElementBounds } = useInteraction();

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
                // For typing, typically we assume focus is already set by a previous click
                // But we can simulate keystrokes if we had a keyboard simulator.
                // For now, we will just assume the 'click' set focus.
                // We could emit a synthetic 'input' event if needed.
                break;

            case 'wait':
                await new Promise(r => setTimeout(r, 500));
                break;
        }
    }, [moveCursorTo, clickArguments, getElementBounds]);

    return { executeAction };
};
