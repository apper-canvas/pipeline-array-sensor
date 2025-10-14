import { cn } from "@/utils/cn"
import ActivityItem from "@/components/molecules/ActivityItem"
import ApperIcon from "@/components/ApperIcon"

const ActivityFeed = ({ 
  activities, 
  contacts,
  showContact = true,
  variant = "default",
  className 
}) => {
  const getContactForActivity = (activityId) => {
    const activity = activities.find(a => a.Id === activityId)
    return contacts.find(c => c.Id === activity?.contactId)
  }

  if (activities.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <ApperIcon name="Activity" className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
        <p className="text-gray-600 mb-6">Activities will appear here as you interact with contacts and deals.</p>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={cn("space-y-4", className)}>
        {activities.slice(0, 5).map((activity) => {
          const contact = getContactForActivity(activity.Id)
          return (
            <ActivityItem
              key={activity.Id}
              activity={activity}
              contact={contact}
              showContact={showContact}
              variant="compact"
            />
          )
        })}
        {activities.length > 5 && (
          <div className="text-center pt-4">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all activities
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-sm", className)}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          <ApperIcon name="Activity" className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {activities.map((activity, index) => {
          const contact = getContactForActivity(activity.Id)
          return (
            <div key={activity.Id} className="px-6 last:border-b-0">
              <ActivityItem
                activity={activity}
                contact={contact}
                showContact={showContact}
                className={cn(
                  index === activities.length - 1 && "pb-6"
                )}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ActivityFeed