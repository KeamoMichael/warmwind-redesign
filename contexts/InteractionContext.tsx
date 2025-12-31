import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

export interface CursorState {
    x: number;
    y: number;
    isDown: boolean;
    visualState: 'default' | 'pointer' | 'text' | 'wait';
    isVisible: boolean;
}

export interface InteractionMetadata {
    type?: 'button' | 'input' | 'container';
    onInput?: (value: string) => void;
    onFocus?: () => void;
}

export interface InteractionContextType {
    cursor: CursorState;
    registerElement: (id: string, element: HTMLElement, metadata?: InteractionMetadata) => void;
    unregisterElement: (id: string) => void;
    getElementBounds: (id: string) => DOMRect | null;
    getElementMetadata: (id: string) => InteractionMetadata | undefined;
    updateCursor: (newState: Partial<CursorState>) => void;
    // Primitives
    moveCursorTo: (x: number, y: number, duration?: number) => Promise<void>;
    clickArguments: (x: number, y: number) => Promise<void>; // Low level click at coords
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export const InteractionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cursor, setCursor] = useState<CursorState>({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        isDown: false,
        visualState: 'default',
        isVisible: true,
    });

    const elementsRef = useRef<Map<string, HTMLElement>>(new Map());
    const metadataRef = useRef<Map<string, InteractionMetadata>>(new Map());

    // Animation Frame ref for smooth movement
    const animationFrameRef = useRef<number>();

    const registerElement = useCallback((id: string, element: HTMLElement, metadata?: InteractionMetadata) => {
        elementsRef.current.set(id, element);
        if (metadata) {
            metadataRef.current.set(id, metadata);
        }
    }, []);

    const unregisterElement = useCallback((id: string) => {
        elementsRef.current.delete(id);
        metadataRef.current.delete(id);
    }, []);

    const getElementBounds = useCallback((id: string) => {
        const el = elementsRef.current.get(id);
        return el ? el.getBoundingClientRect() : null;
    }, []);

    const getElementMetadata = useCallback((id: string) => {
        return metadataRef.current.get(id);
    }, []);

    const updateCursor = useCallback((newState: Partial<CursorState>) => {
        setCursor(prev => ({ ...prev, ...newState }));
    }, []);

    // Primitive: Move Cursor (Linear interpolation for now, can be enhanced with bezier)
    const moveCursorTo = useCallback((targetX: number, targetY: number, duration: number = 500) => {
        return new Promise<void>((resolve) => {
            const startX = cursor.x;
            const startY = cursor.y;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function: easeOutCubic
                const ease = 1 - Math.pow(1 - progress, 3);

                const newX = startX + (targetX - startX) * ease;
                const newY = startY + (targetY - startY) * ease;

                setCursor(prev => ({ ...prev, x: newX, y: newY }));

                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = requestAnimationFrame(animate);
        });
    }, [cursor.x, cursor.y]);

    const clickArguments = useCallback(async (x: number, y: number) => {
        // 1. Move to (instant or assumed already there)
        // 2. Mouse Down
        updateCursor({ isDown: true });
        await new Promise(r => setTimeout(r, 100)); // Hold

        // 3. Mouse Up
        updateCursor({ isDown: false });

        // 4. Logical Click
        const target = document.elementFromPoint(x, y);
        if (target instanceof HTMLElement) {
            target.click();
            // Also dispatch focus if input
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                target.focus();
            }
        }
        await new Promise(r => setTimeout(r, 50));
    }, [updateCursor]);


    return (
        <InteractionContext.Provider value={{
            cursor,
            registerElement,
            unregisterElement,
            getElementBounds,
            getElementMetadata,
            updateCursor,
            moveCursorTo,
            clickArguments,
        }}>
            {children}
        </InteractionContext.Provider>
    );
};

export const useInteraction = () => {
    const context = useContext(InteractionContext);
    if (!context) {
        throw new Error('useInteraction must be used within an InteractionProvider');
    }
    return context;
};
