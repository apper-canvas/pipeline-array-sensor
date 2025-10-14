import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ActivityFeed from "@/components/organisms/ActivityFeed"
import SearchBar from "@/components/molecules/SearchBar"
import FilterBar from "@/components/molecules/FilterBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { activityService } from "@/services/api/activityService"
import { contactService } from "@/services/api/contactService"
import { formatRelativeTime } from "@/utils/formatters"

const Activities = () => {
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll()
      ])
      
      setActivities(activitiesData)
      setContacts(contactsData)
      setFilteredActivities(activitiesData)
    } catch (err) {
      setError(err.message || "Failed to load activities")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  // Filter activities based on search and filters
  useEffect(() => {
    let filtered = [...activities]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity => {
        const contact = contacts.find(c => c.Id === activity.contactId)
        return (
          activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact && contact.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (contact && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      })
    }

    // Type filter
    if (activeFilters.type) {
      filtered = filtered.filter(activity =>
        activity.type.toLowerCase() === activeFilters.type.toLowerCase()
      )
    }

    // Contact filter
    if (activeFilters.contact) {
      filtered = filtered.filter(activity => {
        const contact = contacts.find(c => c.Id === activity.contactId)
        return contact && contact.name.toLowerCase().includes(activeFilters.contact.toLowerCase())
      })
    }

    setFilteredActivities(filtered)
  }, [activities, contacts, searchTerm, activeFilters])

  const filterOptions = [
    {
      key: "type",
      label: "Activity Type",
      type: "select",
      options: [
        { value: "call", label: "Call" },
        { value: "email", label: "Email" },
        { value: "meeting", label: "Meeting" },
        { value: "note", label: "Note" },
        { value: "task", label: "Task" },
        { value: "deal", label: "Deal" }
      ]
    },
    {
      key: "contact",
      label: "Contact",
      type: "text"
    }
  ]

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleClearFilters = () => {
    setActiveFilters({})
    setSearchTerm("")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities</h1>
          <p className="text-gray-600">Track interactions and communications with your contacts.</p>
        </div>
        <Loading variant="cards" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities</h1>
          <p className="text-gray-600">Track interactions and communications with your contacts.</p>
        </div>
        <Error message={error} onRetry={loadActivities} />
      </div>
    )
  }

  // Group activities by date
  const groupActivitiesByDate = (activities) => {
    const groups = {}
    activities.forEach(activity => {
      const date = new Date(activity.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
    })
    return groups
  }

  const activityGroups = groupActivitiesByDate(filteredActivities)

  // Get activity type counts
  const activityTypeCounts = activities.reduce((counts, activity) => {
    counts[activity.type] = (counts[activity.type] || 0) + 1
    return counts
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Activities
          </h1>
          <p className="text-gray-600 mt-1">
            Track interactions and communications with your contacts.
          </p>
        </div>
        <Button
          onClick={() => navigate("/activities/new")}
          variant="primary"
          className="flex items-center space-x-2 self-start sm:self-auto"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Log Activity</span>
        </Button>
      </div>

      {/* Activity Type Overview */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h2>
        <div className="flex flex-wrap gap-4">
          {Object.entries(activityTypeCounts).map(([type, count]) => (
            <div key={type} className="flex items-center space-x-2">
              <Badge variant={type} className="capitalize">
                {type}
              </Badge>
              <span className="text-sm font-medium text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search activities by description, type, or contact..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            Showing {filteredActivities.length} of {activities.length} activities
          </div>
        </div>

        <FilterBar
          filters={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearFilters}
        />
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 && activities.length === 0 ? (
        <Empty
          title="No activities yet"
          description="Start tracking your interactions by logging your first activity. Activities help you maintain a detailed history of communications with your contacts."
          icon="Activity"
          actionLabel="Log First Activity"
          onAction={() => navigate("/activities/new")}
        />
      ) : filteredActivities.length === 0 ? (
        <Empty
          title="No matching activities"
          description="Try adjusting your search terms or filters to find the activities you're looking for."
          icon="Search"
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(activityGroups).map(([date, dateActivities]) => (
            <div key={date} className="card p-6">
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {formatRelativeTime(new Date(date))}
                </h2>
                <Badge variant="default" className="text-xs">
                  {dateActivities.length} {dateActivities.length === 1 ? 'activity' : 'activities'}
                </Badge>
              </div>
              
              <ActivityFeed
                activities={dateActivities}
                contacts={contacts}
                showContact={true}
              />
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {activities.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/contacts")}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex items-center space-x-3 mb-2">
                <ApperIcon name="Users" className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-gray-900">View Contacts</span>
              </div>
              <p className="text-sm text-gray-600">
                Manage your contacts and relationships
              </p>
            </button>
            
            <button
              onClick={() => navigate("/pipeline")}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex items-center space-x-3 mb-2">
                <ApperIcon name="GitBranch" className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-gray-900">View Pipeline</span>
              </div>
              <p className="text-sm text-gray-600">
                Track your sales opportunities and deals
              </p>
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex items-center space-x-3 mb-2">
                <ApperIcon name="BarChart3" className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-gray-900">Dashboard</span>
              </div>
              <p className="text-sm text-gray-600">
                View your overall sales performance and metrics
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Activities