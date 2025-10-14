import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PipelineBoard from "@/components/organisms/PipelineBoard"
import MetricCard from "@/components/molecules/MetricCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { dealService } from "@/services/api/dealService"
import { contactService } from "@/services/api/contactService"
import { stageService } from "@/services/api/stageService"
import { formatCurrency } from "@/utils/formatters"
import { toast } from "react-toastify"

const Pipeline = () => {
  const navigate = useNavigate()
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadPipelineData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [dealsData, contactsData, stagesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        stageService.getAll()
      ])
      
      setDeals(dealsData)
      setContacts(contactsData)
      setStages(stagesData)
    } catch (err) {
      setError(err.message || "Failed to load pipeline data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPipelineData()
  }, [])

  const handleDealStageChange = async (dealId, newStage) => {
    try {
      await dealService.updateStage(dealId, newStage)
      await loadPipelineData()
    } catch (err) {
      throw new Error("Failed to update deal stage")
    }
  }

  const handleDealClick = (deal) => {
    // Navigate to deal detail or open modal
    console.log("Deal clicked:", deal)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pipeline</h1>
          <p className="text-gray-600">Track and manage your sales opportunities.</p>
        </div>
        <Loading variant="cards" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pipeline</h1>
          <p className="text-gray-600">Track and manage your sales opportunities.</p>
        </div>
        <Error message={error} onRetry={loadPipelineData} />
      </div>
    )
  }

  // Calculate pipeline metrics
  const totalPipelineValue = deals
    .filter(deal => !["won", "lost"].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.value, 0)

  const activeDeals = deals.filter(deal => !["won", "lost"].includes(deal.stage))
  const wonDeals = deals.filter(deal => deal.stage === "won")
  const avgDealSize = activeDeals.length > 0 ? totalPipelineValue / activeDeals.length : 0

  if (deals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              Pipeline
            </h1>
            <p className="text-gray-600 mt-1">Track and manage your sales opportunities.</p>
          </div>
        </div>
        
        <Empty
          title="No deals in pipeline"
description="Start tracking your sales opportunities by creating your first deal. Connect deals to contacts and move them through your sales process."
icon="GitBranch"
actionLabel="Create First Deal"
onAction={() => navigate("/deals/new")}
/>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Pipeline
          </h1>
          <p className="text-gray-600 mt-1">Track and manage your sales opportunities.</p>
        </div>
        <div className="flex items-center space-x-3">
<Button
onClick={() => navigate("/deals/new")}
variant="secondary"
className="flex items-center space-x-2"
>
            <ApperIcon name="Plus" size={16} />
            <span>Add Deal</span>
          </Button>
          <Button
            onClick={() => navigate("/contacts/new")}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="UserPlus" size={16} />
            <span>Add Contact</span>
          </Button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Pipeline"
          value={totalPipelineValue}
          format="currency"
          icon="TrendingUp"
          gradient
        />
        <MetricCard
          title="Active Deals"
          value={activeDeals.length}
          icon="GitBranch"
        />
        <MetricCard
          title="Average Deal Size"
          value={avgDealSize}
          format="currency"
          icon="Target"
        />
        <MetricCard
          title="Won This Month"
          value={wonDeals.length}
          icon="Trophy"
          trend="up"
          trendValue="+2"
        />
      </div>

      {/* Pipeline Board */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Sales Pipeline</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Drag deals between stages</span>
            </div>
          </div>
        </div>
        
        <PipelineBoard
          stages={stages}
          deals={deals}
          contacts={contacts}
          onDealStageChange={handleDealStageChange}
          onDealClick={handleDealClick}
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/contacts")}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center space-x-3 mb-2">
              <ApperIcon name="Users" className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-gray-900">View All Contacts</span>
            </div>
            <p className="text-sm text-gray-600">
              Manage your contact database and relationships
            </p>
          </button>
          
          <button
            onClick={() => navigate("/activities")}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center space-x-3 mb-2">
              <ApperIcon name="Activity" className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-gray-900">Recent Activities</span>
            </div>
            <p className="text-sm text-gray-600">
              View and log activities for your deals and contacts
            </p>
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center space-x-3 mb-2">
              <ApperIcon name="BarChart3" className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-gray-900">View Dashboard</span>
            </div>
            <p className="text-sm text-gray-600">
              Get an overview of your sales performance and metrics
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pipeline