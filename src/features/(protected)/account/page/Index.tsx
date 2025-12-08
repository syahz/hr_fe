'use client'
import { useGetUser } from '@/hooks/api/useUser'
import { useAuth } from '@/context/AuthContext'
import React from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UpdateAccountForm } from '@/features/(protected)/account/components/forms/UpdateAccountForm'
import { UpdatePasswordForm } from '../components/forms/UpdatePasswordForm'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'

const AccountPage = () => {
  const { user } = useAuth()
  const { data: userData, isLoading } = useGetUser()

  // Tampilkan loading atau skeleton jika data user belum ada
  if (!user || isLoading) {
    return (
      <PageContainer>
        <DynamicSkeleton variant="dialogForm" />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="account">Akun</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        {/* Konten untuk Tab Akun */}
        <TabsContent value="account" className="mt-4">
          {userData?.data && <UpdateAccountForm userData={userData.data} />}
        </TabsContent>

        {/* Konten untuk Tab Pasword */}
        <TabsContent value="password" className="mt-4">
          {userData?.data && <UpdatePasswordForm />}
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}

export default AccountPage
