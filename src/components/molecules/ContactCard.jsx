import { cn } from "@/utils/cn"
import Avatar from "@/components/atoms/Avatar"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatPhone, formatRelativeTime } from "@/utils/formatters"

const ContactCard = ({ 
  contact, 
  onClick, 
  className,
  variant = "default" 
}) => {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "card p-4 cursor-pointer card-hover transition-all duration-200",
          className
        )}
        onClick={() => onClick?.(contact)}
      >
        <div className="flex items-center space-x-3">
          <Avatar name={contact.name} size="default" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
            <p className="text-sm text-gray-600 truncate">{contact.company}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "card p-6 cursor-pointer card-hover transition-all duration-200",
        className
      )}
      onClick={() => onClick?.(contact)}
    >
      <div className="flex items-start space-x-4">
        <Avatar name={contact.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {contact.name}
            </h3>
            <div className="flex items-center space-x-2 text-gray-400">
              <ApperIcon name="Clock" size={14} />
              <span className="text-xs">
                {formatRelativeTime(contact.updatedAt)}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-3 truncate">{contact.company}</p>
          
          <div className="space-y-2 mb-4">
            {contact.email && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Mail" size={14} />
                <span className="truncate">{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Phone" size={14} />
                <span>{formatPhone(contact.phone)}</span>
              </div>
            )}
          </div>

          {contact.tags && contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {contact.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {contact.tags.length > 3 && (
                <Badge variant="default" className="text-xs">
                  +{contact.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactCard