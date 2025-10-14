import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import { formatCurrency, formatCompactNumber } from "@/utils/formatters"

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  format = "number",
  className,
  gradient = false
}) => {
  const formatValue = (val) => {
    switch (format) {
      case "currency":
        return formatCurrency(val)
      case "compact":
        return formatCompactNumber(val)
      default:
        return val
    }
  }

  const getTrendColor = () => {
    if (!trend) return "text-gray-500"
    return trend === "up" ? "text-green-500" : "text-red-500"
  }

  const getTrendIcon = () => {
    if (!trend) return null
    return trend === "up" ? "TrendingUp" : "TrendingDown"
  }

  return (
    <div className={cn(
      "card p-6 card-hover",
      gradient && "bg-gradient-to-br from-white to-gray-50",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="bg-primary-100 p-2 rounded-lg">
              <ApperIcon name={icon} className="h-5 w-5 text-primary-600" />
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {trend && (
          <div className={cn("flex items-center space-x-1", getTrendColor())}>
            <ApperIcon name={getTrendIcon()} size={16} />
            {trendValue && <span className="text-sm font-medium">{trendValue}</span>}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
        {formatValue(value)}
      </div>
    </div>
  )
}

export default MetricCard