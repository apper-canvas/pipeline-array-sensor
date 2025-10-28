import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services/api/taskService'
import { contactService } from '@/services/api/contactService'
import { toast } from 'react-toastify'

function TaskForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const [loading, setLoading] = useState(isEditMode)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [contacts, setContacts] = useState([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    contactId: ''
  })

  useEffect(() => {
    loadInitialData()
  }, [id])

  async function loadInitialData() {
    try {
      setLoading(true)
      setError(null)
      
      const contactsData = await contactService.getAll()
      setContacts(contactsData)

      if (isEditMode) {
        const taskData = await taskService.getById(id)
        setFormData({
          title: taskData.title,
          description: taskData.description || '',
          status: taskData.status,
          priority: taskData.priority,
          dueDate: taskData.dueDate ? taskData.dueDate.split('T')[0] : '',
          assignedTo: taskData.assignedTo || '',
          contactId: taskData.contactId || ''
        })
      }
    } catch (err) {
      setError(err.message)
      toast.error(isEditMode ? 'Failed to load task' : 'Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    try {
      setSaving(true)
      
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      }

      if (isEditMode) {
        await taskService.update(id, taskData)
        toast.success('Task updated successfully')
      } else {
        await taskService.create(taskData)
        toast.success('Task created successfully')
      }
      
      navigate('/tasks')
    } catch (err) {
      toast.error(isEditMode ? 'Failed to update task' : 'Failed to create task')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadInitialData} />

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          <span>Back to Tasks</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEditMode ? 'Update task details' : 'Add a new task to your list'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows={4}
          />
        </div>

        {/* Status and Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
        </div>

        {/* Due Date and Assigned To Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
              Assigned To
            </label>
            <Input
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Enter assignee name"
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <label htmlFor="contactId" className="block text-sm font-medium text-gray-700 mb-2">
            Related Contact
          </label>
          <Select
            id="contactId"
            name="contactId"
            value={formData.contactId}
            onChange={handleChange}
          >
            <option value="">Select a contact (optional)</option>
            {contacts.map(contact => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name} - {contact.company}
              </option>
            ))}
          </Select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/tasks')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="flex items-center space-x-2"
          >
            {saving ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} />
                <span>{isEditMode ? 'Update Task' : 'Create Task'}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm