'use client'

import React from 'react'
import clsx from 'clsx'

type ConfirmationModalProps = {
  isOpen: boolean
  title: string
  description: string
  onCancel: () => void
  onConfirm: () => void
  cancelText?: string
  confirmText?: string
  confirmClassName?: string
}

export default function ConfirmationModal({
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
  cancelText = 'No',
  confirmText = 'Yes',
  confirmClassName = 'text-red-600 font-semibold', // Default style from image
}: ConfirmationModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    // Modal Overlay
    <div
      onClick={onCancel} // Close modal on overlay click
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
    >
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
        className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden"
      >
        {/* Top Part: Title & Description */}
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-200" />

        {/* Bottom Part: Buttons */}
        <div className="flex">
          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="flex-1 p-4 text-center text-gray-700 font-medium hover:bg-gray-50 rounded-bl-xl focus:outline-none"
          >
            {cancelText}
          </button>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            className={clsx(
              'flex-1 p-4 text-center font-medium border-l border-gray-200 hover:bg-gray-50 rounded-br-xl focus:outline-none',
              confirmClassName
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
