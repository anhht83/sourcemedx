import { Worker } from 'bullmq'
import { redisConnection } from '../../../configs/redis'
import { EQueueName } from '../../enums/queu.enum'
import { Server as SocketServer } from 'socket.io'
import { ESocketEvent } from '../../enums/socket.enum'
import { ThreadUseCase } from '../../usecases/thread.usecase'
import { IReportProcess } from '../../interfaces/report.interface'
import { EReportType } from '../../enums/report.enum'
import { IExportedFile } from '../../../libs/xfile/xfile.interface'
import { XExportReportService } from '../../../libs/xfile/xexportReport.service'
import { DeviceUseCase } from '../../usecases/device.usecase'
import { FDARecallUseCase } from '../../../libs/fdaRecall'

export const reportWorker = (io: SocketServer) => {
  const threadUseCase = new ThreadUseCase()
  const worker = new Worker(
    EQueueName.report_queue,
    async (job: any): Promise<IReportProcess | undefined> => {
      try {
        const deviceUseCase = new DeviceUseCase()
        const fdaRecallUseCase = new FDARecallUseCase()

        const { thread } = job.data
        if (!thread.context?.specifications?.length) return

        console.log(`Report started for: ${thread.title}`)

        io.to(thread.id).emit(ESocketEvent.reportProgress, {
          progress: 10,
          message: 'Searching data...',
        } as IReportProcess)
        const devices = await deviceUseCase.searchByKeywords(thread.context)

        // If no data found
        if (!devices.length) {
          // Reset search
          await threadUseCase.resetSearch(job.data.thread.id)
          return {
            progress: 100,
            isCompleted: true,
            isSuccess: false,
            isError: true,
            message: 'No data found.',
          } as IReportProcess
        }
        io.to(thread.id).emit(ESocketEvent.reportProgress, {
          progress: 50,
          message: `Searched ${devices.length} products`,
        } as IReportProcess)

        const fdaRecalls = await fdaRecallUseCase.searchByKeywords(
          thread.context.specifications,
        )
        io.to(thread.id).emit(ESocketEvent.reportProgress, {
          progress: 80,
          message: `Searched ${fdaRecalls.length} FDA Recalls. Generating report...`,
        } as IReportProcess)

        const fileName = `SourceMedX_Devices_Long_List_${thread.id}`
        const exportedFiles: IExportedFile[] =
          await XExportReportService.exportToFiles({
            fileName,
            format: ['xlsx', 'csv'],
            devices,
            fdaRecalls,
          })
        const reports = await threadUseCase.storeReportFiles({
          threadId: job.data.thread.id,
          files: [...exportedFiles],
          reportType: EReportType.long_list,
        })

        // Update thread status to completed
        await threadUseCase.completeSearch(job.data.thread.id)

        // Job completed (100%)
        return {
          progress: 100,
          isCompleted: true,
          isSuccess: true,
          message: 'completed',
          reports,
        } as IReportProcess
      } catch (error) {
        console.error('Error in report worker:', error)
        return {
          progress: 100,
          isCompleted: true,
          isSuccess: false,
          isError: true,
          message: 'failed',
          reports: [],
        } as IReportProcess
      }
    },
    { connection: redisConnection },
  )

  worker.on('progress', (job, progress) => {
    console.log('progress', progress)
  })
  worker.on('completed', async (job, result) => {
    io.to(job.data.thread.id).emit(ESocketEvent.reportProgress, result)
  })
}
