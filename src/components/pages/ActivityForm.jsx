import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { activityService } from "@/services/api/activityService"
import { contactService } from "@/services/api/contactService"
import { toast } from "react-toastify"

const ActivityFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const [activity, setActivity] = useState(null)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [contactsLoading, setContactsLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    contactId: "",
    type: "call",
    subject: "",
    notes: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5)
  })
  const [saving, setSaving] = useState(false)

  const activityTypes = [
    { value: "call", label: "Phone Call" },
    { value: "email", label: "Email" },
    { value: "meeting", label: "Meeting" },
    { value: "task", label: "Task" },
    { value: "note", label: "Note" }
  ]

  const loadActivity = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError("")
      const activityData = await activityService.getById(id)
      setActivity(activityData)
      
      // Parse the activity data for the form
      const activityDate = new Date(activityData.date)
      setFormData({
        contactId: activityData.contactId,
        type: activityData.type,
        subject: activityData.subject,
        notes: activityData.notes || "",
        date: activityDate.toISOString().split('T')[0],
        time: activityDate.toTimeString().slice(0, 5)
      })
    } catch (err) {
      setError(err.message || "Failed to load activity")
    } finally {
      setLoading(false)
    }
  }

  const loadContacts = async () => {
    try {
      setContactsLoading(true)
      const contactsData = await contactService.getAll()
      setContacts(contactsData)
    } catch (err) {
      toast.error("Failed to load contacts")
    } finally {
      setContactsLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
    if (isEditing) {
      loadActivity()
    }
  }, [id, isEditing])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.contactId) {
      toast.error("Please select a contact")
      return false
    }
    if (!formData.subject?.trim()) {
      toast.error("Please enter a subject")
      return false
    }
    if (!formData.date) {
      toast.error("Please select a date")
      return false
    }
    if (!formData.time) {
      toast.error("Please select a time")
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      setSaving(true)
      
      // Combine date and time
      const activityDateTime = new Date(`${formData.date}T${formData.time}`)
      
      const activityData = {
        contactId: formData.contactId,
        type: formData.type,
        subject: formData.subject.trim(),
        notes: formData.notes?.trim() || "",
        date: activityDateTime.toISOString()
      }

      if (isEditing) {
        await activityService.update(activity.id, activityData)
        toast.success("Activity updated successfully!")
      } else {
        await activityService.create(activityData)
        toast.success("Activity logged successfully!")
      }
      navigate("/activities")
    } catch (err) {
      toast.error(isEditing ? "Failed to update activity" : "Failed to log activity")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate("/activities")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? "Edit Activity" : "Log New Activity"}
          </h1>
          <p className="text-gray-600">
            {isEditing ? "Update activity information" : "Record a new activity in your CRM"}
          </p>
        </div>
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? "Edit Activity" : "Log New Activity"}
          </h1>
          <p className="text-gray-600">
            {isEditing ? "Update activity information" : "Record a new activity in your CRM"}
          </p>
        </div>
        <Error message={error} onRetry={loadActivity} />
      </div>
    )
  }

  const selectedContact = contacts.find(c => c.id === formData.contactId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {isEditing ? "Edit Activity" : "Log New Activity"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? "Update activity information" : "Record a new activity in your CRM"}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          <span>Back to Activities</span>
        </Button>
      </div>

      {/* Form */}
      <div className="card p-8">
        <div className="space-y-6">
          {/* Contact Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Contact *
            </label>
            <Select
              value={formData.contactId}
              onChange={(value) => handleInputChange("contactId", value)}
              placeholder="Select a contact"
              disabled={contactsLoading}
            >
              {contactsLoading ? (
                <option value="">Loading contacts...</option>
              ) : (
<>
                  <option value="">Select a contact</option>
                  {contacts.map(contact => (
                    <option key={contact.id || `contact-${contact.name}-${Math.random()}`} value={contact.id}>
                      {contact.name} - {contact.company || "No company"}
                    </option>
                  ))}
                </>
              )}
            </Select>
            {selectedContact && (
              <div className="text-sm text-gray-500 mt-1">
                {selectedContact.email && (
                  <span className="mr-4">{selectedContact.email}</span>
                )}
                {selectedContact.phone && (
                  <span>{selectedContact.phone}</span>
                )}
              </div>
            )}
          </div>

          {/* Activity Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Activity Type *
            </label>
            <Select
              value={formData.type}
              onChange={(value) => handleInputChange("type", value)}
>
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Subject *
            </label>
            <Input
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="Enter activity subject"
              maxLength={200}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Time *
              </label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Add any additional notes or details about this activity..."
              rows={4}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.notes?.length || 0}/1000 characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-6 border-t">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  <span>{isEditing ? "Updating..." : "Logging..."}</span>
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} />
                  <span>{isEditing ? "Update Activity" : "Log Activity"}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityFormPage