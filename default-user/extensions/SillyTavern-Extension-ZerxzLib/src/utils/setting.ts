import { useExtensionSetting } from "./extension";

export const htmlInjectorSettings = useExtensionSetting("HtmlInjector", () => {
    return {
        lastMesTextContent: (localStorage.getItem('lastMesTextContent') || ''),
        isInjectionEnabled: JSON.parse(localStorage.getItem('isInjectionEnabled') || "true") as boolean,
        displayMode: Number.parseInt(localStorage.getItem('displayMode') || '1'),
        activationMode: (localStorage.getItem('activationMode') || 'all'),
        customStartFloor: Number.parseInt(localStorage.getItem('customStartFloor') || '1'),
        customEndFloor: Number.parseInt(localStorage.getItem('customEndFloor') || '-1'),
        savedPosition: (localStorage.getItem('edgeControlsPosition') || 'top-right'),
        isEdgeControlsCollapsed: (JSON.parse(localStorage.getItem('isEdgeControlsCollapsed') || "true")) as boolean,
        isVisibleSettingsPanel: JSON.parse(localStorage.getItem('isVisibleSettingsPanel') || "true") as boolean,
        saveTopPosition: (localStorage.getItem('saveTopPosition') || ''),
        hiddenEdgeControls: false,
    };
});
