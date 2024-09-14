const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const unzip = require('unzip-crx-3')
const { app, net } = require('electron')
const https = require('https')

// Utility functions
const getPath = () => {
  const savePath = app.getPath('userData')
  return path.resolve(`${savePath}/extensions`)
}

const request = net ? net.request : https.get

const downloadFile = (from, to) => {
  return new Promise((resolve, reject) => {
    const req = request(from)
    req.on('response', (res) => {
      if (
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        return downloadFile(res.headers.location, to)
          .then(resolve)
          .catch(reject)
      }
      res.pipe(fs.createWriteStream(to)).on('close', resolve)
      res.on('error', reject)
    })
    req.on('error', reject)
    req.end()
  })
}

const changePermissions = (dir, mode) => {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    fs.chmodSync(filePath, parseInt(`${mode}`, 8))
    if (fs.statSync(filePath).isDirectory()) {
      changePermissions(filePath, mode)
    }
  })
}

// Main function to download and install the Chrome extension
const downloadChromeExtension = (
  chromeStoreID,
  forceDownload = false,
  attempts = 5
) => {
  const extensionsStore = getPath()
  if (!fs.existsSync(extensionsStore)) {
    fs.mkdirSync(extensionsStore, { recursive: true })
  }

  const extensionFolder = path.resolve(`${extensionsStore}/${chromeStoreID}`)

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(extensionFolder) || forceDownload) {
      if (fs.existsSync(extensionFolder)) {
        rimraf.sync(extensionFolder)
      }

      const fileURL = `https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${chromeStoreID}%26uc&prodversion=32` // eslint-disable-line
      const filePath = path.resolve(`${extensionFolder}.crx`)

      downloadFile(fileURL, filePath)
        .then(() => {
          unzip(filePath, extensionFolder)
            .then(() => {
              changePermissions(extensionFolder, 0o755)
              resolve(extensionFolder)
            })
            .catch((err) => {
              if (
                !fs.existsSync(path.resolve(extensionFolder, 'manifest.json'))
              ) {
                return reject(err)
              }
            })
        })
        .catch((err) => {
          console.log(
            `Failed to fetch extension, trying ${attempts - 1} more times`
          ) // eslint-disable-line
          if (attempts <= 1) {
            return reject(err)
          }
          setTimeout(() => {
            downloadChromeExtension(chromeStoreID, forceDownload, attempts - 1)
              .then(resolve)
              .catch(reject)
          }, 200)
        })
    } else {
      resolve(extensionFolder)
    }
  })
}

// #region test
// downloadChromeExtension('nhdogjmejiglipccpnnnanhbledajbpd')
//   .then((extensionFolder) => {
//     console.log(`Extension downloaded and installed at: ${extensionFolder}`)
//   })
//   .catch((err) => {
//     console.error('Failed to download and install extension:', err)
//   })
// #endregion test

module.exports = downloadChromeExtension
