const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow = null

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  if (mainWindow) {
    mainWindow.destroy()
  }
  app.quit()
})

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  })

  // Check if we're in development or production
  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev) {
    console.log('Running in development mode')
    mainWindow.loadURL('http://localhost:3001')
    mainWindow.webContents.openDevTools()
  } else {
    console.log('Running in production mode')
    
    // Log current directory and files
    const appDir = path.join(__dirname, '..', '..')
    console.log('App directory:', appDir)
    console.log('Files in app directory:', fs.readdirSync(appDir))
    
    // Check build directory
    const buildDir = path.join(appDir, 'build')
    console.log('Build directory:', buildDir)
    if (fs.existsSync(buildDir)) {
      console.log('Files in build directory:', fs.readdirSync(buildDir))
    } else {
      console.error('Build directory does not exist!')
    }
    
    // Try to load index.html
    const indexPath = path.join(buildDir, 'index.html')
    console.log('Trying to load:', indexPath)
    
    if (fs.existsSync(indexPath)) {
      console.log('index.html exists, loading...')
      mainWindow.loadFile(indexPath).catch(err => {
        console.error('Error loading index.html:', err)
      })
    } else {
      console.error('index.html does not exist at:', indexPath)
      // Try alternative path
      const altIndexPath = path.join(appDir, 'web', 'build', 'index.html')
      console.log('Trying alternative path:', altIndexPath)
      if (fs.existsSync(altIndexPath)) {
        console.log('Found index.html at alternative path, loading...')
        mainWindow.loadFile(altIndexPath).catch(err => {
          console.error('Error loading alternative index.html:', err)
        })
      } else {
        console.error('Could not find index.html anywhere!')
      }
    }
  }

  // Log any load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription)
  })

  // Log successful loads
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully')
  })

  // Ensure app closes properly
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle window close button
  mainWindow.on('close', (e) => {
    if (mainWindow) {
      e.preventDefault()
      mainWindow.destroy()
      mainWindow = null
    }
  })
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  mainWindow = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Force close handling
app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.destroy()
    mainWindow = null
  }
})
