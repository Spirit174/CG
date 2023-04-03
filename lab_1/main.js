const path = require('path')
const url = require('url')
const { app, BrowserWindow, Menu } = require('electron')

const remoteMain = require('@electron/remote/main')
remoteMain.initialize()

let win

function createWindow() {
    win = new BrowserWindow({
        width: 1150,
        height: 820,
        minWidth: 1150,
        minHeight: 820,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.webContents.openDevTools()
    remoteMain.enable(win.webContents)
    win.on('closed', () => {
        win = null
    })
}

function createToolbarWindow(link, w, h)
{
    win = new BrowserWindow({
        width: w,
        height: h,
        minWidth: 400,
        minHeight: 200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, link),
        protocol: 'file:',
        slashes: true,
        frame: false
    }))
    win.setMenuBarVisibility(false)
    win.on('closed', () => {
        win = null
    })
}

function checkIfOpened() {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 1) {
        windows[0].focus()
        return false
    }
    return true
}

app.on('ready', () => {
    createWindow()
    const template = [
        {
            label: 'Помощь',
            click: () =>
            {
                if (checkIfOpened())
                    createToolbarWindow('help.html', 400, 1000)
            }
        },
        {
            label: 'О программе',
            click: () => {
                if (checkIfOpened())
                    createToolbarWindow('task.html', 400, 200)
            }
        },
        {
            label: 'Об авторе',
            click: () => {
                if (checkIfOpened())
                    createToolbarWindow('info.html', 400, 150)
            }
        },
        {
            label: 'Выход',
            click: () => {
                app.quit()
            }
        }
    ]
    let menu

    menu = Menu.buildFromTemplate(template)

    Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})
