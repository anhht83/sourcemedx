import { FDARecall } from './fdaRecall.entity'
import { IExportedFDARecall } from './fdaRecall.interface'
import { ERecallStatus } from './fdaRecall.enum'

export class FDARecallPresenter {
  static recallToExport(recall: FDARecall): IExportedFDARecall {
    return {
      cfresId: recall.cfresId,
      productResNumber: recall.productResNumber,
      eventDateInitiated: recall.eventDateInitiated,
      eventDatePosted: recall.eventDatePosted,
      recallStatus: recall.recallStatus,
      resEventNumber: recall.resEventNumber,
      productCode: recall.productCode,
      kNumbers: recall.kNumbers,
      productDescription: recall.productDescription,
      codeInfo: recall.codeInfo,
      recallingFirm: recall.recallingFirm,
      address1: recall.address1,
      city: recall.city,
      reasonForRecall: recall.reasonForRecall,
      rootCauseDescription: recall.rootCauseDescription,
      action: recall.action,
      productQuantity: recall.productQuantity,
      distributionPattern: recall.distributionPattern,
      deviceName: recall.openfda?.deviceName,
      medicalSpecialty: recall.openfda?.medicalSpecialtyDescription,
      regulationNumber: recall.openfda?.regulationNumber,
      deviceClass: recall.openfda?.deviceClass,
      contactEmail: '',
      contactPhone: '',
      website: `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfRES/res.cfm?id=${recall.cfresId}`,
      fdaReport: {
        url: `https://fda.report/Recall/${recall.cfresId}`,
        approved: recall.recallStatus !== ERecallStatus.Open,
      },
    }
  }
}
