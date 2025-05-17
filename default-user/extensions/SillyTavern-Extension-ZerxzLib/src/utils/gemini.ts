import { oai_settings } from "@silly-tavern/scripts/openai.js";
import { callGenericPopup, POPUP_TYPE } from "@silly-tavern/scripts/popup.js";
import { saveKey } from "./utils";
interface GeminiModel {
	description: string;
	displayName: string;
	inputTokenLimit: number;
	maxTemperature: number;
	name: string;
	outputTokenLimit: number;
	supportedGenerationMethods: string[];
	temperature: number;
	topK: number;
	topP: number;
	version: string;
}
interface GeminiResponse {
	models: GeminiModel[];
}
interface Model {
	name: string;
	model: string;
}

export async function getGeminiModel(key: string) {
	try {
		const result = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/?key=${key}`,
		);
		const data = (await result.json()) as GeminiResponse;
		if (!data?.models) {
			return [];
		}
		console.log(data);
		return data.models
			.filter((model) => model.name.includes("gemini"))
			.map((modelData) => {
				const model = modelData.name.replace("models/", "");
				const name = modelData.displayName;

				return {
					name,
					model,
				};
			});
	} catch (e) {
		console.error(e);
		return [];
	}
}

export const GEMINI_SOURCES = ["makersuite", "aistudio"];

export const isGeminiSource = () =>
	GEMINI_SOURCES.includes(oai_settings.chat_completion_source);

export function throwGeminiError(text = "") {

	callGenericPopup(`
				${text}
				<table class="responsiveTable">
					<thead>
						<tr>
							<th>报错</th>
							<th>原因或解决方案</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>429/Resource has been exhausted</td>
							<td>撞到速率上限了，请等一会，若还是出现此报错请将最大上下文调整至 50k 以下</td>
						</tr>
						<tr>
							<td>Internal Server Error</td>
							<td>手机端遇到请换成 clash，不要使用类如**VPN、** 加速器等第三方梯子软件，pc 端用户请打开服务模式和 tun 模式，若仍出现此报错需要检查一下反向代理-代理地址中是否留空，若有地址请删掉</td>
						</tr>
						<tr>
							<td>User location is not supported for the API use.</td>
							<td>节点处于被限制的国家，请更换节点(美国最优先，请勿选择欧洲、中国香港、俄罗斯等地区)</td>
						</tr>
						<tr>
							<td>Too Many Requests</td>
							<td>重刷过于频繁，等待一分钟，若无效则本日请求已达上限</td>
						</tr>
						<tr>
							<td>Bad request</td>
							<td>网络环境出错或 API 已死（账号或项目被封禁）</td>
						</tr>
						<tr>
							<td>API key expired. Please renew the API key</td>
							<td>API key 已过期或被删除</td>
						</tr>
						<tr>
							<td>The model is overloaded. Please try later</td>
							<td>此模型暂时闭馆微调，暂停开放，请换用别的模型或等待一段时间</td>
						</tr>
						<tr>
							<td>Please use a valid role: user, model.</td>
							<td>你使用了需要打补丁的预设，请换不需要补丁的预设或打补丁</td>
						</tr>
						<tr>
							<td>User location is not supported for the API use without a billing account linked.</td>
							<td>处在 Google 政策限制免费层级的地区(如英国、意大利)</td>
						</tr>
						<tr>
							<td>API key not valid. Please pass a valid API key</td>
							<td>API 返回错误，检查 API 是否可用</td>
						</tr>
						<tr>
							<td>Permission denied: Consumer has been suspended.</td>
							<td>谷歌账号被封禁</td>
						</tr>
						<tr>
							<td>MakerSuite API returned no candidate</td>
							<td>Prompt was blocked due to : OTHER 本次输出被截断，请关闭流式传输</td>
						</tr>
						<tr>
							<td>Not Found</td>
							<td>模型选择错误，请不要选择除 Gemini 系外的模型或 Gemini Ultra</td>
						</tr>
						<tr>
							<td>MakerSuite Candidate text empty</td>
							<td>还是截断，解决方法有很多，关闭一些全局世界书/更改输入内容/换版本更新一点的预设</td>
						</tr>
						<tr>
							<td>403/Forbidden</td>
							<td>账号或项目被封禁，API key 无法调用</td>
						</tr>
					</tbody>
				</table>
			`, POPUP_TYPE.TEXT, "", {
		large: true,
		wide: true,
		allowVerticalScrolling: true,
	});
}

export async function initGeminiModels(secrets: Record<string, string> = {}) {
	if (!secrets) {
		return;
	}
	const modelStr = JSON.parse(secrets.models_makersuite ?? "[]") as Model[];
	const api_key = secrets.api_key_makersuite ?? "";
	console.log("ZerxzLib init");
	const optgroup = $("#model_google_select > optgroup");
	console.log("optgroup", optgroup);
	const primaryVersions = optgroup[0];
	const subVersions = optgroup[1];
	console.log("subVersions", subVersions);
	const subVersionsArray = Array.from(
		subVersions.children,
	) as HTMLOptionElement[];
	const primaryVersionsArray = Array.from(
		primaryVersions.children,
	) as HTMLOptionElement[];
	console.log("subVersionsArray", subVersionsArray);
	const subVersionsValues = subVersionsArray.map((el) => el.value);
	const primaryVersionsValues = primaryVersionsArray.map((el) => el.value);
	const originalVersions = [
		...primaryVersionsValues,
		...subVersionsValues,
	].flat();
	const cachedVersions = modelStr.map((model) => model.model);
	// 判断是否初次加载
	if (modelStr.length > 0) {
		for (const model of modelStr) {
			if (originalVersions.includes(model.model)) {
				continue;
			}
			const option = document.createElement("option");
			option.value = model.model;
			option.text = `${model.name}(${model.model})`;
			subVersions.appendChild(option);
		}
	}
	const geminiModels = await getGeminiModel(api_key);
	console.log("geminiModels", geminiModels);
	const geminiModelOptions = geminiModels.filter(
		(model) =>
			!originalVersions.includes(model.model) &&
			!cachedVersions.includes(model.model),
	);

	if (geminiModelOptions.length === 0) {
		console.log("没有新的模型");
	} else {
		console.log("geminiModelOptions", geminiModelOptions);
		for (const model of geminiModelOptions) {
			const option = document.createElement("option");
			option.value = model.model;
			option.text = `${model.name}(${model.model})`;
			subVersions.appendChild(option);
		}
		saveKey("models_makersuite", JSON.stringify(geminiModelOptions));
	}
	const uniqueModels = new Set([...originalVersions, ...cachedVersions, ...geminiModelOptions.map((model) => model.model)]);
	if (isGeminiSource() && !!secrets.api_key_makersuite_model) {
		if (!uniqueModels.has(secrets.api_key_makersuite_model)) {
			return
		}
		oai_settings.google_model = secrets.api_key_makersuite_model;
		$('#model_google_select').val(oai_settings.google_model);
		$(`#model_google_select option[value="${oai_settings.google_model}"`)
			// @ts-ignore
			.attr('selected', true);
	}

}
