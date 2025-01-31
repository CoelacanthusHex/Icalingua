import {ipcMain} from 'electron'
import {app} from 'electron'
import {getConfig} from '../utils/configManager'

ipcMain.handle('getVersion', app.getVersion)
ipcMain.handle('getAccount', () => getConfig().account)
ipcMain.handle('getAria2Settings', () => getConfig().aria2)
ipcMain.handle('getStorePath', () => app.getPath('userData'))
