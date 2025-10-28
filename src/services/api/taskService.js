import mockTasks from '@/services/mockData/tasks.json'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let tasks = [...mockTasks]
let nextId = Math.max(...tasks.map(t => t.Id), 0) + 1

export const taskService = {
  async getAll() {
    await delay(400)
    return tasks.map(task => ({ ...task }))
  },

  async getById(id) {
    await delay(300)
    const task = tasks.find(t => t.Id === parseInt(id))
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  },

  async create(taskData) {
    await delay(500)
    
    const newTask = {
      Id: nextId++,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      assignedTo: taskData.assignedTo || '',
      contactId: taskData.contactId ? parseInt(taskData.contactId) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, taskData) {
    await delay(500)
    
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const existingTask = tasks[index]
    const updatedTask = {
      ...existingTask,
      title: taskData.title !== undefined ? taskData.title : existingTask.title,
      description: taskData.description !== undefined ? taskData.description : existingTask.description,
      status: taskData.status !== undefined ? taskData.status : existingTask.status,
      priority: taskData.priority !== undefined ? taskData.priority : existingTask.priority,
      dueDate: taskData.dueDate !== undefined ? taskData.dueDate : existingTask.dueDate,
      assignedTo: taskData.assignedTo !== undefined ? taskData.assignedTo : existingTask.assignedTo,
      contactId: taskData.contactId !== undefined ? (taskData.contactId ? parseInt(taskData.contactId) : null) : existingTask.contactId,
      updatedAt: new Date().toISOString()
    }
    
    tasks[index] = updatedTask
    return { ...updatedTask }
  },

  async delete(id) {
    await delay(400)
    
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const deletedTask = tasks[index]
    tasks.splice(index, 1)
    return { ...deletedTask }
  },

  async getByContactId(contactId) {
    await delay(300)
    return tasks
      .filter(t => t.contactId === parseInt(contactId))
      .map(task => ({ ...task }))
  }
}