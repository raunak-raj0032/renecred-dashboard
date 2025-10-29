'use client'

import React from 'react'
import { X, Trash2, ChevronUp } from 'lucide-react'

export default function DistributorFormUI({
  isEditing = false,
  distributor = {},
  onChange,
  onSubmit,
  onClose,
  onDelete,
}) {
  const handleChange = (e) => {
    const { id, value } = e.target
    onChange?.({ ...distributor, [id]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto border border-gray-200"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-red-700">
          {isEditing ? 'Edit Distributor' : 'Add New Distributor'}
        </h2>
        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={onDelete}
              className="text-gray-400 hover:text-red-600"
              title="Delete Distributor"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-red-600"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Collapsible Section */}
      <div className="p-4">
        <button
          type="button"
          className="w-full flex justify-between items-center bg-red-800 text-white p-3 rounded-t-md"
        >
          <span className="font-semibold">Distributor Details</span>
          <ChevronUp />
        </button>

        <div className="border border-t-0 border-gray-200 rounded-b-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Distributor ID */}
            <div className="flex flex-col">
              <label htmlFor="id" className="mb-1 text-sm font-medium text-gray-700">
                Distributor ID
              </label>
              <input
                type="text"
                id="id"
                value={distributor.id || ''}
                placeholder="Enter ID"
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                disabled={isEditing}
              />
            </div>

            {/* Distributor Name */}
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Distributor Name
              </label>
              <input
                type="text"
                id="name"
                value={distributor.name || ''}
                onChange={handleChange}
                placeholder="Enter name"
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={distributor.email || ''}
                onChange={handleChange}
                placeholder="Enter email"
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label htmlFor="phone_number" className="mb-1 text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                id="phone_number"
                value={distributor.phone_number || ''}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2 flex flex-col">
              <label htmlFor="address" className="mb-1 text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={distributor.address || ''}
                onChange={handleChange}
                placeholder="Enter address"
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            {/* State */}
<div className="flex flex-col">
  <label htmlFor="state" className="mb-1 text-sm font-medium text-gray-700">
    State
  </label>
  <input
    type="text"
    id="state"
    name="state"
    value={distributor.state || ''}
    onChange={handleChange}
    placeholder="Enter state"
    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
  />
</div>

            {/* City */}
            <div className="flex flex-col">
              <label htmlFor="city" className="mb-1 text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                value={distributor.city || ''}
                onChange={handleChange}
                placeholder="Enter city"
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            {/* Pincode */}
            <div className="flex flex-col">
              <label htmlFor="pin_code" className="mb-1 text-sm font-medium text-gray-700">
                Pincode
              </label>
              <input
                type="text"
                id="pin_code"
                value={distributor.pin_code || ''}
                onChange={handleChange}
                placeholder="Enter pincode"
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-start">
          <button
            type="submit"
            className="bg-red-700 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-red-800 transition-colors"
          >
            {isEditing ? 'Update Distributor' : 'Save Distributor'}
          </button>
        </div>
      </div>
    </form>
  )
}
