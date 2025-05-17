import { STATE } from "./constants";
import { isGeminiSource, throwGeminiError } from "./gemini";

// @ts-ignore
const oldError = toastr.error;
export function initToastr() {
    // @ts-ignore
    toastr.error = (/** @type { any[]} */ ...args) => {
        oldError(...args);
        console.log(args);
        console.error(...args);
        if (!isGeminiSource() || !STATE.throwGeminiErrorState) {
            return;
        }
        const [message, type] = args;

        if (!type) {
            return;
        }
        if (type === "Chat Completion API") {
            const lastKeyElement = $("#last_key_maker_suite")[0] as HTMLSpanElement;
            throwGeminiError(`<h3>Chat Completion API 错误</h3>
				<p>${message}</p>
				<p> ${lastKeyElement.textContent}</p>`);
        }
    };
}
