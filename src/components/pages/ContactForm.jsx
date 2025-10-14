import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ContactFormComponent from "@/components/organisms/ContactForm"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { contactService } from "@/services/api/contactService"
import { toast } from "react-toastify"

const ContactFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState("")

  const loadContact = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError("")
      const contactData = await contactService.getById(id)
      setContact(contactData)
    } catch (err) {
      setError(err.message || "Failed to load contact")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isEditing) {
      loadContact()
    }
  }, [id, isEditing])

  const handleSave = async (formData) => {
    try {
      if (isEditing) {
        await contactService.update(contact.Id, formData)
        toast.success("Contact updated successfully!")
      } else {
        await contactService.create(formData)
        toast.success("Contact created successfully!")
      }
      navigate("/contacts")
    } catch (err) {
      toast.error("Failed to save contact")
      throw err
    }
  }

  const handleCancel = () => {
    navigate("/contacts")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? "Edit Contact" : "Add New Contact"}
          </h1>
          <p className="text-gray-600">
            {isEditing ? "Update contact information" : "Create a new contact in your CRM"}
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
            {isEditing ? "Edit Contact" : "Add New Contact"}
          </h1>
          <p className="text-gray-600">
            {isEditing ? "Update contact information" : "Create a new contact in your CRM"}
          </p>
        </div>
        <Error message={error} onRetry={loadContact} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {isEditing ? "Edit Contact" : "Add New Contact"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? "Update contact information" : "Create a new contact in your CRM"}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          <span>Back to Contacts</span>
        </Button>
      </div>

      {/* Form */}
      <div className="card p-8">
        <ContactFormComponent
          contact={contact}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

export default ContactFormPage