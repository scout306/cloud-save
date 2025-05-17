
import { callGenericPopup, POPUP_TYPE } from "@silly-tavern/scripts/popup.js";
import {
    saveSettingsDebounced,
    getRequestHeaders,
} from "@silly-tavern/script.js";
import { STATE, CUSTOM_KEY } from "./constants";
import {
    updateSecretDisplay,
    writeSecret,
} from "@silly-tavern/scripts/secrets.js";


export async function getSecrets() {
    const response = await fetch("/api/secrets/view", {
        method: "POST",
        headers: getRequestHeaders(),
    });

    if (response.status === 403) {
        callGenericPopup(
            "<h3>禁止访问</h3><p>要在此处查看您的 API 密钥，请在 config.yaml 文件中将 allowKeysExposure 的值设置为 true，然后重新启动 SillyTavern 服务器。</p>",
            POPUP_TYPE.TEXT
        );
        return;
    }

    if (!response.ok) {
        return;
    }

    // $("#dialogue_popup").addClass("wide_dialogue_popup");
    const data = (await response.json()) as Record<string, string>;
    // console.log("data", data);
    return data;
}

export async function switchSecretsFromArray() {
    const secrets = await getSecrets();
    if (!secrets) {
        return;
    }
    if (!STATE.switchState) {
        return;
    }
    const api_key = secrets[CUSTOM_KEY] ?? "";
    const api_keys = api_key
        .split(/[\n;]/)
        .map((v) => v.trim())
        .filter((v) => v.startsWith("AIzaSy"));
    if (api_keys.length <= 1) {
        return;
    }
    const currentKey = secrets.api_key_makersuite;
    let firstKeyApi = "";
    if (api_keys.includes(currentKey)) {
        api_keys.splice(api_keys.indexOf(currentKey), 1);
        api_keys.push(currentKey);
    }
    firstKeyApi = api_keys[0];
    writeSecret("api_key_makersuite", firstKeyApi);
    saveKey(CUSTOM_KEY, api_keys.join("\n"));
    const textarea = $("#api_key_makersuite_custom")[0] as HTMLTextAreaElement;

    const currentKeyElement = $("#current_key_maker_suite")[0] as HTMLSpanElement;
    const lastKeyElement = $("#last_key_maker_suite")[0] as HTMLSpanElement;
    console.log("textarea", textarea);
    console.log("api_keys", api_keys);
    if (!textarea) {
        return;
    }
    currentKeyElement.textContent = `当前密钥: ${firstKeyApi}`;
    lastKeyElement.textContent = `最后一个密钥: ${currentKey}`;

    textarea.value = api_keys.join("\n");
}


export async function saveKey(key: string, value: string, isUpdateSecretDisplay = true) {
    // 设置密钥
    await writeSecret(key, value);
    // 更新密钥显示
    if (isUpdateSecretDisplay) {
        updateSecretDisplay();
    }
    updateSecretDisplay();
    // 保存设置
    saveSettingsDebounced();
}
