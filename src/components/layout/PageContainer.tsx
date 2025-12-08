import { AdminSidebar } from '@/components/layout/AdminSidebar'

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'

interface PageContainerProps {
  children?: ReactNode
  title?: string
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  return (
    <SidebarProvider className="font-poppins">
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="font-bold">{title}</span>
          </div>
        </header>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/30 md:min-h-min m-4 p-4 overflow-x-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
