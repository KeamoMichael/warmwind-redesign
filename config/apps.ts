import React from 'react';
import { AppStore } from '../components/AppStore';

export interface AppManifest {
    id: string;
    name: string;
    icon: string;
    type: 'native' | 'iframe' | 'remote';
    component?: React.FC<any>;
    url?: string;
    width?: number;
    height?: number;
}

export const APP_REGISTRY: Record<string, AppManifest> = {
    "App Store": {
        id: "App Store",
        name: "App Store",
        icon: "/assets/plus button.png",
        type: 'native',
        component: AppStore,
        width: 850,
        height: 600
    },
    "Chrome": {
        id: "Chrome",
        name: "Google Chrome",
        icon: "/assets/Chrome-Logo.png",
        type: 'remote',
        url: "https://google.com",
        width: 800,
        height: 580
    },
    "YouTube": {
        id: "YouTube",
        name: "YouTube",
        icon: "/assets/youtube.png",
        type: 'remote',
        url: "https://youtube.com",
        width: 900,
        height: 650
    },
    "Gmail": {
        id: "Gmail",
        name: "Gmail",
        icon: "/assets/gmail icon.png",
        type: 'remote',
        url: "https://mail.google.com/mail/mu/mp/",
        width: 800,
        height: 600
    },
    "Docs": {
        id: "Docs",
        name: "Google Docs",
        icon: "/assets/Google_Docs_logo.png",
        type: 'remote',
        url: "https://docs.google.com/document/u/0/",
        width: 850,
        height: 650
    },
    "Sheets": {
        id: "Sheets",
        name: "Google Sheets",
        icon: "/assets/Google_Sheets_Logo.png",
        type: 'remote',
        url: "https://docs.google.com/spreadsheets/u/0/",
        width: 850,
        height: 650
    }
};
