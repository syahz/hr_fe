'use client'

import { useAuth } from '@/context/AuthContext'
import * as React from 'react'
import Image from 'next/image'
import { NavUsers } from '@/components/layout/NavUser'
import { NavAdmins } from '@/components/layout/NavAdmin'
import { NavProfile } from '@/components/layout/NavProfile'
import { Home, Users, ShieldCheck, LayoutDashboard, University, UserRoundCheck } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton, SidebarRail, useSidebar } from '@/components/ui/sidebar'
import { USER_ROLES } from '@/config/roles'

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { state } = useSidebar()
  if (!user) {
    return null
  }
  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: '/avatars/shadcn.jpg'
    },

    items: [
      {
        name: 'Dashboard',
        url: '/admin',
        icon: Home
      },
      {
        name: 'Dashboard SLA',
        url: '/admin/dashboard-ho',
        icon: UserRoundCheck
      },
      {
        name: 'Users',
        url: '/admin/participants',
        icon: Users
      },
      {
        name: 'Units',
        url: '/admin/units',
        icon: Home
      },
      {
        name: 'Roles & Permissions',
        url: '/admin/roles',
        icon: ShieldCheck
      },
      {
        name: 'Divisions',
        url: '/admin/divisions',
        icon: University
      }
    ],
    useritems: [
      {
        name: 'Dashboard',
        url: '/user',
        icon: LayoutDashboard
      }
    ]
  }
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-none data-[state=open]:text-sidebar-accent-foreground">
          <div className="flex aspect-square size-10 items-center justify-center">
            <Image
              src="/img/SidebarLogosWhite.svg"
              alt="Sidebar Logos"
              width={state === 'collapsed' ? 24 : 90}
              height={state === 'collapsed' ? 24 : 90}
            />
          </div>
          <div className="grid">
            <Image src="/img/SidebarLogosTextWhite.svg" alt="Sidebar Logos Text" width={100} height={100} />
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {/* If-else rendering based on role */}
        {user.role === 'Admin' ? <NavAdmins items={data.items} /> : USER_ROLES.includes(user.role) ? <NavUsers items={data.useritems} /> : null}
      </SidebarContent>
      <SidebarFooter>
        <NavProfile user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
