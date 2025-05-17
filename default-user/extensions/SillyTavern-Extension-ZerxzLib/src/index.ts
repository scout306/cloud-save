import {
	eventSource,
	event_types,
} from "@silly-tavern/script.js";
import { getGeminiModel, getSecrets, isGeminiSource, saveKey, switchSecretsFromArray, throwGeminiError, STATE, CUSTOM_KEY, initGeminiModels, initToastr } from "./utils";

import "./layouts/GeminiLayouts";
import { initInjector } from "./layouts/HtmlInjector";
import type { GeminiLayouts } from "./layouts/GeminiLayouts";
import { initContainer } from "layouts/ExtensionContainer";

; (async () => {
	initToastr();
	initInjector();
	initContainer();
	// 获取form元素 id为"makersuite_form"的元素 用jquery的选择器
	const secrets = (await getSecrets()) ?? {};
	await initGeminiModels(secrets);
	const form = $("#makersuite_form")[0];
	console.log("secrets", secrets);
	const geminiLayout = document.createElement("gemini-layouts") as GeminiLayouts;
	geminiLayout.currentKey = secrets.api_key_makersuite
	geminiLayout.lastKey = secrets[CUSTOM_KEY]?.split("\n").pop() || ""
	geminiLayout.throwGeminiErrorState = STATE.throwGeminiErrorState
	geminiLayout.switchKeyMakerSuite = STATE.switchState
	geminiLayout.apiKeys = secrets[CUSTOM_KEY] || ""

	form.appendChild(geminiLayout);

	eventSource.on(
		event_types.CHAT_COMPLETION_SETTINGS_READY,
		switchSecretsFromArray,
	);
	eventSource.on(event_types.CHATCOMPLETION_MODEL_CHANGED, async (model: string) => {
		if (isGeminiSource()) await saveKey("api_key_makersuite_model", model);
	})
})();
