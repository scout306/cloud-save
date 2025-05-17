
# SillyTavern Gemini API 增强插件 - ZerxzLib

## 简介

`ZerxzLib` 是一款为 SillyTavern 提供的扩展插件，旨在增强 Gemini API 的使用体验。它提供多 API Key 轮换、自动拉取新模型、以及更详细的错误提示解读等功能，帮助用户更高效、稳定地使用 Gemini API。

## 主要功能

1.  **多 API Key 轮换:**
    *   允许用户配置多个 Gemini API Key，并自动轮换使用。
    *   当一个 Key 出现问题时，自动切换到下一个可用的 Key，提高稳定性。
    *   支持在设置界面以文本框形式输入多个 API Key，并以换行或分号分隔。
    *   界面会显示当前正在使用的 Key 以及上一个使用的 Key。

2.  **自动拉取新模型:**
    *   自动检测 Gemini API 新发布模型。
    *   将新模型添加到 SillyTavern 的模型选择列表中。
    *   仅当模型列表发生变化时，更新配置，避免重复更新。
    *  **注意：**  初次加载插件时，会将所有 Gemini 模型都加入到列表中。

3.  **报错提示解读:**
    *   当 Gemini API 返回错误时，显示更详细的错误信息，包括常见错误的原因和可能的解决方案。
    *   提供常见错误代码及对应的解释，方便用户快速定位问题。
    *   用户可以选择是否启用此功能，仅在需要时显示详细错误信息。
    *   错误信息会以弹窗形式展示，并提供详细的错误原因和解决方案表格。

4.  **密钥切换开关:**
    *   用户可以开关密钥轮换功能。
    *   当开关关闭时，插件不会自动轮换密钥。

5.  **报错开关:**
    *   用户可以开关报错功能。
    *   当开关关闭时，插件不会显示详细的错误信息。

## 使用方法

1.  **安装 (方法一):**
    *   将插件代码复制到 SillyTavern 的 `public/scripts/extensions/third-party` 目录下。
    *   确保 `manifest.json` 文件中的 `js` 字段指向正确的 `zerxzLib.js` 文件路径。

2.  **安装 (方法二):**
    *   在 SillyTavern 的扩展页面中，点击右上角的 "安装扩展" 按钮。
    *   在弹出的窗口中输入本插件的存储库地址 (例如：`https://github.com/ZerxZ/SillyTavern-Extension-ZerxzLib`) 即可安装。

3.  **配置:**
    *   在 SillyTavern 的 API 设置页面（通常是 Google AI Studio/MakerSuite），你会看到以下增强功能：
        *   一个文本框，用于输入多个 Gemini API Key，每行一个或用分号分隔。
        *   当前正在使用的密钥和上一个使用的密钥的显示。
        *   “获取新的模型”按钮，用于手动拉取新模型。
        *   “保存密钥”按钮，用于保存多个 API Key 的配置。
        *   “密钥切换设置”按钮，用于开启或关闭密钥轮换功能。
        *   “查看报错原因”按钮，用于显示 Gemini API 常见错误信息。
        *   “报错开关”按钮，用于开启或关闭错误提示功能。

4.  **多 API Key:**
    *   在文本框中输入你的多个 Gemini API Key，每行一个或用分号分隔。
    *   插件会自动轮换这些 Key，当当前 Key 不可用时，会切换到下一个 Key。

5.  **自动拉取新模型:**
    *   插件会自动检测 Gemini API 的新模型，并添加到 SillyTavern 的模型选择列表中。
    *   你也可以点击“获取新的模型”按钮手动触发。

6.  **报错提示解读:**
    *   当 Gemini API 返回错误时，如果启用了此功能，插件会弹出一个包含错误详情和解决方案的窗口。

7.  **密钥切换开关:**
    *   点击“密钥切换设置”按钮可以开启或关闭密钥轮换功能。

8.  **报错开关:**
    *   点击“报错开关”按钮可以开启或关闭错误提示功能。

## 注意事项

*   请确保你的 API Key 是有效的。
*   如果遇到插件无法正常工作，请检查 Console 中的错误信息。
*   **初次加载插件时，会将所有 Gemini 模型都加入到列表中。**
*  `Internal Server Error` 错误，手机端用户请使用clash，不要使用第三方梯子软件，pc端用户请打开服务模式和tun模式，若还出现此错误，请删除反向代理-代理地址中的地址。

## 文件结构

```
├── lib/
│   └── copyFile.js  # 用于复制构建后的文件到 SillyTavern 目录
├── src/
│   ├── utils/
│   │   ├── gemini.ts # Gemini API 相关逻辑
│   │   └── index.ts # utils 导出
│   ├── global.d.ts # 全局类型定义
│   └── index.ts # 插件入口
├── .babelrc # Babel 配置文件
├── .gitignore # Git 忽略文件
├── LICENSE # 开源协议
├── README.md # 本文档
├── bun.lockb # Bun 包管理锁定文件
├── manifest.json # SillyTavern 插件清单
├── package.json # npm 包管理配置文件
├── tsconfig.json # TypeScript 配置文件
└── webpack.config.mjs # Webpack 配置文件
```

## 开源协议

本项目使用 GNU Affero General Public License v3 协议，详见 `LICENSE` 文件。

## 联系方式

如果你有任何问题或建议，请在 GitHub 仓库中提出 Issues 或联系作者。
