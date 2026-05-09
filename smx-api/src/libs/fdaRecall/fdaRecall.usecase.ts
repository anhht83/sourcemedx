import { FDARecallService } from './fdaRecall.service'
import { XFileService } from '../xfile/xfile.service'
import fs from 'fs'
import path from 'path'
import {
  getPublicFilePath,
  getPublicFolderPath,
} from '../../utils/getPublicPath'
import { FDARecallPresenter } from './fdaRecall.presenter'

export class FDARecallUseCase {
  fdaRecallService: FDARecallService
  xfileService: XFileService

  constructor() {
    this.fdaRecallService = new FDARecallService()
    this.xfileService = new XFileService()
  }

  async syncData(urlData: string) {
    try {
      const zipPath = getPublicFilePath('fda_recall_data.zip')
      const extractDir = getPublicFolderPath('fda_recall_data')
      console.log(`Downloading ${urlData}`)
      await this.xfileService.downloadFile(urlData, zipPath)

      console.log('Extracting JSON...')
      const jsonFiles = await this.xfileService.extractZip(
        zipPath,
        extractDir,
        ['.json'],
      )

      for (const file of jsonFiles) {
        console.log(`Parsing ${path.basename(file)}...`)
        const label = `⏱ ${path.basename(file)} parsed in`

        console.time(label)
        await this.fdaRecallService.parseAndImport(file)
        console.timeEnd(label)
      }
      console.log('Delete temporary files...')
      fs.rmSync(extractDir, { recursive: true, force: true })
      console.log('Import complete')
    } catch (error) {
      console.log('Error during FDA Recall data sync:', error)
    }
  }

  async searchByKeywords(keywords: string[]) {
    const fdaRecalls = await this.fdaRecallService.searchByKeywords(keywords)
    return fdaRecalls.map((fdaRecall) =>
      FDARecallPresenter.recallToExport(fdaRecall),
    )
  }
}
