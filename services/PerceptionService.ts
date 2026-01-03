/**
 * PerceptionService - Captures and compares OS state for action verification
 * 
 * This service enables the agent to verify that actions actually succeeded
 * by capturing state before/after and comparing against expected outcomes.
 */

export interface OSState {
    installedApps: string[];
    openApps: string[];
    activeScreen: 'desktop' | 'appstore' | string; // 'app:Chrome', 'app:YouTube', etc.
    timestamp: number;
}

export interface ActionExpectation {
    type: 'install' | 'open' | 'close' | 'navigate';
    target: string; // App name or URL
}

export interface VerificationResult {
    success: boolean;
    message: string;
    before: Partial<OSState>;
    after: Partial<OSState>;
}

class PerceptionService {
    private currentState: OSState = {
        installedApps: [],
        openApps: [],
        activeScreen: 'desktop',
        timestamp: Date.now()
    };

    /**
     * Update the current OS state (called by App.tsx when state changes)
     */
    updateState(newState: Partial<OSState>): void {
        this.currentState = {
            ...this.currentState,
            ...newState,
            timestamp: Date.now()
        };
    }

    /**
     * Capture current state for before/after comparison
     */
    captureState(): OSState {
        return { ...this.currentState };
    }

    /**
     * Verify that an action produced the expected state change
     */
    verifyAction(
        before: OSState,
        after: OSState,
        expectation: ActionExpectation
    ): VerificationResult {
        switch (expectation.type) {
            case 'install': {
                const wasInstalled = before.installedApps.includes(expectation.target);
                const isInstalled = after.installedApps.includes(expectation.target);

                if (wasInstalled) {
                    return {
                        success: true,
                        message: `${expectation.target} was already installed`,
                        before: { installedApps: before.installedApps },
                        after: { installedApps: after.installedApps }
                    };
                }

                if (isInstalled) {
                    return {
                        success: true,
                        message: `✅ ${expectation.target} installed successfully`,
                        before: { installedApps: before.installedApps },
                        after: { installedApps: after.installedApps }
                    };
                }

                return {
                    success: false,
                    message: `❌ Failed to install ${expectation.target} - app not in installed list`,
                    before: { installedApps: before.installedApps },
                    after: { installedApps: after.installedApps }
                };
            }

            case 'open': {
                const wasOpen = before.openApps.includes(expectation.target);
                const isOpen = after.openApps.includes(expectation.target);

                if (isOpen) {
                    return {
                        success: true,
                        message: wasOpen
                            ? `${expectation.target} was already open`
                            : `✅ ${expectation.target} opened successfully`,
                        before: { openApps: before.openApps },
                        after: { openApps: after.openApps }
                    };
                }

                return {
                    success: false,
                    message: `❌ Failed to open ${expectation.target} - window not found`,
                    before: { openApps: before.openApps },
                    after: { openApps: after.openApps }
                };
            }

            case 'close': {
                const wasOpen = before.openApps.includes(expectation.target);
                const isOpen = after.openApps.includes(expectation.target);

                if (!isOpen && wasOpen) {
                    return {
                        success: true,
                        message: `✅ ${expectation.target} closed successfully`,
                        before: { openApps: before.openApps },
                        after: { openApps: after.openApps }
                    };
                }

                if (!wasOpen) {
                    return {
                        success: true,
                        message: `${expectation.target} was not open`,
                        before: { openApps: before.openApps },
                        after: { openApps: after.openApps }
                    };
                }

                return {
                    success: false,
                    message: `❌ Failed to close ${expectation.target} - window still open`,
                    before: { openApps: before.openApps },
                    after: { openApps: after.openApps }
                };
            }

            default:
                return {
                    success: false,
                    message: `Unknown action type: ${expectation.type}`,
                    before: {},
                    after: {}
                };
        }
    }

    /**
     * Get a human-readable summary of current state
     */
    getStateSummary(): string {
        return `Installed: [${this.currentState.installedApps.join(', ')}], ` +
            `Open: [${this.currentState.openApps.join(', ')}], ` +
            `Screen: ${this.currentState.activeScreen}`;
    }
}

// Singleton instance
export const perceptionService = new PerceptionService();
