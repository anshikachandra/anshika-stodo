import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Create from './Create'
import ConfirmModal from './components/ConfirmModal'

function Home() {
    const [todos, setTodos] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState('')
    const [editPriority, setEditPriority] = useState('medium')
    const [modal, setModal] = useState({ open: false })
    const apiBase = `${window.location.protocol}//${window.location.hostname}:3001`
    
    useEffect(() => {
        let mounted = true
        const fetchTodos = () => {
            axios.get(`${apiBase}/get`)
            .then(result => {
                if (!mounted) return
                if (Array.isArray(result.data)) {
                    const normalized = result.data.map(t => ({ 
                        ...t, 
                        priority: (t.priority ?? 'medium').toLowerCase() 
                    }))
                    setTodos(normalized)
                } else {
                    setTodos([])
                }
            })
            .catch(err => console.error('Failed to load todos', err))
        }

        fetchTodos()
        const onAdded = () => fetchTodos()
        window.addEventListener('todo:added', onAdded)
        return () => { 
            mounted = false
            window.removeEventListener('todo:added', onAdded) 
        }
    }, [apiBase])

    const startEdit = (todo) => {
        setEditingId(todo._id ?? todo.id)
        setEditText(todo.task)
        setEditPriority((todo.priority ?? 'medium').toLowerCase())
    }

    const saveEdit = async (id) => {
        try {
            const updated = await axios.patch(`${apiBase}/update/${id}`, { 
                task: editText, 
                priority: editPriority 
            })
            const newVal = updated.data ?? updated
            setTodos(prev => prev.map(t => ( (t._id ?? t.id) === id ? newVal : t)))
            setEditingId(null)
            setEditText('')
            setEditPriority('medium')
        } catch (err) {
            console.error('Failed to save edit', err)
        }
    }

    const toggleComplete = async (todo) => {
        const id = todo._id ?? todo.id
        try {
            const updated = await axios.patch(`${apiBase}/update/${id}`, { 
                completed: !todo.completed 
            })
            setTodos(prev => prev.map(t => (
                (t._id ?? t.id) === id ? updated.data ?? updated : t
            )))
        } catch (err) {
            console.error('Failed to toggle complete', err)
        }
    }

    const clearCompleted = async () => {
        const completed = todos.filter(t => t.completed)
        if (completed.length === 0) return
        setModal({
            open: true,
            title: 'Clear completed',
            message: `Delete ${completed.length} completed task(s)?`,
            action: async () => {
                try {
                    await Promise.all(
                        completed.map(t => axios.delete(`${apiBase}/delete/${t._id ?? t.id}`))
                    )
                    setTodos(prev => prev.filter(t => !t.completed))
                } catch (err) {
                    console.error('Failed to clear completed', err)
                }
            }
        })
    }
    
    const priorityRank = (p) => ({ 'high': 0, 'medium': 1, 'low': 2 }[String(p).toLowerCase()] ?? 1)
    
    const sortedTodos = todos.slice().sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        return priorityRank(a.priority) - priorityRank(b.priority)
    })
    return (
        <div className="app-container">
          <div className="app-card">
            <div className="header-row">
                <h2>Todo List</h2>
                <div className="meta">
                    <span className="count">Total: {todos.length}</span>
                    <span className="count">Remaining: {todos.filter(t => !t.completed).length}</span>
                    <button className="clear-btn" onClick={clearCompleted}>
                        Clear completed
                    </button>
                </div>
            </div>
            <Create />
            {todos.length === 0 ? (
                <div><h3>No Records</h3></div>
            ) : (
                sortedTodos.map(todo => {
                    const id = todo._id ?? todo.id ?? todo.task
                    const isEditing = editingId === id
                    return (
                        <div className={`todo-item ${todo.completed ? 'completed' : ''}`} key={id}>
                            <input 
                                type="checkbox" 
                                checked={!!todo.completed} 
                                onChange={() => toggleComplete(todo)} 
                            />
                            {isEditing ? (
                                <>
                                    <input 
                                        className="edit-input" 
                                        value={editText} 
                                        onChange={(e) => setEditText(e.target.value)} 
                                    />
                                    <select 
                                        className="edit-priority" 
                                        value={editPriority} 
                                        onChange={(e) => setEditPriority(e.target.value)} 
                                        aria-label="Edit priority"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                    <button 
                                        className="save-btn" 
                                        onClick={() => saveEdit(id)}
                                    >
                                        Save
                                    </button>
                                    <button 
                                        className="cancel-btn" 
                                        onClick={() => {
                                            setEditingId(null)
                                            setEditText('')
                                            setEditPriority('medium')
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="todo-task">{todo.task}</span>
                                    <span className={`priority-badge priority-${(todo.priority ?? 'medium').toLowerCase()}`}>
                                        {(todo.priority ?? 'medium').toUpperCase()}
                                    </span>
                                    <div className="actions">
                                        <button 
                                            className="edit-btn" 
                                            onClick={() => startEdit(todo)} 
                                            title="Edit"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => {
                                                setModal({
                                                    open: true,
                                                    title: 'Delete task',
                                                    message: 'Delete this task?',
                                                    action: async () => {
                                                        try {
                                                            await axios.delete(`${apiBase}/delete/${id}`)
                                                            setTodos(prev => prev.filter(t => (t._id ?? t.id) !== id))
                                                        } catch (err) {
                                                            console.error('Failed to delete', err)
                                                        }
                                                    }
                                                })
                                            }} 
                                            title="Delete"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })
            )}

            <ConfirmModal 
                open={modal.open} 
                title={modal.title} 
                message={modal.message} 
                onConfirm={async () => { 
                    await (modal.action?.())
                    setModal({ open: false }) 
                }} 
                onCancel={() => setModal({ open: false })} 
                confirmText={'Yes'} 
                cancelText={'No'} 
            />
          </div>
        </div>
    )
}

export default Home