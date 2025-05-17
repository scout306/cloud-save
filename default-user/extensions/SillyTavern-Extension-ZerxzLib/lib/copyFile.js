import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
const sillyTavern = __dirname.substring(0, __dirname.lastIndexOf('public'));
const dirBasename = path.basename(path.dirname(__dirname));
const extesionsDir = path.join(sillyTavern, 'data', 'default-user', 'extensions');
const extexionDir = path.join(extesionsDir, dirBasename);
/**
 *  Get the path to the script file of the extension
 *  @param {string} pathToExtensionDir - The path to the extension directory
 *  @returns {string} The path to the script file of the extension
 **/
function getScriptPath(pathToExtensionDir) {
    const manifest = JSON.parse(fs.readFileSync(path.join(pathToExtensionDir, 'manifest.json'), 'utf8'));
    const { js: scriptFilepath } = manifest;
    return path.dirname(path.join(pathToExtensionDir, scriptFilepath))
}
const dataExtensionScriptPath = getScriptPath(extexionDir);
const publicExtensionScriptPath = getScriptPath(path.dirname(__dirname));
if (fs.existsSync(dataExtensionScriptPath)) {

    fs.rmdirSync(dataExtensionScriptPath, { recursive: true });
}
if (!fs.existsSync(dataExtensionScriptPath)) {
    fs.mkdirSync(dataExtensionScriptPath, { recursive: true });
}
fs.readdirSync(publicExtensionScriptPath).forEach(file => {
    const from = path.join(publicExtensionScriptPath, file);
    const to = path.join(dataExtensionScriptPath, file);
    console.log(`Copying ${from} to ${to}`);
    fs.copyFileSync(from, to);
});

