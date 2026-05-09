import { IExportedFile, IExportReportOptions } from './xfile.interface'

import { XExportService } from './xexport.service'
import { getPublicFilePath } from '../../utils/getPublicPath'
import { cleanTextForExcel } from '../../utils/cleanTextForExcel'

export class XExportReportService {
  static async exportToFiles(
    props: IExportReportOptions,
  ): Promise<IExportedFile[]> {
    const { devices, fdaRecalls } = props
    const formats = Array.isArray(props.format) ? props.format : [props.format]
    // Store each fileUrl as a separate report entry
    const exportedFiles: IExportedFile[] = []
    let fileUrl = ''
    for (const format of formats) {
      const fileName = `${props.fileName}.${format}`.replace(
        `.${format}.${format}`,
        `.${format}`,
      )
      switch (format) {
        case 'csv':
          fileUrl = await XExportService.exportToExcel({
            fileName,
            format,
            writeData: (worksheetOrWorkbook: any, options) => {
              // For csv, we get the worksheet
              const sheet = worksheetOrWorkbook
              const { cleanedData } = options || {}
              // Define headers
              sheet.columns = [
                { key: 'productName', header: 'Product name' },
                {
                  key: 'productDescription',
                  header: 'Product Description',
                },
                {
                  key: 'companyName',
                  header: 'Manufacturer/supplier Name',
                },
                { key: 'contactEmail', header: 'Contact Email' },
                { key: 'contactPhone', header: 'Contact Phone' },
                { key: 'website', header: 'Website' },
              ]
              // Add rows
              sheet.addRows(cleanedData ? cleanedData(devices) : devices)
            },
          })
          if (fileUrl) {
            exportedFiles.push({
              fileName,
              fileUrl,
              fileType: format,
            })
          }
          break
        case 'xlsx':
          fileUrl = await XExportService.exportToExcel({
            fileName,
            format,
            template: {
              path: getPublicFilePath('report_devices.xlsx', 'templates'),
              worksheet: 'Devices',
            },
            writeData: (worksheetOrWorkbook: any) => {
              // For xlsx, we get the workbook
              const workbook = worksheetOrWorkbook
              // Write devices data to the existing sheet
              const devicesSheet = workbook.getWorksheet('Devices')
              if (devicesSheet) {
                devices.forEach((item: any, index: number) => {
                  const row = devicesSheet.getRow(index + 3)
                  row.getCell(1).value = cleanTextForExcel(item.productName)
                  row.getCell(2).value = cleanTextForExcel(
                    item.productDescription,
                  )
                  row.getCell(3).value = cleanTextForExcel(item.companyName)
                  row.getCell(4).value = cleanTextForExcel(item.contactEmail)
                  row.getCell(5).value = cleanTextForExcel(item.contactPhone)
                  row.getCell(6).value = cleanTextForExcel(item.website)
                  row.commit()
                })
              }

              // Add FDA Recalls worksheet if fdaRecalls data exists
              const fdaRecallsSheet = workbook.getWorksheet('FDA Recalls')
              if (fdaRecallsSheet && fdaRecalls && fdaRecalls.length > 0) {
                // Add FDA recalls data using the same pattern as devices
                fdaRecalls.forEach((recall: any, index: number) => {
                  const row = fdaRecallsSheet.getRow(index + 2) // Start from row 2
                  row.getCell(1).value = cleanTextForExcel(recall.cfresId)
                  row.getCell(2).value = cleanTextForExcel(
                    recall.productResNumber,
                  )
                  row.getCell(3).value = cleanTextForExcel(
                    recall.eventDateInitiated,
                  )
                  row.getCell(4).value = cleanTextForExcel(
                    recall.eventDatePosted,
                  )
                  row.getCell(5).value = cleanTextForExcel(recall.recallStatus)
                  row.getCell(6).value = cleanTextForExcel(
                    recall.productDescription,
                  )
                  row.getCell(7).value = cleanTextForExcel(recall.codeInfo)
                  row.getCell(8).value = cleanTextForExcel(recall.recallingFirm)
                  row.getCell(9).value = cleanTextForExcel(recall.address1)
                  row.getCell(10).value = cleanTextForExcel(recall.city)
                  row.getCell(11).value = cleanTextForExcel(
                    recall.reasonForRecall,
                  )
                  row.getCell(12).value = cleanTextForExcel(
                    recall.rootCauseDescription,
                  )
                  row.getCell(13).value = cleanTextForExcel(recall.action)
                  row.getCell(14).value = cleanTextForExcel(
                    recall.productQuantity,
                  )
                  row.getCell(15).value = cleanTextForExcel(
                    recall.distributionPattern,
                  )
                  row.getCell(16).value = cleanTextForExcel(recall.deviceName)
                  row.getCell(17).value = cleanTextForExcel(
                    recall.medicalSpecialty,
                  )
                  row.getCell(18).value = cleanTextForExcel(
                    recall.regulationNumber,
                  )
                  row.getCell(19).value = cleanTextForExcel(recall.deviceClass)
                  row.commit()
                })
              }
            },
          })
          if (fileUrl) {
            exportedFiles.push({
              fileName,
              fileUrl,
              fileType: format,
            })
          }
          break
      }
    }

    return exportedFiles
  }
}
