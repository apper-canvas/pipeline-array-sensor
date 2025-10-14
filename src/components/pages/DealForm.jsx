import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { dealService } from '@/services/api/dealService'
import { contactService } from '@/services/api/contactService'
import { stageService } from '@/services/api/stageService'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { formatCurrency } from '@/utils/formatters'
import { toast } from 'react-toastify'

const DealForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isEditing = !!id
  const preselectedContactId = location.state?.contactId

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: '',
    contactId: preselectedContactId || '',
    description: '',
    closeDate: '',
    probability: '50'
  })

  // Data state
  const [contacts, setContacts] = useState([])
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Load deal data for editing
  useEffect(() => {
    if (isEditing && id) {
      loadDealData(parseInt(id))
    }
  }, [isEditing, id])

  const loadInitialData = async () => {
    try {
      const [contactsData, stagesData] = await Promise.all([
        contactService.getAll(),
        stageService.getAll()
      ])
      
      setContacts(contactsData)
      setStages(stagesData)
      
      // Set default stage if not editing
      if (!isEditing && stagesData.length > 0) {
        const defaultStage = stagesData.find(s => s.name.toLowerCase().includes('lead')) || stagesData[0]
        setFormData(prev => ({ ...prev, stage: defaultStage.Id.toString() }))
      }
    } catch (err) {
      setError('Failed to load form data')
    } finally {
      setLoading(false)
    }
  }

  const loadDealData = async (dealId) => {
    try {
      const deal = await dealService.getById(dealId)
      if (deal) {
        setFormData({
          title: deal.title || '',
          value: deal.value?.toString() || '',
          stage: deal.stage?.toString() || '',
          contactId: deal.contactId?.toString() || '',
          description: deal.description || '',
          closeDate: deal.closeDate || '',
          probability: deal.probability?.toString() || '50'
        })
      }
    } catch (err) {
      setError('Failed to load deal data')
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.title.trim()) errors.push('Deal title is required')
    if (!formData.contactId) errors.push('Contact is required')
    if (!formData.stage) errors.push('Stage is required')
    if (formData.value && isNaN(parseFloat(formData.value))) errors.push('Deal value must be a valid number')
    if (formData.probability && (isNaN(parseInt(formData.probability)) || parseInt(formData.probability) < 0 || parseInt(formData.probability) > 100)) {
      errors.push('Probability must be between 0 and 100')
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error))
      return
    }

    setSaving(true)
    try {
      const dealData = {
        title: formData.title.trim(),
        value: formData.value ? parseFloat(formData.value) : 0,
        stage: parseInt(formData.stage),
        contactId: parseInt(formData.contactId),
        description: formData.description.trim(),
        closeDate: formData.closeDate || null,
        probability: parseInt(formData.probability) || 50
      }

      if (isEditing) {
        await dealService.update(parseInt(id), dealData)
        toast.success('Deal updated successfully')
      } else {
        await dealService.create(dealData)
        toast.success('Deal created successfully')
      }

      navigate('/pipeline')
    } catch (err) {
      toast.error(isEditing ? 'Failed to update deal' : 'Failed to create deal')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/pipeline')
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Deal' : 'Create New Deal'}
          </h1>
        </div>
        <p className="text-gray-600">
          {isEditing ? 'Update deal information' : 'Add a new deal to your pipeline'}
        </p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter deal title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact *
              </label>
              <Select
                value={formData.contactId}
                onChange={(e) => handleInputChange('contactId', e.target.value)}
                required
              >
                <option value="">Select a contact</option>
                {contacts.map((contact) => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.firstName} {contact.lastName} - {contact.company}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stage *
              </label>
              <Select
                value={formData.stage}
                onChange={(e) => handleInputChange('stage', e.target.value)}
                required
              >
                <option value="">Select a stage</option>
                {stages.map((stage) => (
                  <option key={stage.Id} value={stage.Id}>
                    {stage.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Value
              </label>
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Probability (%)
              </label>
              <Input
                type="number"
                value={formData.probability}
                onChange={(e) => handleInputChange('probability', e.target.value)}
                placeholder="50"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Close Date
              </label>
              <Input
                type="date"
                value={formData.closeDate}
                onChange={(e) => handleInputChange('closeDate', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add deal notes or description"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2"
            >
              {saving && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
              <span>{saving ? 'Saving...' : (isEditing ? 'Update Deal' : 'Create Deal')}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DealForm