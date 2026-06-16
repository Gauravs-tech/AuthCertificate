'use client'

import React from 'react'
import { type Certificate } from '@/types'
import { Badge } from '@/components/ui/badge'

interface CertificateDetailsProps {
  certificate: Certificate
}

export function CertificateDetails({
  certificate,
}: CertificateDetailsProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)

      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const getStatusBadge = () => {
    switch (certificate.status) {
      case 'Approved':
        return (
          <Badge className="bg-green-100 text-green-700 border border-green-200 hover:bg-green-100 rounded-full px-3 py-1 font-normal text-sm">
            ✓ Approved
          </Badge>
        )

      case 'Pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 rounded-full px-3 py-1 font-normal text-sm">
            ⏳ Pending
          </Badge>
        )

      case 'Rejected':
        return (
          <Badge className="bg-red-100 text-red-700 border border-red-200 hover:bg-red-100 rounded-full px-3 py-1 font-normal text-sm">
            ✕ Rejected
          </Badge>
        )

      default:
        return null
    }
  }

  const Field = ({
    icon,
    label,
    value,
  }: {
    icon: string
    label: string
    value: React.ReactNode
  }) => (
    <div className="py-4 border-b border-gray-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[14px]">{icon}</span>

        <h4 className="text-[15px] font-medium uppercase tracking-wide text-[#222]">
          {label}
        </h4>
      </div>

      <div className="pl-6 text-[16px] text-black break-words">
        {value}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f1f1f1]  ">
      <div className="max-w-md mx-auto bg-white min-h-screen my-[30px] rounded-[10px] shadow-md">

        {/* Header */}
        <div className="bg-green-600 text-white px-4 py-4 shadow-sm rounded-[10px] ">
          <h1 className="text-[18px] font-semibold leading-snug">
            Verify Your Authenticated
            <br />
            Certificate
          </h1>
        </div>

        <div className="px-4">

          {/* Barcode Number */}
          <Field
            icon="📊"
            label="Barcode Number"
            value={certificate.barcode_number}
          />

          {/* Certificate Name */}
          <Field
            icon="📜"
            label="Certificate Name"
            value={certificate.certificate_name}
          />

          {/* Date Applied */}
          <Field
            icon="📅"
            label="Date Applied On"
            value={formatDate(certificate.date_applied)}
          />

          {/* Date Digitally Signed */}
          <Field
            icon="✅"
            label="Date Digitally Signed"
            value={
              certificate.date_digitally_signed
                ? 'Yes'
                : 'No'
            }
          />

          {/* Applicant Section */}

          <div className="my-5 bg-[#f7f9fc] border-l-4 border-green-700 rounded-md overflow-hidden">

            <div className=" rounded-l-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 text-lg">👤</span>

                <h3 className="font-semibold text-[#24554d] text-lg leading-snug">
                  Applicant & Beneficiary
                  <br />
                  Information
                </h3>
              </div>
            </div>

            <div className="px-4">

              <div className="py-4 border-b border-gray-300">
                <h4 className="text-[15px] font-medium uppercase text-[#222] mb-2">
                  Applicant Name
                </h4>

                <p className="text-[16px] text-[#333]">
                  {certificate.applicant_name}
                </p>
              </div>

              <div className="py-4">
                <h4 className="text-[15px] font-medium uppercase text-[#222] mb-2">
                  Beneficiary Name
                </h4>

                <p className="text-[16px] text-[#24554d] font-medium">
                  {certificate.beneficiary_name}
                </p>
              </div>

              <hr className="border-gray-300 mt-1 mb-3 border" />

            </div>
          </div>

          {/* Designation */}

          <Field
            icon="🏢"
            label="Designation Of Signatory"
            value={certificate.designation_of_signatory}
          />

          {/* Taluka */}

          <Field
            icon="📍"
            label="Taluka Of Signatory"
            value={
              <span className="font-semibold">
                {certificate.taluka_of_signatory}
              </span>
            }
          />

          {/* District */}

          <Field
            icon="🏛️"
            label="District Of Signatory"
            value={
              <span className="font-semibold">
                {certificate.district_of_signatory}
              </span>
            }
          />

          {/* Status */}

          <div className="py-4 border-b border-gray-300">
            <div className="flex items-center gap-2 mb-3">
              <span>📌</span>

              <h4 className="text-[15px] font-medium uppercase text-[#222]">
                Status
              </h4>
            </div>

            <div className="pl-6">
              {getStatusBadge()}
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  )
}