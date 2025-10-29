'use client'

// Added useState
import React, { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
// Added import for the modal
import ConfirmationModal from './ConfirmationModal' // Assuming modal is in the same directory

// ✅ Renamed from `FormData` → `DistributorFormData` to avoid conflict with global FormData
export type DistributorFormData = {
  distributorId: string
  distributorName: string
  email: string
  phone: string
  address: string
  state: string
  city: string
  pincode: string
}

type FormCardProps = {
  title: string
  collapsibleTitle: string
  saveButtonText: string
  onClose: () => void
  onSave: (formData: DistributorFormData) => void
  initialData?: DistributorFormData | null
  // Props for the new save confirmation
  saveConfirmTitle: string
  saveConfirmDescription: string
}

export default function FormCard({
  title,
  collapsibleTitle,
  saveButtonText,
  onClose,
  onSave,
  initialData = null,
  saveConfirmTitle, // Destructure new prop
  saveConfirmDescription, // Destructure new prop
}: FormCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true)

  // State to manage the SAVE confirmation modal
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false)

  const [formData, setFormData] = useState<DistributorFormData>({
    distributorId: '',
    distributorName: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      // Reset form when initialData is null (e.g., switching from edit to add)
      setFormData({
        distributorId: '',
        distributorName: '',
        email: '',
        phone: '',
        address: '',
        state: '',
        city: '',
        pincode: '',
      })
    }
  }, [initialData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // --- Modal Handlers for SAVE ---
  // 1. User clicks the 'Save' or 'Update' button
  const handleRequestSave = () => {
    setIsSaveConfirmOpen(true) // Open the save modal
  }

  // 2. User clicks 'No' on the save modal
  const handleCancelSave = () => {
    setIsSaveConfirmOpen(false) // Just close the modal
  }

  // 3. User clicks 'Yes' on the save modal
  const handleConfirmSave = () => {
    setIsSaveConfirmOpen(false) // Close the modal
    onSave(formData) // Call the original onSave prop
  }
  // ---

  const FormField = ({
    label,
    name,
    placeholder,
  }: {
    label: string
    name: keyof DistributorFormData
    placeholder: string
  }) => (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
      />
    </div>
  )

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-red-700">{title}</h2>
          <button
            onClick={onClose} // Reverted to call onClose directly
            className="text-gray-400 hover:text-red-600"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Collapsible Section Header */}
          <button
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="w-full flex justify-between items-center bg-red-800 text-white p-3 rounded-t-md"
          >
            <span className="font-semibold">{collapsibleTitle}</span>
            {isDetailsOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {/* Collapsible Content */}
          {isDetailsOpen && (
            <div className="border border-t-0 border-gray-200 rounded-b-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  label="Distributor ID"
                  name="distributorId"
                  placeholder="Enter Distributor ID"
                />
                <FormField
                  label="Distributor Name"
                  name="distributorName"
                  placeholder="Enter Distributor Name"
                />
                <FormField
                  label="Email"
                  name="email"
                  placeholder="Enter email address"
                />
                <FormField
                  label="Phone no."
                  name="phone"
                  placeholder="Enter phone no."
                />

                <div className="md:col-span-2">
                  <FormField
                    label="Address"
                    name="address"
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <option value="">Select State</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                    <option value="Texas">Texas</option>
                  </select>
                </div>

                <FormField label="City" name="city" placeholder="Enter city" />
                <FormField
                  label="Pin Code"
                  name="pincode"
                  placeholder="Enter Pincode"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-start">
            <button
              onClick={handleRequestSave} // Updated to trigger save confirmation
              className="bg-red-700 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-red-800 transition-colors"
            >
              {saveButtonText}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Render for SAVE/UPDATE */}
      <ConfirmationModal
        isOpen={isSaveConfirmOpen}
        title={saveConfirmTitle}
        description={saveConfirmDescription}
        onCancel={handleCancelSave}
        onConfirm={handleConfirmSave}
        confirmText="Yes"
      />
    </>
  )
}

