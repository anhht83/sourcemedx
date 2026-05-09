import { Request, Response, NextFunction } from 'express'
import { GUDIDUseCase } from '../../libs/gudid/gudid.usecase'
import { DeviceUseCase } from '../usecases/device.usecase'
import { FDARecallUseCase } from '../../libs/fdaRecall'

export class DataController {
  deviceUseCase: DeviceUseCase
  gudidUseCase: GUDIDUseCase
  fdaRecallUseCase: FDARecallUseCase

  constructor() {
    this.deviceUseCase = new DeviceUseCase()
    this.gudidUseCase = new GUDIDUseCase()
    this.fdaRecallUseCase = new FDARecallUseCase()
  }

  syncGUDID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.gudidUseCase.syncData(req.body.fileUrl)
      res.json('done')
    } catch (error) {
      next(error)
    }
  }

  searchGUDIDDevicesByKeywords = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const devices = await this.deviceUseCase.searchByKeywords(req.body)
      res.json(devices)
    } catch (error) {
      next(error)
    }
  }

  syncFDARecall = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.fdaRecallUseCase.syncData(req.body.fileUrl)
      res.json('done')
    } catch (error) {
      next(error)
    }
  }

  searchFDARecallByKeywords = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recalls = await this.fdaRecallUseCase.searchByKeywords(req.body)
      res.json(recalls)
    } catch (error) {
      next(error)
    }
  }
}
