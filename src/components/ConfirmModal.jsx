import React from 'react'

export default function ConfirmModal({ open, title = 'Confirm', message = '', onConfirm, onCancel, confirmText = 'Yes', cancelText = 'Cancel' }){
  if (!open) return null
  return (
    <div className="modal-overlay">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h3 id="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel} type="button">{cancelText}</button>
          <button className="modal-confirm" onClick={onConfirm} type="button">{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
