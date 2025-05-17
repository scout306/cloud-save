export const CUSTOM_KEY = "api_key_makersuite_custom";
const switchState = localStorage.getItem("switch_key_maker_suite") === "true";
const throwGeminiErrorState = localStorage.getItem("throw_gemini_error") !== "true";

export const STATE = {
    switchState,
    throwGeminiErrorState
}
