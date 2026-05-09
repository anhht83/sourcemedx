import path from 'path'

export const getPublicFolderPath = (subfolder?: string) =>
  path.join(__dirname, '..', '..', 'public', subfolder || '')

export const getPublicFilePath = (fileName: string, subfolder?: string) =>
  path.join(getPublicFolderPath(subfolder), fileName)

export const getPublicPath = (subfolder?: string) => {
  const publicPath = getPublicFolderPath(subfolder)
  return publicPath.endsWith('/') ? publicPath : `${publicPath}/`
}

export const getPublicFileUrl = (fileName: string, subfolder?: string) =>
  path.join('/public', subfolder || '', fileName)
