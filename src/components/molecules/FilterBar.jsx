import { useState } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const FilterBar = ({ 
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearAll,
  className
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ApperIcon name="Filter" size={16} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="primary" className="text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white p-4 border border-gray-200 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                {filter.type === "select" && (
                  <select
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {filter.type === "text" && (
                  <input
                    type="text"
                    placeholder={`Filter by ${filter.label.toLowerCase()}`}
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                )}
                {filter.type === "checkbox" && (
                  <div className="space-y-2">
                    {filter.options?.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeFilters[filter.key]?.includes(option.value) || false}
                          onChange={(e) => {
                            const current = activeFilters[filter.key] || []
                            const updated = e.target.checked
                              ? [...current, option.value]
                              : current.filter(v => v !== option.value)
                            onFilterChange(filter.key, updated)
                          }}
                          className="rounded border-gray-300 text-primary-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null
            const filter = filters.find(f => f.key === key)
            if (!filter) return null

            const displayValue = Array.isArray(value) ? value.join(", ") : value
            
            return (
              <div
                key={key}
                className="flex items-center space-x-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{filter.label}: {displayValue}</span>
                <button
                  onClick={() => onFilterChange(key, Array.isArray(value) ? [] : "")}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <ApperIcon name="X" size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FilterBar