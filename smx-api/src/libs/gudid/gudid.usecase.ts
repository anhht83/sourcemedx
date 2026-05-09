import path from 'path'
import { GUDIDService } from './gudid.service'
import { XFileService } from '../xfile/xfile.service'
import fs from 'fs'
import {
  getPublicFilePath,
  getPublicFolderPath,
} from '../../utils/getPublicPath'

export class GUDIDUseCase {
  gudidService: GUDIDService
  xfileService: XFileService

  constructor() {
    this.gudidService = new GUDIDService()
    this.xfileService = new XFileService()
  }

  async syncData(urlData: string) {
    try {
      const zipPath = getPublicFilePath('gudid_data.zip')
      const extractDir = getPublicFolderPath('gudid_data')
      console.log(`Downloading ${urlData}`)
      await this.xfileService.downloadFile(urlData, zipPath)

      console.log('Extracting XML...')
      const xmlFiles = await this.xfileService.extractZip(zipPath, extractDir)

      for (const file of xmlFiles) {
        console.log(`Parsing ${path.basename(file)}...`)
        const label = `⏱ ${path.basename(file)} parsed in`

        console.time(label)
        await this.gudidService.parseAndImport(file)
        console.timeEnd(label)
      }
      console.log('Delete temporary files...')
      fs.rmSync(extractDir, { recursive: true, force: true })
      console.log('Import complete')
    } catch (error) {
      console.log('Error during GUDID data sync:', error)
    }
  }
}
