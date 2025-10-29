'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchDistributors,
  createDistributor,
  updateDistributor,
  deleteDistributor,
} from '@/app/redux/distributorsSlice'

import {
  Plus,
  Filter,
  Upload,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

import FormCard from './FormCard'
import ConfirmationModal from './ConfirmationModal'
import DistributorDetailPanel from './DistributorDetailPanel'

export default function DistributorTable() {
  const dispatch = useDispatch()
  // NOTE: updated to match the new slice shape
  const { distributors, loading, error } = useSelector((state) => state.distributors || {})

  // safe array to avoid runtime .length errors
  const distributorsList = distributors || []

  const [selectedDistributor, setSelectedDistributor] = useState(null)
  const [expandedRow, setExpandedRow] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchDistributors())
  }, [dispatch])

  // --- Handlers ---
  const handleRowToggle = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id))
  }

  const handleRowClick = (distributor) => {
    setSelectedDistributor(distributor)
  }

  const handleBackToList = () => {
    setSelectedDistributor(null)
  }

  const handleAddNew = () => {
    setEditData(null)
    setIsModalOpen(true)
  }

  const handleEdit = (data) => {
    const formData = {
      distributorId: data.id,
      distributorName: data.name,
      registrationNumber: data.registration_number,
      email: data.email,
      phone: data.phone_number,
      address: data.address,
      state: data.state,
      city: data.city,
      pincode: data.pin_code,
    }
    setEditData(formData)
    setIsModalOpen(true)
  }

  const handleSave = async (formData) => {
    const payload = {
      name: formData.distributorName,
      registration_number: formData.registrationNumber || 'N/A',
      email: formData.email,
      phone_number: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pin_code: formData.pincode,
    }

    try {
      if (editData?.distributorId) {
        await dispatch(
          updateDistributor({
            id: editData.distributorId,
            updates: payload,
          })
        ).unwrap()
      } else {
        await dispatch(createDistributor(payload)).unwrap()
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error('❌ Failed to save distributor:', err)
    }
  }

  const handleClose = () => setIsModalOpen(false)

  const handleDeleteClick = (distributor) => {
    setItemToDelete(distributor)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    try {
      await dispatch(deleteDistributor(itemToDelete.id)).unwrap()
    } catch (err) {
      console.error('❌ Failed to delete distributor:', err)
    }
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
  }

  // --- Conditional Render for Detail View ---
  if (selectedDistributor) {
    return (
      <DistributorDetailPanel
        distributor={selectedDistributor}
        onBack={handleBackToList}
      />
    )
  }

  // --- Main Table ---
  return (
    <div className="bg-white rounded-lg p-6 border border-[#e5e7eb] relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Distributors</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-[#dc2626] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <span className="flex items-center justify-center w-5 h-5 border border-white rounded-full">
              <Plus className="w-3 h-3 text-white" strokeWidth={2} />
            </span>
            Add New
          </button>
          <button className="flex items-center gap-2 bg-white text-[#4b5563] px-3 py-2 rounded-md text-sm font-medium border border-[#d1d5db] hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 text-[#6b7280]" strokeWidth={2} />
            Filters
          </button>
          <button className="flex items-center gap-2 bg-white text-[#4b5563] px-3 py-2 rounded-md text-sm font-medium border border-[#d1d5db] hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 text-[#6b7280]" strokeWidth={2} />
            Export
          </button>
        </div>
      </div>

      <hr className="mb-6 border-t border-[#e5e7eb]" />

      {/* Table */}
      <div className="overflow-x-auto border border-[#e5e7eb] rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#991b1b] text-white text-xs uppercase">
            <tr>
              <th className="p-3 w-16">#</th>
              <th className="p-3">Distributor ID</th>
              <th className="p-3">Distributor Name</th>
              <th className="p-3">Registration No.</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone No.</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5e7eb]">
            {loading && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  Loading distributors...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && distributorsList.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No distributors found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              distributorsList.map((d, i) => (
                <React.Fragment key={d.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 text-[#6b7280]">
                      <span
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleRowToggle(d.id)}
                      >
                        {expandedRow === d.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        {i + 1}
                      </span>
                    </td>

                    <td className="p-3 text-[#6b7280]">{d.id}</td>

                    <td
                      className="p-3 text-[#dc2626] font-semibold hover:underline cursor-pointer"
                      onClick={() => handleRowClick(d)}
                    >
                      {d.name}
                    </td>

                    <td className="p-3 text-[#6b7280]">{d.registration_number}</td>
                    <td className="p-3 text-[#6b7280]">{d.email}</td>
                    <td className="p-3 text-[#6b7280]">{d.phone_number}</td>

                    <td className="p-3 text-[#6b7280]">
                      <span className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                        Active
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center border border-[#d1d5db] rounded-md p-1 w-fit">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(d)
                          }}
                          className="text-[#9ca3af] hover:text-[#2563eb] p-0.5 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-[#d1d5db] mx-1"></div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(d)
                          }}
                          className="text-[#9ca3af] hover:text-[#ef4444] p-0.5 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedRow === d.id && (
                    <tr key={`${d.id}-details`} className="bg-white">
                      <td colSpan={8} className="p-0">
                        <div className="w-full">
                          <table className="w-full text-sm">
                            <thead className="bg-[#fce7f3]">
                              <tr>
                                <th className="p-3 text-left font-medium text-[#374151] w-1/2">
                                  Address
                                </th>
                                <th className="p-3 text-left font-medium text-[#374151]">
                                  City
                                </th>
                                <th className="p-3 text-left font-medium text-[#374151]">
                                  State
                                </th>
                                <th className="p-3 text-left font-medium text-[#374151]">
                                  Pincode
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-white">
                                <td className="p-3 text-[#6b7280]">{d.address}</td>
                                <td className="p-3 text-[#6b7280]">{d.city}</td>
                                <td className="p-3 text-[#6b7280]">{d.state}</td>
                                <td className="p-3 text-[#6b7280]">{d.pin_code}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 text-sm text-[#4b5563]">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select className="border border-[#d1d5db] rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-red-500">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span>Page 1 of 1</span>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-md border border-[#d1d5db] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-1.5 rounded-md border border-[#d1d5db] hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-4xl mx-4">
            <FormCard
              title={editData ? 'Edit Distributor' : 'Add Distributor'}
              collapsibleTitle="Distributor Details"
              saveButtonText={editData ? 'Update' : 'Save'}
              onClose={handleClose}
              onSave={handleSave}
              initialData={editData}
              saveConfirmTitle={editData ? 'Confirm Update' : 'Confirm Save'}
              saveConfirmDescription={
                editData
                  ? 'Are you sure you want to update this distributor’s details?'
                  : 'Are you sure you want to save this new distributor?'
              }
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Distributor"
        description={`Are you sure you want to delete ${itemToDelete?.name || 'this distributor'}? This action cannot be undone.`}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirmText="Yes, Delete"
        confirmClassName="text-red-600 font-semibold"
      />
    </div>
  )
}
