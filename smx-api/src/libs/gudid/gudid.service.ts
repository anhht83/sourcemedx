import fs from 'fs'
import sax from 'sax'
import promiseLimit from 'promise-limit'
import { IIdentifier } from './gudid.interface'
import { EDeviceIdIssuingAgency, EDeviceIdType } from './gudid.enum'
import { gudidRepository } from './gudid.repository'

export class GUDIDService {
  extractDiAndUdi(identifiers: IIdentifier[]): {
    di: string | null
    udi: string | null
  } {
    const primary = identifiers?.find(
      (i) => i.deviceIdType === EDeviceIdType.Primary,
    )
    const udi = identifiers?.find(
      (i) => i.deviceIdIssuingAgency === EDeviceIdIssuingAgency.GS1,
    )
    return {
      di: primary?.deviceId || null,
      udi: udi?.deviceId || null,
    }
  }

  async parseAndImport(xmlPath: string) {
    return new Promise((resolve, reject) => {
      const parser = sax.createStream(true, {})
      let currentTag = ''
      let currentText = ''
      let currentDevice: any = {}
      let currentNested: any = {}
      let nestedBuffer: Record<string, any[]> = {}
      let inDevice = false
      let inNestedItem = ''

      const nsStrip = (tag: string) =>
        tag.split(':').pop()?.split('}').pop() ?? tag

      const groupMap: Record<string, string> = {
        identifier: 'identifiers',
        gmdn: 'gmdnTerms',
        fdaProductCode: 'productCodes',
        customerContact: 'contacts',
        premarketSubmission: 'premarketSubmissions',
        deviceSize: 'deviceSizes',
        storageHandling: 'environmentalConditions',
        sterilizationMethod: 'methodTypes',
      }

      const BATCH_SIZE = 200
      const limit = promiseLimit(10) // control concurrency
      const tasks: Promise<any>[] = []
      const batchBuffer: any[] = []

      parser.on('opentag', (node) => {
        const tag = nsStrip(node.name)
        currentTag = tag
        if (tag === 'device') {
          inDevice = true
          currentDevice = {}
          nestedBuffer = {}
        }
        if (inDevice && groupMap[tag]) {
          currentNested = {}
          inNestedItem = tag
        }
      })

      parser.on('text', (text) => {
        if (!inDevice || !currentTag) return
        currentText += text.trim()
      })

      parser.on('closetag', (tagName) => {
        const tag = nsStrip(tagName)
        if (!inDevice) return

        if (tag === 'device') {
          currentDevice = { ...currentDevice, ...nestedBuffer }
          const { di, udi } = this.extractDiAndUdi(currentDevice.identifiers)
          currentDevice.primaryDiNumber = di
          currentDevice.gtin = udi

          const deviceSnapshot = JSON.parse(JSON.stringify(currentDevice)) // deep clone
          batchBuffer.push(deviceSnapshot)
          if (batchBuffer.length >= BATCH_SIZE) {
            const batch = [...batchBuffer]
            batchBuffer.length = 0
            tasks.push(limit(() => gudidRepository.upsertDevices(batch)))
          }

          inDevice = false
          currentDevice = {}
          nestedBuffer = {}
          inNestedItem = ''
        } else if (tag === inNestedItem) {
          const group = groupMap[tag]
          if (!nestedBuffer[group]) nestedBuffer[group] = []
          nestedBuffer[group].push({ ...currentNested })
          currentNested = {}
          inNestedItem = ''
        } else if (inNestedItem) {
          currentNested[tag] = currentText
        } else {
          currentDevice[tag] = currentText
        }

        currentText = ''
        currentTag = ''
      })

      parser.on('end', async () => {
        try {
          if (batchBuffer.length > 0) {
            tasks.push(
              limit(() => gudidRepository.upsertDevices([...batchBuffer])),
            )
          }

          await Promise.all(tasks)
          resolve('done')
        } catch (e) {
          reject(e)
        }
      })

      parser.on('error', reject)

      fs.createReadStream(xmlPath).pipe(parser)
    })
  }

  async getByPublicDeviceRecordKey(publicDeviceRecordKey: string) {
    return await gudidRepository.findOneBy({
      publicDeviceRecordKey,
    })
  }
}
