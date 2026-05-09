import { Report } from '../entities'
import { BaseRepository } from './base.repository'

export class ReportRepository extends BaseRepository<Report> {
  constructor() {
    super(Report)
  }
}

export const reportRepository = new ReportRepository()
