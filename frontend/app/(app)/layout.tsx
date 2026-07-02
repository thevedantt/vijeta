import { DashboardSidebar } from "@/components/layout/DashboardSidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <DashboardSidebar />
      <div className="flex-1 ml-64 min-h-screen">
        {children}
      </div>
    </div>
  )
}
