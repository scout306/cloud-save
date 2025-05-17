import {
    saveSettingsDebounced,
} from "@silly-tavern/script.js";
import { extension_settings } from '@silly-tavern/scripts/extensions.js';
import { signal, type Signal } from '@lit-labs/signals';
interface SignalState<T> {
    rawSignal: Signal.State<T>;
    get: () => T;
    set: (value: T) => void;
}
type SignalStateMap<T> = {
    [K in keyof T]: SignalState<T[K]>
};
const extensionName = "extension-zerxz-lib";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
//@ts-ignore
extension_settings[extensionName] ??= {};
const signals: Record<string, Record<string, SignalState<any>>> = {};
// @ts-ignore
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const extensionSettings: Record<string, any> = extension_settings[extensionName];
const getExtensionSettings = () => extension_settings;
export function useExtensionSetting<T extends Record<string, any>>(path: string = "default", _defaultSettings: T | (() => T) | undefined = undefined) {
    if (path) {
        extensionSettings[path] ??= {};
        signals[path] ??= {};
    }
    const _extensionSettings = path ? extensionSettings[path] : extensionSettings;
    if (_defaultSettings) {
        const settings = typeof _defaultSettings === "function" ? _defaultSettings() : _defaultSettings;
        for (const key in settings) {
            _extensionSettings[key] ??= settings[key];
        }
        saveSettingsDebounced();
    }
    const _signals = (path ? signals[path] : signals) as Record<string, SignalState<any>>;
    for (const key in _extensionSettings) {
        _signals[key] ??= createSignal(key, _extensionSettings[key]);
    }

    saveSettingsDebounced();
    // @ts-ignore
    function setSetting(path: string, value: any) {
        _extensionSettings[path] = value;
        saveSettingsDebounced();
    }
    function setSettings(settings: Record<string, any>) {
        Object.assign(_extensionSettings, settings);
        saveSettingsDebounced();
    }
    function getSettings() {
        return _extensionSettings;
    }
    function getSetting(path: string) {
        return _extensionSettings[path];
    }
    function getSignal<K extends keyof T>(path: K): SignalState<T[K]> {
        _signals[path as string] ??= createSignal(path as string, _extensionSettings[path as string]);
        return _signals[path as string] as SignalState<T[K]>;
    }
    function createSignal<T>(path: string, value: T, options?: Signal.Options<T>) {
        return {
            rawSignal: signal(value, options),
            get() {
                return this.rawSignal.get();
            },
            set(value: T) {
                this.rawSignal.set(value);
                setSetting(path, value);
            },
        } as SignalState<T>;
    }
    // 修改getSignals的返回类型
    function getSignals(): SignalStateMap<T> {
        return _signals as SignalStateMap<T>;
    }

    return {
        getExtensionSettings,
        extensionSettings: _extensionSettings,
        setSetting,
        getSetting,
        setSettings,
        getSettings,
        saveSettingsDebounced,
        extensionFolderPath,
        getSignal,
        getSignals,
    }
}
