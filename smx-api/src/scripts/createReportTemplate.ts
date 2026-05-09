import ExcelJS from 'exceljs'
import { getPublicFilePath } from '../utils/getPublicPath'

async function createReportTemplate() {
  const workbook = new ExcelJS.Workbook()

  // Create Devices worksheet
  const devicesSheet = workbook.addWorksheet('Devices')

  // Add headers for Devices (starting from row 1)
  devicesSheet.getCell('A1').value = 'Product Name'
  devicesSheet.getCell('B1').value = 'Product Description'
  devicesSheet.getCell('C1').value = 'Manufacturer/Supplier Name'
  devicesSheet.getCell('D1').value = 'Contact Email'
  devicesSheet.getCell('E1').value = 'Contact Phone'
  devicesSheet.getCell('F1').value = 'Website'

  // Style the Devices header row
  const devicesHeaderRow = devicesSheet.getRow(1)
  devicesHeaderRow.font = { bold: true }
  devicesHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  }

  // Set column widths for Devices
  devicesSheet.getColumn('A').width = 30
  devicesSheet.getColumn('B').width = 40
  devicesSheet.getColumn('C').width = 30
  devicesSheet.getColumn('D').width = 25
  devicesSheet.getColumn('E').width = 15
  devicesSheet.getColumn('F').width = 30

  // Create FDA Recalls worksheet
  const fdaRecallsSheet = workbook.addWorksheet('FDA Recalls')

  // Add headers for FDA Recalls
  const fdaHeaders = [
    'CFRES ID',
    'Product Res Number',
    'Event Date Initiated',
    'Event Date Posted',
    'Recall Status',
    'Product Description',
    'Code Info',
    'Recalling Firm',
    'Address',
    'City',
    'Reason for Recall',
    'Root Cause',
    'Action',
    'Product Quantity',
    'Distribution Pattern',
    'Device Name',
    'Medical Specialty',
    'Regulation Number',
    'Device Class',
  ]

  fdaHeaders.forEach((header, index) => {
    const cell = fdaRecallsSheet.getCell(1, index + 1)
    cell.value = header
  })

  // Style the FDA Recalls header row
  const fdaHeaderRow = fdaRecallsSheet.getRow(1)
  fdaHeaderRow.font = { bold: true }
  fdaHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  }

  // Set column widths for FDA Recalls
  const fdaColumnWidths = [
    15, 20, 15, 15, 15, 40, 20, 30, 30, 15, 40, 40, 30, 15, 25, 30, 20, 15, 15,
  ]
  fdaColumnWidths.forEach((width, index) => {
    fdaRecallsSheet.getColumn(index + 1).width = width
  })

  // Save the template
  const templatePath = getPublicFilePath(
    'report_devices_with_fda.xlsx',
    'templates',
  )
  await workbook.xlsx.writeFile(templatePath)

  console.log(`Template created at: ${templatePath}`)
}

// Run the script
createReportTemplate().catch(console.error)
