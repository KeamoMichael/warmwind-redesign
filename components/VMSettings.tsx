import React, { useState } from 'react';

interface VMSettingsProps {
    onClose: () => void;
}

export const VMSettings: React.FC<VMSettingsProps> = ({ onClose }) => {
    const [vncUrl, setVncUrl] = useState(
        localStorage.getItem('codespace_vnc_url') || ''
    );
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        localStorage.setItem('codespace_vnc_url', vncUrl);
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
                    Codespace VNC Settings
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            VNC URL
                        </label>
                        <input
                            type="text"
                            value={vncUrl}
                            onChange={(e) => setVncUrl(e.target.value)}
                            placeholder="https://your-codespace.github.dev:6080/vnc.html"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4db7ae] focus:border-transparent"
                        />
                        <p className="mt-2 text-xs text-neutral-500">
                            Get this from your Codespace's PORTS tab (port 6080)
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-xs text-blue-800">
                            <strong>How to find:</strong>
                            <br />
                            1. Open your Codespace
                            <br />
                            2. Look for "PORTS" tab
                            <br />
                            3. Find port 6080
                            <br />
                            4. Copy the forwarded URL
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!vncUrl.trim()}
                        className="flex-1 px-4 py-2 bg-[#4db7ae] text-white rounded-lg hover:bg-[#3da89f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSaved ? '✓ Saved!' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};
