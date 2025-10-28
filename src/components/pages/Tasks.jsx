import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '@/components/molecules/SearchBar'
import FilterBar from '@/components/molecules/FilterBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services/api/taskService'
import { contactService } from '@/services/api/contactService'
import { formatDate } from '@/utils/formatters'
import { toast } from 'react-toastify'
import { cn } from '@/utils/cn'

function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  })

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      setLoading(true)
      setError(null)
      const [tasksData, contactsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll()
      ])
      setTasks(tasksData)
      setContacts(contactsData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(task) {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return
    }

    try {
      await taskService.delete(task.Id)
      setTasks(prev => prev.filter(t => t.Id !== task.Id))
      toast.success('Task deleted successfully')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  function handleFilterChange(key, value) {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  function handleClearFilters() {
    setFilters({
      status: '',
      priority: ''
    })
    setSearchQuery('')
  }

  function getContactName(contactId) {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.name : null
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = !filters.status || task.status === filters.status
    const matchesPriority = !filters.priority || task.priority === filters.priority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ]

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      options: statusOptions
    },
    {
      key: 'priority',
      label: 'Priority',
      options: priorityOptions
    }
  ]

  const activeFilterCount = Object.values(filters).filter(v => v).length

  function getStatusColor(status) {
    switch (status) {
      case 'completed':
        return 'bg-accent-100 text-accent-700'
      case 'in-progress':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  function getPriorityIcon(priority) {
    switch (priority) {
      case 'high':
        return 'AlertCircle'
      case 'medium':
        return 'AlertTriangle'
      case 'low':
        return 'Info'
      default:
        return 'Info'
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTasks} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-500 mt-1">Manage and track your tasks</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/tasks/new')}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>New Task</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search tasks..."
              onSearch={setSearchQuery}
            />
          </div>
          <FilterBar
            filters={filterConfig}
            activeFilters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {activeFilterCount > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">{activeFilterCount} filter(s) active</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-primary-600"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description={searchQuery || activeFilterCount > 0 ? "Try adjusting your search or filters" : "Get started by creating your first task"}
          action={
            <Button
              variant="primary"
              onClick={() => navigate('/tasks/new')}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Plus" size={16} />
              <span>Create Task</span>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => {
            const contactName = getContactName(task.contactId)
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
            
            return (
              <div
                key={task.Id}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => navigate(`/tasks/edit/${task.Id}`)}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={cn('text-xs', getStatusColor(task.status))}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                    <Badge className={cn('text-xs flex items-center gap-1', getPriorityColor(task.priority))}>
                      <ApperIcon name={getPriorityIcon(task.priority)} size={12} />
                      {task.priority}
                    </Badge>
                  </div>

                  {task.dueDate && (
                    <div className={cn(
                      'flex items-center text-sm',
                      isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'
                    )}>
                      <ApperIcon name="Calendar" size={14} className="mr-2" />
                      <span>Due {formatDate(task.dueDate)}</span>
                      {isOverdue && <span className="ml-1">(Overdue)</span>}
                    </div>
                  )}

                  {task.assignedTo && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="User" size={14} className="mr-2" />
                      <span>{task.assignedTo}</span>
                    </div>
                  )}

                  {contactName && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Users" size={14} className="mr-2" />
                      <span>{contactName}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Tasks