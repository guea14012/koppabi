import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron'
import { join, dirname } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import Store from 'electron-store'

const store = new Store()
const isDev = !app.isPackaged
let win: BrowserWindow | null = null

app.whenReady().then(() => {
  const b = store.get('bounds', { width: 1400, height: 860 }) as { width: number; height: number }
  win = new BrowserWindow({
    ...b, minWidth: 1000, minHeight: 660,
    frame: false, backgroundColor: '#07070f', show: false,
    webPreferences: { preload: join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false },
  })
  isDev ? win.loadURL('http://localhost:5173') : win.loadFile(join(__dirname, '../dist/index.html'))
  win.once('ready-to-show', () => win?.show())
  win.on('resize', () => win && store.set('bounds', win.getBounds()))
  win.on('closed', () => win = null)
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'File', submenu: [
      { label: 'New Dashboard', accelerator: 'CmdOrCtrl+N', click: () => win?.webContents.send('menu-new') },
      { label: 'Import Data...', click: () => win?.webContents.send('menu-import') },
      { label: 'Export...', click: () => win?.webContents.send('menu-export') },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() },
    ]},
    ...(isDev ? [{ label: 'Dev', submenu: [{ role: 'toggleDevTools' as const }] }] : []),
  ]))
})

ipcMain.handle('win:min',   () => win?.minimize())
ipcMain.handle('win:max',   () => win?.isMaximized() ? win.unmaximize() : win?.maximize())
ipcMain.handle('win:close', () => win?.close())
ipcMain.handle('win:ismax', () => win?.isMaximized() ?? false)
ipcMain.handle('dialog:open-data', async () =>
  dialog.showOpenDialog(win!, { properties: ['openFile'], filters: [{ name: 'Data Files', extensions: ['csv', 'json', 'xlsx'] }] })
)
ipcMain.handle('dialog:save', async (_, name: string) =>
  dialog.showSaveDialog(win!, { defaultPath: name, filters: [{ name: 'JSON', extensions: ['json'] }] })
)
ipcMain.handle('file:read', (_, p: string) => { try { return { success: true, data: readFileSync(p, 'utf-8') } } catch (e) { return { success: false, error: (e as Error).message } } })
ipcMain.handle('file:write', (_, p: string, d: string) => { try { const dir = dirname(p); if (!existsSync(dir)) mkdirSync(dir,{recursive:true}); writeFileSync(p,d,'utf-8'); return {success:true} } catch(e){return{success:false,error:(e as Error).message}} })
ipcMain.handle('store:get', (_, k:string) => store.get(k))
ipcMain.handle('store:set', (_, k:string, v:unknown) => store.set(k,v))
ipcMain.handle('app:version', () => app.getVersion())
ipcMain.handle('shell:open', (_, url:string) => shell.openExternal(url))

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
