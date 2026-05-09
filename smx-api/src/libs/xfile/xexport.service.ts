import ExcelJS from 'exceljs'
import { getPublicFilePath, getPublicFileUrl } from '../../utils/getPublicPath'
import { IExportOptions } from './xfile.interface'

export class XExportService {
  static exportFolder = 'export'

  static getExportFilePath = (fileName: string) =>
    getPublicFilePath(fileName, this.exportFolder)

  static getExportFileUrl = (fileName: string) =>
    getPublicFileUrl(fileName, this.exportFolder)

  static escapeForCSV = (value: any): string => {
    let str = ''

    if (Array.isArray(value)) {
      str = value.join(', ') // still semicolon-separated
    } else if (typeof value === 'object' && value !== null) {
      str = JSON.stringify(value)
    } else {
      str = String(value ?? '')
    }
    const hasSpecialChars = /[;\r\n]/.test(str)

    if (hasSpecialChars) {
      // Escape double quotes inside the value only once
      str = str.replace(/"/g, '""')
    }

    return str
  }

  static cleanedData = (data: any) =>
    data.map((row: any) => {
      const flat: Record<string, string> = {}
      for (const key in row) {
        flat[key] = this.escapeForCSV(row[key])
      }
      return flat
    })

  static async exportToExcel({
    fileName,
    format = 'csv',
    template,
    writeData,
  }: IExportOptions): Promise<string> {
    const filePath = this.getExportFilePath(fileName)
    const workbook = new ExcelJS.Workbook()
    const workbookType = format as 'csv' | 'xlsx'
    let sheet
    if (template?.path) {
      await workbook[workbookType].readFile(template?.path)
      sheet = workbook.getWorksheet(template?.worksheet)
    } else {
      sheet = workbook.addWorksheet('Devices')
    }

    if (sheet) {
      if (format === 'csv') {
        writeData(sheet, {
          cleanedData: this.cleanedData,
        })
        await workbook.csv.writeFile(filePath, {
          formatterOptions: { delimiter: ';' },
        })
      } else {
        // For xlsx format, pass the workbook to allow adding multiple worksheets
        writeData(workbook)
        // Save to a new file
        await workbook.xlsx.writeFile(filePath)
      }
    }
    return this.getExportFileUrl(fileName)
  }
}
