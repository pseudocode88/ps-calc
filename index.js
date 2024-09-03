const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 400,
        minWidth: 400,
        height: 752,
        minHeight: 752,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: 'assets/logo-1000.png',
    })

    win.resizable = true;
    win.setAlwaysOnTop(true);

    win.loadFile('index.html')
}

app.setName("Trader Bruh");

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})