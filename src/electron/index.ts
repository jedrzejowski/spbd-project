import {app, BrowserWindow} from 'electron'

let mainWindow: Electron.BrowserWindow

function onReady() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    });

    const fileName = `file://${__dirname}/index.html`
    mainWindow.loadURL(fileName)
    mainWindow.on("close", () => app.quit())
}

app.on("ready", () => onReady())
app.on("window-all-closed", () => app.quit())
