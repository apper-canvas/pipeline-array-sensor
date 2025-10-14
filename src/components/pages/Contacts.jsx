import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ContactTable from "@/components/organisms/ContactTable"
import ContactModal from "@/components/organisms/ContactModal"
import SearchBar from "@/components/molecules/SearchBar"
import FilterBar from "@/components/molecules/FilterBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { contactService } from "@/services/api/contactService"
import { dealService } from "@/services/api/dealService"
import { activityService } from "@/services/api/activityService"
import { toast } from "react-toastify"

const Contacts = () => {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ])
      
      setContacts(contactsData)
      setDeals(dealsData)
      setActivities(activitiesData)
      setFilteredContacts(contactsData)
    } catch (err) {
      setError(err.message || "Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  // Filter contacts based on search and filters
  useEffect(() => {
    let filtered = [...contacts]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Additional filters
    if (activeFilters.company) {
      filtered = filtered.filter(contact =>
        contact.company.toLowerCase().includes(activeFilters.company.toLowerCase())
      )
    }

    if (activeFilters.tags && activeFilters.tags.length > 0) {
      filtered = filtered.filter(contact =>
        contact.tags?.some(tag => activeFilters.tags.includes(tag))
      )
    }

    setFilteredContacts(filtered)
  }, [contacts, searchTerm, activeFilters])

  const handleContactClick = (contact) => {
    setSelectedContact(contact)
    setShowContactModal(true)
  }

  const handleContactSave = async (contactData) => {
    try {
      if (selectedContact) {
        await contactService.update(selectedContact.Id, contactData)
        toast.success("Contact updated successfully!")
      } else {
        await contactService.create(contactData)
        toast.success("Contact created successfully!")
      }
      await loadContacts()
      setShowContactModal(false)
      setSelectedContact(null)
    } catch (err) {
      toast.error("Failed to save contact")
    }
  }

  const handleContactDelete = async (contact) => {
    if (!window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      return
    }

    try {
      await contactService.delete(contact.Id)
      toast.success("Contact deleted successfully!")
      await loadContacts()
      setShowContactModal(false)
      setSelectedContact(null)
    } catch (err) {
      toast.error("Failed to delete contact")
    }
  }

  const filterOptions = [
    {
      key: "company",
      label: "Company",
      type: "text"
    },
    {
      key: "tags",
      label: "Tags",
      type: "checkbox",
      options: [
        { value: "Enterprise", label: "Enterprise" },
        { value: "VIP", label: "VIP" },
        { value: "Prospect", label: "Prospect" },
        { value: "SMB", label: "SMB" },
        { value: "Hot Lead", label: "Hot Lead" }
      ]
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
          <p className="text-gray-600">Manage your customer relationships and contact information.</p>
        </div>
        <Loading variant="table" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
          <p className="text-gray-600">Manage your customer relationships and contact information.</p>
        </div>
        <Error message={error} onRetry={loadContacts} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Contacts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your customer relationships and contact information.
          </p>
        </div>
        <Button
          onClick={() => navigate("/contacts/new")}
          variant="primary"
          className="flex items-center space-x-2 self-start sm:self-auto"
        >
          <ApperIcon name="UserPlus" size={16} />
          <span>Add Contact</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search contacts by name, company, email, or tags..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            Showing {filteredContacts.length} of {contacts.length} contacts
          </div>
        </div>

        <FilterBar
          filters={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearFilters}
        />
      </div>

      {/* Contacts Table */}
      {filteredContacts.length === 0 && contacts.length === 0 ? (
        <Empty
          title="No contacts yet"
          description="Start building your network by adding your first contact. You can import contacts, add them manually, or integrate with your existing tools."
          icon="Users"
          actionLabel="Add First Contact"
          onAction={() => navigate("/contacts/new")}
        />
      ) : filteredContacts.length === 0 ? (
        <Empty
          title="No matching contacts"
          description="Try adjusting your search terms or filters to find the contacts you're looking for."
          icon="Search"
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <ContactTable
          contacts={filteredContacts}
          onContactClick={handleContactClick}
          onDeleteContact={handleContactDelete}
        />
      )}

      {/* Contact Detail Modal */}
      <ContactModal
        contact={selectedContact}
        deals={deals}
        activities={activities}
        isOpen={showContactModal}
        onClose={() => {
          setShowContactModal(false)
          setSelectedContact(null)
        }}
        onSave={handleContactSave}
        onDelete={handleContactDelete}
      />
    </div>
  )
}

export default Contacts