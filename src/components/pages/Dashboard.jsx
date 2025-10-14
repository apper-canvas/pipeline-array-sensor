import { useState, useEffect } from "react"
import MetricCard from "@/components/molecules/MetricCard"
import ActivityFeed from "@/components/organisms/ActivityFeed"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { contactService } from "@/services/api/contactService"
import { dealService } from "@/services/api/dealService"
import { activityService } from "@/services/api/activityService"
import { stageService } from "@/services/api/stageService"
import { formatCurrency } from "@/utils/formatters"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [contactsData, dealsData, activitiesData, stagesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll(),
        stageService.getAll()
      ])
      
      setContacts(contactsData)
      setDeals(dealsData)
      setActivities(activitiesData)
      setStages(stagesData)
    } catch (err) {
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your sales overview.</p>
        </div>
        <Loading variant="cards" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your sales overview.</p>
        </div>
        <Error message={error} onRetry={loadDashboardData} />
      </div>
    )
  }

  // Calculate metrics
  const totalPipelineValue = deals
    .filter(deal => !["won", "lost"].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.value, 0)

  const wonDeals = deals.filter(deal => deal.stage === "won")
  const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0)

  const activeDeals = deals.filter(deal => !["won", "lost"].includes(deal.stage))

  const stageDistribution = stages.map(stage => {
    const stageDeals = deals.filter(deal => deal.stage === stage.Id)
    const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)
    return {
      ...stage,
      count: stageDeals.length,
      value: stageValue
    }
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your sales overview.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/contacts/new")}
            className="btn-primary flex items-center space-x-2"
          >
            <ApperIcon name="UserPlus" size={16} />
            <span>Add Contact</span>
          </button>
          <button
            onClick={() => navigate("/pipeline")}
            className="btn-secondary flex items-center space-x-2"
          >
            <ApperIcon name="GitBranch" size={16} />
            <span>View Pipeline</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Pipeline"
          value={totalPipelineValue}
          format="currency"
          icon="TrendingUp"
          trend="up"
          trendValue="+12%"
          gradient
        />
        <MetricCard
          title="Active Deals"
          value={activeDeals.length}
          icon="GitBranch"
          trend="up"
          trendValue="+3"
        />
        <MetricCard
          title="Won This Month"
          value={wonValue}
          format="currency"
          icon="Target"
          trend="up"
          trendValue="+25%"
          gradient
        />
        <MetricCard
          title="Total Contacts"
          value={contacts.length}
          icon="Users"
          trend="up"
          trendValue="+5"
        />
      </div>

      {/* Pipeline Overview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Pipeline by Stage</h2>
          <button
            onClick={() => navigate("/pipeline")}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
          >
            <span>View Full Pipeline</span>
            <ApperIcon name="ArrowRight" size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stageDistribution.map(stage => (
            <div key={stage.Id} className="text-center">
              <div 
                className="w-full h-2 rounded-full mb-3"
                style={{ backgroundColor: stage.color + "20" }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    backgroundColor: stage.color,
                    width: `${Math.max((stage.count / Math.max(...stageDistribution.map(s => s.count))) * 100, 10)}%`
                  }}
                />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">
                  {stage.count}
                </div>
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {stage.name}
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {formatCurrency(stage.value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <button
              onClick={() => navigate("/activities")}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
            >
              <span>View All</span>
              <ApperIcon name="ArrowRight" size={16} />
            </button>
          </div>
          <ActivityFeed
            activities={activities.slice(0, 5)}
            contacts={contacts}
            variant="compact"
          />
        </div>

        {/* Quick Stats */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <ApperIcon name="Trophy" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Deals Won</div>
                  <div className="text-sm text-gray-600">This month</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {wonDeals.length}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <ApperIcon name="Clock" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Avg. Deal Size</div>
                  <div className="text-sm text-gray-600">Active pipeline</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(activeDeals.length > 0 ? totalPipelineValue / activeDeals.length : 0)}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <ApperIcon name="Target" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Conversion Rate</div>
                  <div className="text-sm text-gray-600">Won vs total</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard