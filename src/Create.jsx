import React, { useState } from 'react'
import axios from 'axios'

function Create() {
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState('medium')
  const [loading, setLoading] = useState(false)
  // const apiBase = `${window.location.protocol}//${window.location.hostname}:3001` || "https://anshikastodobackend-1.onrender.com"
  const apiBase = "https://anshikastodobackend-1.onrender.com"
  const handleAdd = async () => {
    if (!task || !task.trim()) return
    setLoading(true)
    try {
      await axios.post(`${apiBase}/add`, { task: task.trim(), priority }) 
      window.dispatchEvent(new Event('todo:added'))
      setTask('')
    } catch (err) {
      console.error('Failed to add task', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create_form">
      <input
        type="text"
        placeholder="Enter Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !loading && task.trim() && handleAdd()}
      />
      <select 
        value={priority} 
        onChange={(e) => setPriority(e.target.value)} 
        aria-label="Priority"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button 
        type="button" 
        onClick={handleAdd} 
        disabled={loading || !task.trim()}
      >
        {loading ? 'Saving...' : 'Add Task'}
      </button>
    </div>
  )
}

export default Create