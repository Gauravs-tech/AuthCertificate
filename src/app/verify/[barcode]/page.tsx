import { redirect } from 'next/navigation'

interface VerifyParams {
  params: Promise<{ barcode: string }>
}

export default async function VerifyCertificatePage({ params }: VerifyParams) {
  const { barcode } = await params
  const decodedBarcode = decodeURIComponent(barcode).trim()

  // Redirect the legacy route to the new query-parameter-based route format
  redirect(`/Views/SearchBarCode/DisplayBarCodeData?deptName=Revenue&serviceId=2236&barCode=${decodedBarcode}`)
}
