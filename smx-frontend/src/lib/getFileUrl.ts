export const getDownloadUrl = (fileUrl: string) => {
  return `${process.env.NEXT_PUBLIC_EXTERNAL_DOWNLOAD_URL}${fileUrl}`
}
