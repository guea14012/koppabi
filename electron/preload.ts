import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('api', {
  win: { minimize:()=>ipcRenderer.invoke('win:min'), maximize:()=>ipcRenderer.invoke('win:max'), close:()=>ipcRenderer.invoke('win:close'), isMax:()=>ipcRenderer.invoke('win:ismax') },
  dialog: { openData:()=>ipcRenderer.invoke('dialog:open-data'), save:(n:string)=>ipcRenderer.invoke('dialog:save',n) },
  file: { read:(p:string)=>ipcRenderer.invoke('file:read',p), write:(p:string,d:string)=>ipcRenderer.invoke('file:write',p,d) },
  store: { get:(k:string)=>ipcRenderer.invoke('store:get',k), set:(k:string,v:unknown)=>ipcRenderer.invoke('store:set',k,v) },
  version: ()=>ipcRenderer.invoke('app:version'),
  on: (ch:string,cb:(...a:unknown[])=>void) => { const h=(_:Electron.IpcRendererEvent,...a:unknown[])=>cb(...a); ipcRenderer.on(ch,h); return ()=>ipcRenderer.removeListener(ch,h) },
})
