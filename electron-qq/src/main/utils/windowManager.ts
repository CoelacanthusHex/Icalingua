import {BrowserWindow, shell} from 'electron'
import {clearCurrentRoomUnread} from '../ipc/botAndStorage'
import {getConfig} from './configManager'
import getWinUrl from '../../utils/getWinUrl'
import {updateTrayIcon} from './trayManager'

let loginWindow: BrowserWindow, mainWindow: BrowserWindow

export const loadMainWindow = () => {
    //start main window
    const winSize = getConfig().winSize
    mainWindow = new BrowserWindow({
        height: winSize.height,
        width: winSize.width,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: false,
        },
    })

    if (loginWindow)
        loginWindow.destroy()

    if (winSize.max)
        mainWindow.maximize()

    mainWindow.on('close', (e) => {
        e.preventDefault()
        mainWindow.hide()
    })

    if (process.env.NODE_ENV === 'development')
        mainWindow.webContents.session.loadExtension(
            '/usr/local/share/.config/yarn/global/node_modules/vue-devtools/vender/',
        )

    mainWindow.on('focus', async ()=> {
        clearCurrentRoomUnread()
        await updateTrayIcon()
    })

    mainWindow.webContents.setWindowOpenHandler(details => {
        shell.openExternal(details.url)
        return {
            action: 'deny'
        }
    })

    return mainWindow.loadURL(getWinUrl() + '#/main')
}
export const showLoginWindow = () => {
    if (loginWindow) {
        loginWindow.show()
        loginWindow.focus()
    } else {
        loginWindow = new BrowserWindow({
            height: 720,
            width: 450,
            maximizable: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        })

        if (process.env.NODE_ENV === 'development')
            loginWindow.webContents.session.loadExtension(
                '/usr/local/share/.config/yarn/global/node_modules/vue-devtools/vender/',
            )

        loginWindow.loadURL(getWinUrl() + '#/login')
    }
}
export const sendToLoginWindow = (channel: string, payload?: any) => {
    if (loginWindow)
        loginWindow.webContents.send(channel, payload)
}
export const sendToMainWindow = (channel: string, payload?: any) => {
    if (mainWindow)
        mainWindow.webContents.send(channel, payload)
}
export const getMainWindow = () => mainWindow
export const showWindow = () => {
    if (mainWindow) {
        mainWindow.show()
        mainWindow.focus()
    } else if (loginWindow) {
        loginWindow.show()
        loginWindow.focus()
    }
}
export const destroyWindow = () => {
    if (mainWindow) mainWindow.destroy()
    if (loginWindow) loginWindow.destroy()
}
