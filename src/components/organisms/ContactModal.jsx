import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import ContactForm from "@/components/organisms/ContactForm";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import { formatDate, formatPhone, formatCurrency } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";
const ContactModal = ({ 
  contact, 
  deals,
  activities,
  isOpen, 
  onClose,
  onSave,
  onDelete,
  className 
}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("info")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setActiveTab("info")
    setIsEditing(false)
  }, [contact?.Id, isOpen])

  if (!contact) return null

  const contactDeals = deals.filter(deal => deal.contactId === contact.Id)
  const contactActivities = activities.filter(activity => activity.contactId === contact.Id)

  const tabs = [
    { id: "info", label: "Info", icon: "User" },
    { id: "deals", label: `Deals (${contactDeals.length})`, icon: "DollarSign" },
    { id: "activities", label: `Activities (${contactActivities.length})`, icon: "Activity" },
  ]

  const handleSave = async (formData) => {
    await onSave?.(formData)
    setIsEditing(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden",
                className
              )}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar name={contact.name} size="lg" />
                    <div>
                      <h2 className="text-xl font-semibold">{contact.name}</h2>
                      <p className="text-primary-100">{contact.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        <ApperIcon name="Edit2" size={16} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="text-white hover:bg-white hover:bg-opacity-20"
                    >
                      <ApperIcon name="X" size={20} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors",
                        activeTab === tab.id
                          ? "border-primary-500 text-primary-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <ApperIcon name={tab.icon} size={16} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {activeTab === "info" && (
                  <>
                    {isEditing ? (
                      <ContactForm
                        contact={contact}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                      />
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                              </label>
                              <p className="text-gray-900">{contact.name}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company
                              </label>
                              <p className="text-gray-900">{contact.company}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <p className="text-gray-900">{contact.email}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                              </label>
                              <p className="text-gray-900">{formatPhone(contact.phone)}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {contact.tags?.map((tag, index) => (
                                  <Badge key={index} variant="default">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Created
                              </label>
                              <p className="text-gray-900">{formatDate(contact.createdAt)}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Updated
                              </label>
                              <p className="text-gray-900">{formatDate(contact.updatedAt)}</p>
                            </div>
                          </div>
                        </div>
                        {contact.notes && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Notes
                            </label>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-gray-900 whitespace-pre-wrap">{contact.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {activeTab === "deals" && (
                  <div className="space-y-4">
                    {contactDeals.length > 0 ? (
                      contactDeals.map((deal) => (
                        <div key={deal.Id} className="card p-4 cursor-pointer hover:shadow-md">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{deal.title}</h4>
                              <p className="text-sm text-gray-600">
                                {formatDate(deal.closeDate)} • {deal.probability}% probability
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                {formatCurrency(deal.value)}
                              </p>
                              <Badge variant={deal.stage.toLowerCase()}>
                                {deal.stage}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="DollarSign" size={32} className="mx-auto mb-2" />
                        <p>No deals found for this contact</p>
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-4"
onClick={() => navigate("/deals/new", { 
state: { contactId: contact.Id } 
})}
                        >
                          <ApperIcon name="Plus" size={16} className="mr-1" />
                          Create Deal
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "activities" && (
                  <ActivityFeed
                    activities={contactActivities}
                    contacts={[contact]}
                    showContact={false}
                  />
                )}
              </div>

              {/* Footer */}
              {!isEditing && (
                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => onDelete?.(contact)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" size={16} className="mr-1" />
                    Delete Contact
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/activities/new", { 
                      state: { contactId: contact.Id } 
                    })}
                  >
                    <ApperIcon name="Plus" size={16} className="mr-1" />
                    Log Activity
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ContactModal