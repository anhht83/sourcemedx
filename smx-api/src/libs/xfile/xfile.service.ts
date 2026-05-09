import fs from 'fs'
import path from 'path'
import axios from 'axios'
import unzipper from 'unzipper'

export class XFileService {
  async downloadFile(url: string, dest: string) {
    const writer = fs.createWriteStream(dest)
    const response = await axios.get(url, { responseType: 'stream' })
    return new Promise((resolve, reject) => {
      response.data.pipe(writer)
      writer.on('finish', () => resolve(''))
      writer.on('error', reject)
    })
  }

  async extractZip(
    zipPath: string,
    outputDir: string,
    fileExtensions: string[] = ['.xml'],
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: outputDir }))
        .on('close', () => {
          const allFiles: string[] = []

          function scan(dir: string) {
            const entries = fs.readdirSync(dir)
            for (const entry of entries) {
              const fullPath = path.join(dir, entry)
              const stat = fs.statSync(fullPath)
              if (stat.isDirectory()) scan(fullPath)
              else if (fileExtensions.some((ext) => fullPath.endsWith(ext))) {
                allFiles.push(fullPath)
              }
            }
          }

          try {
            scan(outputDir)
            console.log('Delete zip files...')
            fs.unlinkSync(zipPath)
            resolve(allFiles)
          } catch (e) {
            console.error('Extract error:', e)
            reject(e)
          }
        })
        .on('error', reject)
    })
  }

  async downloadAndExtract(
    url: string,
    dest: string,
    outputDir: string,
  ): Promise<string[]> {
    await this.downloadFile(url, dest)
    return this.extractZip(dest, outputDir)
  }
}
