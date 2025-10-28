import React, { useState } from 'react'
import axios from 'axios'

function Create() {
  const [task, setTask] = useState('')
  const [loading, setLoading] = useState(false)
  const apiBase = `${window.location.protocol}//${window.location.hostname}:3001`
  const handleAdd = async (priority = 'medium') => {
    if (!task || !task.trim()) return
    setLoading(true)
    try {
      await axios.post(`${apiBase}/add`, { task: task.trim(), priority })
      // notify other components (Home) that a todo was added
      window.dispatchEvent(new Event('todo:added'))
      setTask('')
    } catch (err) {
      console.error('Failed to add task', err)
    } finally {
      setLoading(false)
    }
  }
    const [priority, setPriority] = useState('medium')
    return(
      <div className="create_form">
        <input
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <select value={priority} onChange={(e)=>setPriority(e.target.value)} aria-label="Priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="button" onClick={async ()=>{ await handleAdd(priority) }} disabled={loading || !task.trim()}>
          {loading ? 'Saving...' : (
            <>
              <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add Task
            </>
          )}
        </button>
      </div>
    )
}

export default Create