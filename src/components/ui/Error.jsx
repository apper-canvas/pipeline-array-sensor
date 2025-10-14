import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className,
  variant = "default" 
}) => {
  if (variant === "inline") {
    return (
      <div className={cn("text-red-600 text-sm mt-1 flex items-center gap-1", className)}>
        <ApperIcon name="AlertCircle" size={14} />
        <span>{message}</span>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try again
        </button>
      )}
    </div>
  )
}

export default Error