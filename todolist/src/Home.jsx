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
                // defend against unexpected shapes and normalize priority to lowercase
                if (Array.isArray(result.data)) {
                    const normalized = result.data.map(t => ({ ...t, priority: (t.priority ?? 'medium').toLowerCase() }))
                    setTodos(normalized)
                } else setTodos([])
            })
            .catch(err => console.error('Failed to load todos', err))
        }

        // initial load
        fetchTodos()

        // listen for created todos and refresh
        const onAdded = () => fetchTodos()
        window.addEventListener('todo:added', onAdded)

        return () => { mounted = false; window.removeEventListener('todo:added', onAdded) }
    }, [])

    const startEdit = (todo) => {
        setEditingId(todo._id ?? todo.id)
        setEditText(todo.task)
        setEditPriority((todo.priority ?? 'medium').toLowerCase())
    }

    const saveEdit = async (id) => {
        try {
            const updated = await axios.patch(`${apiBase}/update/${id}`, { task: editText, priority: editPriority })
            // updated may be the document or wrapped; normalize
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
            const updated = await axios.patch(`${apiBase}/update/${id}`, { completed: !todo.completed })
            setTodos(prev => prev.map(t => ((t._id ?? t.id) === id ? updated.data ?? updated : t)))
        } catch (err) {
            console.error('Failed to toggle complete', err)
        }
    }

    const clearCompleted = async () => {
        const completed = todos.filter(t => t.completed)
        if (completed.length === 0) return
        // open modal to confirm
        setModal({
            open: true,
            title: 'Clear completed',
            message: `Delete ${completed.length} completed task(s)?`,
            action: async () => {
                try {
                    await Promise.all(completed.map(t => axios.delete(`${apiBase}/delete/${t._id ?? t.id}`)))
                    setTodos(prev => prev.filter(t => !t.completed))
                } catch (err) {
                    console.error('Failed to clear completed', err)
                }
            }
        })
    }
    // prepare sorted list: incomplete first, then by priority (high, medium, low)
    const priorityRank = (p) => ({'high':0,'medium':1,'low':2}[String(p).toLowerCase()] ?? 1)
    const sortedTodos = todos.slice().sort((a,b) => {
        if ((a.completed === b.completed) === false) return a.completed ? 1 : -1
        const pa = priorityRank(a.priority)
        const pb = priorityRank(b.priority)
        return pa - pb
    })
    return (
        <div className="app-container">
          <div className="app-card">
            <div className="header-row">
                <h2>Todo List</h2>
                <div className="meta">
                    <span className="count">Total: {todos.length}</span>
                    <span className="count">Remaining: {todos.filter(t=>!t.completed).length}</span>
                    <button className="clear-btn" onClick={clearCompleted}>Clear completed</button>
                </div>
            </div>
            <Create/>
            {
                todos.length === 0
                ? (
                    <div><h3>No Records</h3></div>
                ) : (
                    // sorted list
                    sortedTodos.map(todo => {
                        const id = todo._id ?? todo.id ?? todo.task
                        const isEditing = editingId === id
                        return (
                        <div className={`todo-item ${todo.completed ? 'completed' : ''}`} key={id}>
                            <input type="checkbox" checked={!!todo.completed} onChange={() => toggleComplete(todo)} />
                            {isEditing ? (
                                <>
                                                                        <input className="edit-input" value={editText} onChange={(e)=>setEditText(e.target.value)} />
                                                                        <select className="edit-priority" value={editPriority} onChange={(e)=>setEditPriority(e.target.value)} aria-label="Edit priority">
                                                                            <option value="low">Low</option>
                                                                            <option value="medium">Medium</option>
                                                                            <option value="high">High</option>
                                                                        </select>
                                    <button className="save-btn" onClick={()=>saveEdit(id)}>Save</button>
                                    <button className="cancel-btn" onClick={()=>{setEditingId(null); setEditText(''); setEditPriority('medium')}}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span className="todo-task">{todo.task}</span>
                                    <span className={`priority-badge priority-${(todo.priority ?? 'medium').toLowerCase()}`}>{(todo.priority ?? 'medium').toUpperCase()}</span>
                                    <div className="actions">
                                                                                <button className="edit-btn" onClick={()=>startEdit(todo)} title="Edit">
                                                                                    <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                                                        <path d="M3 21v-3.75L17.81 2.44a2 2 0 0 1 2.83 0l.92.92a2 2 0 0 1 0 2.83L6.75 21H3z" stroke="currentColor" strokeWidth="0" fill="currentColor" />
                                                                                    </svg>
                                                                                    Edit
                                                                                </button>
                                                                                <button className="delete-btn" onClick={()=>{
                                            setModal({
                                                open: true,
                                                title: 'Delete task',
                                                message: 'Delete this task?',
                                                action: async () => {
                                                    try {
                                                        await axios.delete(`${apiBase}/delete/${id}`)
                                                        setTodos(prev => prev.filter(t => (t._id ?? t.id) !== id))
                                                    } catch (err) { console.error('Failed to delete', err) }
                                                }
                                            })
                                                                                }} title="Delete">
                                                                                    <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                                                        <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="0" fill="currentColor" />
                                                                                    </svg>
                                                                                    Delete
                                                                                </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )})
                )
            }

            <ConfirmModal open={modal.open} title={modal.title} message={modal.message} onConfirm={async ()=>{ await (modal.action?.()); setModal({open:false}) }} onCancel={()=>setModal({open:false})} confirmText={'Yes'} cancelText={'No'} />
          </div>
        </div>
    )
}

export default Home