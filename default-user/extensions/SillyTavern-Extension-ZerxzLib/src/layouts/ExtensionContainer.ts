import { LitElement, html, type PropertyDeclarations } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { htmlInjectorSettings } from 'utils/setting';
const { hiddenEdgeControls } = htmlInjectorSettings.getSignals();
class ZerxzLibContainer extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }
    render() {
        return html`
    <div class="zerxz-lib-settings">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>ZerxzLib</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content" >
    <div class="flex-container" >
        <div class="menu_button menu_button_icon interactable" @click=${this.handlerHiddenEdgeControl}>
            <i class=${classMap({
            "fa-solid": true,
            "fa-bug": hiddenEdgeControls.get(),
            "fa-bug-slash": !hiddenEdgeControls.get(),
        })} ></i>
            <small >${!hiddenEdgeControls.get() ? "隐藏" : "显示"}注入面板</small>
        </div>
    </div>
    <hr>
</div>
        </div>
    </div>
    `;
    }
    handlerHiddenEdgeControl() {
        hiddenEdgeControls.set(!hiddenEdgeControls.get());
        this.requestUpdate();
    }
}



customElements.define('zerxz-lib-container', ZerxzLibContainer);
export function initContainer() {
    const container = document.createElement('zerxz-lib-container');
    container.className = "extension_container";
    container.id = "zerxzlib_container";
    const root = document.getElementById("extensions_settings2");
    if (!root) {
        return;
    }
    root.appendChild(container);
}
