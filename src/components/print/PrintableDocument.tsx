'use client'

import Image from 'next/image'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'
import { useState, ReactElement } from 'react'
import { Button } from '@/components/ui/button'
import { usePagination } from '@/lib/print/usePagination'

const PX_PER_IN = 96

interface PrintableDocumentProps {
  blocks: ReactElement[]
  headerSrc: string
  footerSrc: string
  docName?: string // e.g. "Audit", used in file name
  gapPx?: number // default 16
  includeIntroReserve?: boolean
  introContent?: ReactElement
  breakBefore?: boolean[]
  headerHeightIn?: number // optional: override header height in inches (default 1)
  footerHeightIn?: number // optional: override footer height in inches (default 1)
  pageWidthIn?: number // optional: override page width in inches (default 8.5 Letter)
  pageHeightIn?: number // optional: override page height in inches (default 11 Letter)
  contentPaddingTopIn?: number // optional: top padding inside body in inches (default 1)
  contentPaddingXIn?: number // optional: horizontal padding inside body in inches (default 1)
}

export default function PrintableDocument({
  blocks,
  headerSrc,
  footerSrc,
  docName = 'Document',
  gapPx = 16,
  includeIntroReserve = false,
  introContent,
  breakBefore,
  headerHeightIn = 1,
  footerHeightIn = 1,
  pageWidthIn = 8.5,
  pageHeightIn = 11,
  contentPaddingTopIn = 1,
  contentPaddingXIn = 1
}: PrintableDocumentProps) {
  const [loading, setLoading] = useState(false)
  const bodyPx = (pageHeightIn - headerHeightIn - footerHeightIn) * PX_PER_IN
  const { pages, ready, Measure } = usePagination({
    nodes: blocks,
    gapPx,
    bodyPx,
    includeIntro: includeIntroReserve,
    introContent,
    breakBefore
  })

  const handleExport = async () => {
    try {
      setLoading(true)
      const pageEls = document.querySelectorAll('.page')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: [pageWidthIn, pageHeightIn], compress: true })
      for (let i = 0; i < pageEls.length; i++) {
        const page = pageEls[i] as HTMLElement
        const dpr = Math.max(2, Math.floor(window.devicePixelRatio || 2))
        const canvas = await html2canvas(page, { scale: dpr })
        const imgData = canvas.toDataURL('image/png')
        const pdfW = pdf.internal.pageSize.getWidth()
        const pdfH = pdf.internal.pageSize.getHeight()
        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
      }
      const now = new Date()
      const tanggal = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      pdf.save(`${docName}_${tanggal}.pdf`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded font-poppins m-4" disabled={loading || !ready}>
        {loading ? 'Sedang memproses...' : 'Unduh Surat'}
      </Button>

      {!ready && <Measure />}

      <div className="flex flex-col gap-8 justify-start items-center p-4 bg-muted print:p-0 print:bg-white">
        {ready &&
          pages.map((page, pageIndex) => (
            <table
              key={pageIndex}
              className="page bg-white text-foreground shadow-lg rounded table-fixed print:shadow-none print:rounded-none overflow-hidden"
              style={{ width: `${pageWidthIn}in`, height: `${pageHeightIn}in` }}
            >
              <thead className="print:table-header-group">
                <tr>
                  <td className="p-0">
                    <div className="relative w-full overflow-hidden" style={{ height: `${headerHeightIn}in` }}>
                      <Image src={headerSrc} alt="Header" fill className="object-cover" priority={pageIndex === 0} />
                    </div>
                  </td>
                </tr>
              </thead>

              <tbody className="align-top">
                <tr>
                  <td
                    className="align-top text-sm leading-normal print:text-sm"
                    style={{ padding: `${contentPaddingTopIn}in ${contentPaddingXIn}in` }}
                  >
                    <div className="max-w-none print:max-w-none">
                      {page.nodes.map((n, i) => (
                        <div key={i} style={i === 0 ? undefined : { marginTop: gapPx }}>
                          {n}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>

              <tfoot className="print:table-footer-group">
                <tr>
                  <td className="p-0">
                    <div className="relative w-full overflow-hidden" style={{ height: `${footerHeightIn}in` }}>
                      <Image src={footerSrc} alt="Footer" fill className="object-cover" />
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          ))}
      </div>
    </>
  )
}
