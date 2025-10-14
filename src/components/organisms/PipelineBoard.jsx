import { useState } from "react"
import { cn } from "@/utils/cn"
import DealCard from "@/components/molecules/DealCard"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { formatCurrency } from "@/utils/formatters"
import { toast } from "react-toastify"

const PipelineBoard = ({ 
  stages,
  deals,
  contacts,
  onDealStageChange,
  onDealClick,
  className
}) => {
  const [draggedDeal, setDraggedDeal] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)

  const getDealsByStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId)
  }

  const getStageValue = (stageId) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + (deal.value || 0), 0)
  }

  const getContactForDeal = (dealId) => {
    const deal = deals.find(d => d.Id === dealId)
    return contacts.find(c => c.Id === deal?.contactId)
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedDeal(null)
    setDragOverStage(null)
  }

  const handleDragOver = (e, stageId) => {
    e.preventDefault()
    setDragOverStage(stageId)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = async (e, stageId) => {
    e.preventDefault()
    setDragOverStage(null)
    
    if (!draggedDeal || draggedDeal.stage === stageId) {
      return
    }

    try {
      await onDealStageChange?.(draggedDeal.Id, stageId)
      
      const stageName = stages.find(s => s.Id === stageId)?.name
      toast.success(`Deal moved to ${stageName}`)
      
      // Add celebration effect for Won deals
      if (stageId === "won") {
        toast.success("🎉 Deal Won! Congratulations!", {
          autoClose: 5000,
          className: "bg-gradient-to-r from-green-500 to-green-600"
        })
      }
    } catch (error) {
      toast.error("Failed to move deal")
    }
  }

  return (
    <div className={cn("flex gap-6 overflow-x-auto pb-4", className)}>
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage.Id)
        const stageValue = getStageValue(stage.Id)
        const isDropTarget = dragOverStage === stage.Id

        return (
          <div
            key={stage.Id}
            className="flex-shrink-0 w-80"
            onDragOver={(e) => handleDragOver(e, stage.Id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.Id)}
          >
            {/* Stage Header */}
            <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  ></div>
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <Badge variant="default" className="text-xs">
                    {stageDeals.length}
                  </Badge>
                </div>
<Button
variant="ghost"
size="sm"
className="p-1"
onClick={() => window.location.href = '/deals/new'}
>
<ApperIcon name="Plus" size={16} />
</Button>
              </div>
              <div className="text-lg font-bold text-gray-900 bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent">
                {formatCurrency(stageValue)}
              </div>
            </div>

            {/* Stage Column */}
            <div 
              className={cn(
                "stage-column space-y-4",
                isDropTarget && "border-primary-500 bg-primary-50 border-solid"
              )}
            >
              {stageDeals.map((deal) => {
                const contact = getContactForDeal(deal.Id)
                return (
                  <DealCard
                    key={deal.Id}
                    deal={deal}
                    contact={contact}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onClick={onDealClick}
                    isDragging={draggedDeal?.Id === deal.Id}
                  />
                )
              })}

              {stageDeals.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <ApperIcon name="Inbox" size={32} className="mx-auto mb-2" />
                  <p className="text-sm">No deals in this stage</p>
<Button
variant="ghost"
size="sm"
className="mt-2 text-xs"
onClick={() => window.location.href = '/deals/new'}
>
<ApperIcon name="Plus" size={14} className="mr-1" />
Add Deal
</Button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PipelineBoard