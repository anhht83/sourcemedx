import React from 'react'
import BuyRerports from './BuyReports'

export const generateMetadata = async () => ({
  title: 'SourceMedX - Buy Reports',
  description: 'Buy Reports',
})

export default async function BuyReportsPage() {
  return <BuyRerports />
}
