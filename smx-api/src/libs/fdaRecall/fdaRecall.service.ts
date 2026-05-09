import fs from 'fs'
import promiseLimit from 'promise-limit'
import { parser } from 'stream-json'
import { streamArray } from 'stream-json/streamers/StreamArray'
import { pick } from 'stream-json/filters/Pick'
import { IFDARecall } from './fdaRecall.interface'
import { fdaRecallRepository } from './fdaRecall.repository'

export class FDARecallService {
  async parseAndImport(jsonPath: string) {
    try {
      console.log(`Starting FDA Recall data sync from ${jsonPath}...`)

      // Check if file exists
      if (!fs.existsSync(jsonPath)) {
        throw new Error(`File not found: ${jsonPath}`)
      }

      // Truncate existing data before importing new data
      await fdaRecallRepository.truncateAll()

      // Read the entire file first for smaller files, or use streaming for large files
      const fileStats = fs.statSync(jsonPath)
      const fileSizeInMB = fileStats.size / (1024 * 1024)

      console.log(`File size: ${fileSizeInMB.toFixed(2)} MB`)

      if (fileSizeInMB > 100) {
        // For very large files, use stream-json
        console.log('Large file detected, using stream-json...')
        await this.processLargeFileWithStreamJson(jsonPath)
      } else {
        // For smaller files, read the entire file
        console.log('Reading entire file...')
        const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
        await this.processJsonContent(jsonContent)
      }

      console.log('FDA Recall data import completed successfully.')
    } catch (error) {
      console.error('Error parsing FDA Recall data:', error)
      throw error
    }
  }

