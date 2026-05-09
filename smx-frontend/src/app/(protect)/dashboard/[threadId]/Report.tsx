'use client'

import { ESearchStatus } from '@/enums/chat.enum'
import { IThread } from '@/types/chat'
import React, { useMemo } from 'react'
import { useReport } from '@/hooks/useReport'
import {
  TbAlertCircleFilled,
  TbCsv,
  TbDownload,
  TbFileExcel,
  TbPdf,
} from 'react-icons/tb'
import { IReport, IReportProcess } from '@/types/report'
import Link from 'next/link'
import { getDownloadUrl } from '@/lib/getFileUrl'

type TReportProps = {
  thread: IThread
}

const Reporting = ({ report }: { report: IReportProcess }) => {
  return (
    <div className="px-8 py-4 bg-black-500 text-white font-semibold rounded-full">
      {report.message || 'Generating report...'} ({report.progress}%)
    </div>
  )
}

const FailReporting = ({ onReGenerateReport }) => {
  return (
    <div className="flex gap-1 items-center justify-center text-red-500">
      <TbAlertCircleFilled />
      An error occurred.{' '}
      <span onClick={onReGenerateReport} className=" underline cursor-pointer">
        Click here to try again.
      </span>
    </div>
  )
}

const DownloadReport = ({ reports }: { reports: IReport[] }) => {
  return (
    <div className="flex items-center justify-center gap-4">
      Your report is ready
      {reports.map((report) => (
        <Link
          className="flex gap-1 items-center justify-center bg-black-500 text-white px-4 !leading-4 font-medium font-apercu cursor-pointer hover:scale-105 rounded-full text-xl h-8 lg:h-9 border border-black-500 hover:text-black-500 hover:bg-gray-100 transition-colors duration-200"
          key={report.id}
          target="_blank"
          href={getDownloadUrl(report.fileUrl)}
        >
          <span className="underline cursor-pointer">
            {report.fileType === 'csv' && <TbCsv />}
            {report.fileType === 'xlsx' && <TbFileExcel />}
            {report.fileType === 'pdf' && <TbPdf />}
          </span>
          <TbDownload className="text-sm" />
        </Link>
      ))}
    </div>
  )
}

export function Report({ thread }: TReportProps) {
  const { reportProcess, onReGenerateReport } = useReport({ thread })

  const reports = useMemo(
    () => reportProcess?.reports || thread.reports,
    [reportProcess, thread.reports],
  )
  const isFailedReport =
    (thread?.searchStatus === ESearchStatus.completed_search &&
      !thread?.reports?.length) ||
    thread?.searchStatus === ESearchStatus.failed_search ||
    (thread?.searchStatus === ESearchStatus.searching && reportProcess?.isError)

  const isReporting =
    thread?.searchStatus === ESearchStatus.searching &&
    reportProcess &&
    !reportProcess.isCompleted

  if (isFailedReport)
    return <FailReporting onReGenerateReport={onReGenerateReport} />
  if (!isFailedReport && !isReporting && !!reports?.length)
    return <DownloadReport reports={reports} />
  if (isReporting) return <Reporting report={reportProcess} />
  return null
}
