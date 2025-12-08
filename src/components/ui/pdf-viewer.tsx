// simpan sebagai: components/PdfViewer.tsx
'use client'

import { Button } from './button'
import * as pdfjsLib from 'pdfjs-dist'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

// Konfigurasi worker PDF.js (sesuai versi yang Anda inginkan)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js`

interface PdfViewerProps {
  fileUrl?: string
  fileBlob?: Blob
  initialScale?: number
  className?: string
}

export function PdfViewer({ fileUrl, fileBlob, initialScale = 1.5, className }: PdfViewerProps) {
  // State untuk menyimpan objek dokumen PDF setelah dimuat
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)

  // State untuk navigasi dan tampilan
  const [pageNum, setPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(initialScale)

  // State untuk status loading dan error
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPageRendering, setIsPageRendering] = useState(false)

  // Ref untuk menunjuk ke elemen canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  type RenderTask = { cancel: () => void; promise: Promise<void> }
  const renderTaskRef = useRef<RenderTask | null>(null)

  // Fungsi untuk me-load dokumen PDF dari URL
  const loadPdfDocument = useCallback(async () => {
    if (!fileUrl && !fileBlob) {
      setError('Sumber PDF tidak tersedia.')
      return
    }

    setLoading(true)
    setError(null)
    setPdfDoc(null) // Reset dokumen sebelumnya

    try {
      const loadingTask = fileBlob
        ? pdfjsLib.getDocument({ data: new Uint8Array(await fileBlob.arrayBuffer()) })
        : pdfjsLib.getDocument(fileUrl as string)
      const loadedPdfDoc = await loadingTask.promise
      setPdfDoc(loadedPdfDoc)
      setNumPages(loadedPdfDoc.numPages)
      setPageNum(1) // Selalu mulai dari halaman pertama
    } catch (err) {
      console.error('Error loading PDF:', err)
      setError(`Gagal memuat PDF: ${err instanceof Error ? err.message : 'Unknown error'}. Pastikan URL valid dan mendukung CORS.`)
    } finally {
      setLoading(false)
    }
  }, [fileUrl, fileBlob])

  // Auto-load when fileUrl changes
  useEffect(() => {
    loadPdfDocument()
  }, [loadPdfDocument])

  // useEffect untuk merender halaman PDF ke canvas
  // Effect ini akan berjalan setiap kali dokumen, nomor halaman, atau skala berubah
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return
    // Wait for a measured width to avoid tiny initial renders
    const measuredWidth = wrapperRef.current?.clientWidth ?? 0
    if (measuredWidth <= 0) return

    const renderPage = async () => {
      // Cancel any in-flight render on the same canvas
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel()
        } catch {}
        renderTaskRef.current = null
      }
      setIsPageRendering(true)
      const page = await pdfDoc.getPage(pageNum)
      const rotation = (page.rotate || 0) % 360
      // Fit-to-width scale based on current wrapper width
      const baseViewport = page.getViewport({ scale: 1, rotation })
      const fallbackParentWidth = canvasRef.current ? canvasRef.current.parentElement?.clientWidth : undefined
      const available = wrapperRef.current?.clientWidth ?? fallbackParentWidth ?? 800
      const fitScale = Math.max(0.1, available / baseViewport.width)
      const effectiveScale = fitScale * scale
      const viewport = page.getViewport({ scale: effectiveScale, rotation })

      const canvas = canvasRef.current!
      const context = canvas.getContext('2d')
      if (!context) return

      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      try {
        const task = page.render(renderContext) as unknown as RenderTask
        renderTaskRef.current = task
        await task.promise
      } catch {
        // Ignore cancellation errors
        // console.debug('Render cancelled', e)
      } finally {
        if (renderTaskRef.current) {
          renderTaskRef.current = null
        }
        setIsPageRendering(false)
      }
    }

    renderPage()
  }, [pdfDoc, pageNum, scale, containerWidth])

  // Observe wrapper size and update containerWidth to trigger re-render on resize
  useEffect(() => {
    if (!wrapperRef.current) return
    const el = wrapperRef.current
    setContainerWidth(el.clientWidth)
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        setContainerWidth((prev) => (Math.abs(prev - width) > 0.5 ? width : prev))
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Handler untuk tombol navigasi
  const handlePrevPage = () => setPageNum((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () => setPageNum((prev) => Math.min(prev + 1, numPages))
  const handleZoomIn = () => setScale((prev) => prev + 0.2)
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5))

  return (
    <div className={`w-full h-full rounded-xl bg-white overflow-hidden flex flex-col ${className ?? ''}`}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={!pdfDoc || isPageRendering}>
            <ZoomOut className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-center">{(scale * 100).toFixed(0)}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={!pdfDoc || isPageRendering}>
            <ZoomIn className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handlePrevPage} disabled={pageNum <= 1 || !pdfDoc || isPageRendering}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[70px] text-center">
            {pdfDoc ? `${pageNum} / ${numPages}` : '...'}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={pageNum >= numPages || !pdfDoc || isPageRendering}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Opsional: Tombol refresh atau lainnya */}
        {/* <Button variant="ghost" size="icon" onClick={loadPdfDocument} disabled={loading}>
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </Button> */}
      </div>

      {/* Status */}
      {loading && <div className="p-3 text-sm text-muted-foreground">Loading PDF...</div>}
      {error && <div className="p-3 text-sm text-red-600">{error}</div>}

      {/* Canvas */}
      <div ref={wrapperRef} className="flex-1 min-h-0 p-3 overflow-auto">
        <div className="mx-auto">
          <canvas ref={canvasRef} className="border rounded shadow-sm max-w-full h-auto" />
        </div>
      </div>
    </div>
  )
}