  private async processLargeFileWithStreamJson(
    filePath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let processedCount = 0
      const BATCH_SIZE = 100
      const batchBuffer: IFDARecall[] = []
      const limit = promiseLimit(5)
      const tasks: Promise<any>[] = []

      const processBatch = async () => {
        if (batchBuffer.length > 0) {
          const batch = [...batchBuffer]
          batchBuffer.length = 0
          tasks.push(limit(() => fdaRecallRepository.upsertRecalls(batch)))
        }
      }

      // Create the streaming pipeline using stream-json without stream-chain
      const fileStream = fs.createReadStream(filePath)
      const jsonParser = parser()
      const resultsPicker = pick({ filter: 'results' })
      const arrayStreamer = streamArray()

      // Chain the streams manually
      fileStream.pipe(jsonParser).pipe(resultsPicker).pipe(arrayStreamer)

      arrayStreamer.on('data', async ({ value }: { value: any }) => {
        try {
          const transformedRecall = this.transformRecallData(value)
          batchBuffer.push(transformedRecall)
          processedCount++

          if (processedCount % 1000 === 0) {
            console.log(`Processed ${processedCount} records...`)
          }

          if (batchBuffer.length >= BATCH_SIZE) {
            await processBatch()
          }
        } catch (error) {
          console.warn('Failed to transform recall:', error)
          // Continue processing
        }
      })

      arrayStreamer.on('end', async () => {
        try {
          // Process any remaining items
          await processBatch()

          // Wait for all tasks to complete
          await Promise.all(tasks)

          console.log(`Successfully processed ${processedCount} recall records`)
          resolve()
        } catch (error) {
          reject(error)
        }
      })

      arrayStreamer.on('error', (error: any) => {
        console.error('Stream-json error:', error)
        reject(error)
      })

      // Handle errors from other streams
      fileStream.on('error', (error: any) => {
        console.error('File stream error:', error)
        reject(error)
      })

      jsonParser.on('error', (error: any) => {
        console.error('JSON parser error:', error)
        reject(error)
      })

      resultsPicker.on('error', (error: any) => {
        console.error('Results picker error:', error)
        reject(error)
      })
    })
  }

  private async processJsonContent(jsonContent: string): Promise<void> {
    // Check content length and first/last characters
    console.log(`Content length: ${jsonContent.length} characters`)
    console.log(`First 100 characters: ${jsonContent.substring(0, 100)}`)
    console.log(
      `Last 100 characters: ${jsonContent.substring(jsonContent.length - 100)}`,
    )

    // Check for encoding issues
    const hasBOM = jsonContent.charCodeAt(0) === 0xfeff
    console.log(`Has BOM: ${hasBOM}`)

    // Clean the entire JSON first
    console.log('Cleaning JSON format...')
    jsonContent = this.cleanJsonString(jsonContent)

    // Check if the cleaned content looks like valid JSON
    console.log(
      `After cleaning - First 200 characters: ${jsonContent.substring(0, 200)}`,
    )
    console.log(
      `After cleaning - Last 200 characters: ${jsonContent.substring(jsonContent.length - 200)}`,
    )

    // Try to find the start of the JSON object
    const firstBraceIndex = jsonContent.indexOf('{')
    const firstBracketIndex = jsonContent.indexOf('[')

    console.log(`First { at index: ${firstBraceIndex}`)
    console.log(`First [ at index: ${firstBracketIndex}`)

    if (firstBraceIndex === -1 && firstBracketIndex === -1) {
      throw new Error('No valid JSON structure found in file')
    }

    // Parse the entire JSON
    console.log('Attempting to parse JSON...')
    let data: any

    try {
      data = JSON.parse(jsonContent)
    } catch (parseError: any) {
      console.error('JSON parse error details:', parseError)

      // Try to find the problematic area
      const errorMessage = parseError.message
      const match = errorMessage.match(/position (\d+)/)
      if (match) {
        const position = parseInt(match[1])
        const start = Math.max(0, position - 50)
        const end = Math.min(jsonContent.length, position + 50)
        console.error(`Error around position ${position}:`)
        console.error(`Context: ${jsonContent.substring(start, end)}`)
      }

      throw parseError
    }

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error(
        'Invalid JSON structure: missing or invalid results array',
      )
    }

    console.log(`Found ${data.results.length} recall records`)
    console.log(`Meta: ${data.meta?.results?.total || 0} total records`)

    const BATCH_SIZE = 100
    const limit = promiseLimit(5)
    const tasks: Promise<any>[] = []
    const batchBuffer: IFDARecall[] = []

    for (const recall of data.results) {
      try {
        const transformedRecall = this.transformRecallData(recall)
        batchBuffer.push(transformedRecall)

        if (batchBuffer.length >= BATCH_SIZE) {
          const batch = [...batchBuffer]
          batchBuffer.length = 0
          tasks.push(limit(() => fdaRecallRepository.upsertRecalls(batch)))
        }
      } catch (error) {
        console.warn('Failed to transform recall:', error)
        continue
      }
    }

    // Process remaining items
    if (batchBuffer.length > 0) {
      tasks.push(
        limit(() => fdaRecallRepository.upsertRecalls([...batchBuffer])),
      )
    }

    await Promise.all(tasks)
    console.log(
      `FDA Recall data import completed successfully. Processed ${data.results.length} records.`,
    )
  }

  private cleanJsonString(jsonStr: string): string {
    console.log('Cleaning JSON string...')

    // Remove BOM characters
    jsonStr = jsonStr.replace(/^\uFEFF/, '')

    // Remove trailing commas before closing braces and brackets
    jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1')

    // Fix empty strings with quotes
    jsonStr = jsonStr.replace(/""/g, '""')

    // Remove extra whitespace and newlines in arrays
    jsonStr = jsonStr.replace(/,\s*\n\s*/g, ', ')

    // Fix common malformed strings
    jsonStr = jsonStr.replace(/,\s*,/g, ',') // Remove double commas
    jsonStr = jsonStr.replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
    jsonStr = jsonStr.replace(/,\s*]/g, ']') // Remove trailing commas before closing brackets

    // Remove any null bytes or other control characters
    jsonStr = jsonStr.replace(/\x00/g, '')

    // Trim whitespace
    jsonStr = jsonStr.trim()

    console.log('JSON cleaning completed')
    return jsonStr
  }

  private cleanJsonObject(objectStr: string): string {
    // Remove trailing commas before closing braces
    objectStr = objectStr.replace(/,(\s*})/g, '$1')

    // Remove any null bytes or control characters
    objectStr = objectStr.replace(/\x00/g, '')

    // Trim whitespace
    objectStr = objectStr.trim()

    return objectStr
  }

  private transformRecallData(recall: any): IFDARecall {
    return {
      cfresId: recall.cfres_id,
      productResNumber: recall.product_res_number,
      eventDateInitiated: recall.event_date_initiated,
      eventDatePosted: recall.event_date_posted,
      recallStatus: recall.recall_status,
      resEventNumber: recall.res_event_number,
      productCode: recall.product_code,
      kNumbers: recall.k_numbers,
      productDescription: recall.product_description,
      codeInfo: recall.code_info,
      recallingFirm: recall.recalling_firm,
      address1: recall.address_1,
      city: recall.city,
      reasonForRecall: recall.reason_for_recall,
      rootCauseDescription: recall.root_cause_description,
      action: recall.action,
      productQuantity: recall.product_quantity,
      distributionPattern: recall.distribution_pattern,
      openfda: recall.openfda
        ? {
            kNumber: recall.openfda.k_number,
            registrationNumber: recall.openfda.registration_number,
            feiNumber: recall.openfda.fei_number,
            deviceName: recall.openfda.device_name,
            medicalSpecialtyDescription:
              recall.openfda.medical_specialty_description,
            regulationNumber: recall.openfda.regulation_number,
            deviceClass: recall.openfda.device_class,
          }
        : undefined,
    }
  }

  async getByCfresId(cfresId: string) {
    return await fdaRecallRepository.getByCfresId(cfresId)
  }

  async searchByKeywords(keywords: string[]) {
    return await fdaRecallRepository.searchByKeywords(keywords)
  }
}
