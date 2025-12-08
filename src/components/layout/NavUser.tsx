'use client'

import { type LucideIcon } from 'lucide-react'

import Link from 'next/link'
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function NavUsers({
  items
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarGroupLabel>User</SidebarGroupLabel>
        {items.map((item) => (
          <Collapsible key={item.name} asChild className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <Link href={item.url} passHref>
                  <SidebarMenuButton tooltip={item.name}>
                    {item.icon && <item.icon />}
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
