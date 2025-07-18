import { Suspense } from 'react'
import { StatsCards } from '@/components/stats-cards'
import { RecentDocuments } from '@/components/recent-documents'
import { QuickActions } from '@/components/quick-actions'
import { PerformanceChart } from '@/components/performance-chart'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Brain, Zap, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold constructiv-text-gradient">
          Constructiv AI Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Professional AI-powered document extraction and prompt management for the construction industry
        </p>
      </div>

      {/* Stats Overview */}
      <Suspense fallback={<LoadingSpinner />}>
        <StatsCards />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <Suspense fallback={<LoadingSpinner />}>
            <PerformanceChart />
          </Suspense>
        </div>

        {/* Quick Actions */}
        <div>
          <Suspense fallback={<LoadingSpinner />}>
            <QuickActions />
          </Suspense>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Documents */}
        <div>
          <Suspense fallback={<LoadingSpinner />}>
            <RecentDocuments />
          </Suspense>
        </div>

        {/* System Health */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-constructiv-green" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-constructiv-blue" />
                <span className="text-sm font-medium">Document Processing</span>
              </div>
              <span className="text-sm text-constructiv-green font-medium">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-constructiv-purple" />
                <span className="text-sm font-medium">AI Extraction</span>
              </div>
              <span className="text-sm text-constructiv-green font-medium">Optimal</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-constructiv-orange" />
                <span className="text-sm font-medium">Prompt Engine</span>
              </div>
              <span className="text-sm text-constructiv-green font-medium">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}