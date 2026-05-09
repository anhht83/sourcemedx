import React from 'react'
import { WrapperPage } from '@/app/(protect)/dashboard/[threadId]/WrapperPage'

type TThreadPageProps = {
  params: Promise<{ threadId: string }>
}

export const generateMetadata = () => ({
  title: 'SourceMedX - Dashboard',
})
export default async function ThreadPage({ params }: TThreadPageProps) {
  const { threadId } = await params
  return <WrapperPage threadId={threadId} />
}
