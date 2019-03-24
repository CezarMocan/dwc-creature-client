import JSZip from 'jszip'
import pify from 'pify'

const getBase64Prefix = (ext) => {
  if (ext.toLowerCase() == 'svg')
    return 'data:image/svg+xml;charset=utf-8;base64,'
  if (ext.toLowerCase() == 'png')
    return 'data:image/png;charset=utf-8;base64,'
  if (ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'jpeg')
    return 'data:image/jpeg;charset=utf-8;base64,'

  return 'data:image/png;charset=utf-8;base64,'
}

export const unzipImagesFromArchive = async (url, noItems, itemNameFn) => {
  const JSZipUtils = require('jszip-utils')
  const data = await pify(JSZipUtils.getBinaryContent)(url)
  const zip = await JSZip.loadAsync(data)
  const filePromises = []
  for (let i = 0; i < noItems; i++) {
    filePromises.push(zip.file(itemNameFn(i)).async("base64"))
  }
  const files = await Promise.all(filePromises)

  const ext = itemNameFn(0).split('.').pop();
  let prefix = getBase64Prefix(ext)

  return files.map(f => `${prefix}${f}`)
}