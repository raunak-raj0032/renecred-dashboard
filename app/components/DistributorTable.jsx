'use client'

import React, { useState, useEffect, useMemo } from 'react'
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
import { motion, AnimatePresence } from 'framer-motion'
import DistributorFormUI from './FormCard'
import DistributorDetailPanel from './DistributorDetailPanel' // ✅ Added import

export default function DistributorTable() {
  const dispatch = useDispatch()
  const { distributors, loading, error } = useSelector(
    (state) => state.distributors || {}
  )

  const distributorsList = distributors || []

  const [selectedDistributor, setSelectedDistributor] = useState(null) // ✅ Added for selection logic
  const [expandedRow, setExpandedRow] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    distributorId: '',
    distributorName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchDistributors())
  }, [dispatch])

  const handleRowToggle = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id))
  }

  // ✅ Added: open distributor detail view
  const handleRowClick = (distributor) => {
    setSelectedDistributor(distributor)
  }

  // ✅ Added: back to list view
  const handleBackToList = () => {
    setSelectedDistributor(null)
  }

  const handleAddNew = () => {
    setIsEditing(false)
    setFormData({
      distributorId: '',
      distributorName: '',
      registrationNumber: '',
      email: '',
      phone: '',
      address: '',
      state: '',
      city: '',
      pincode: '',
    })
    setIsModalOpen(true)
  }

  const handleEdit = (d) => {
    setIsEditing(true)
    setFormData({
      distributorId: d.id,
      distributorName: d.name,
      registrationNumber: d.registration_number,
      email: d.email,
      phone: d.phone_number,
      address: d.address,
      state: d.state,
      city: d.city,
      pincode: d.pin_code,
    })
    setIsModalOpen(true)
  }

  const handleDeleteClick = (d) => {
    setItemToDelete(d)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    try {
      await dispatch(deleteDistributor(itemToDelete.id)).unwrap()
    } catch (err) {
      console.error('❌ Delete failed:', err)
    }
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsConfirmOpen(true)
  }

  const confirmSave = async () => {
    try {
      if (isEditing) {
        await dispatch(
          updateDistributor({
            id: formData.distributorId,
            name: formData.distributorName,
            registration_number: formData.registrationNumber,
            email: formData.email,
            phone_number: formData.phone,
            address: formData.address,
            state: formData.state,
            city: formData.city,
            pin_code: formData.pincode,
          })
        ).unwrap()
      } else {
        await dispatch(
          createDistributor({
            name: formData.distributorName,
            registration_number: formData.registrationNumber,
            email: formData.email,
            phone_number: formData.phone,
            address: formData.address,
            state: formData.state,
            city: formData.city,
            pin_code: formData.pincode,
          })
        ).unwrap()
      }
      setIsModalOpen(false)
      setIsConfirmOpen(false)
    } catch (err) {
      console.error('❌ Save/Update failed:', err)
    }
  }

  // ✅ Added conditional rendering for detail view
  if (selectedDistributor) {
    return (
      <DistributorDetailPanel
        distributor={selectedDistributor}
        onBack={handleBackToList}
      />
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Distributors</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
          <button className="flex items-center gap-2 bg-white text-gray-600 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center gap-2 bg-white text-gray-600 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition">
            <Upload className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-red-900 text-white text-xs uppercase">
            <tr>
              <th className="p-3 w-16">#</th>
              <th className="p-3">Distributor ID</th>
              <th className="p-3">Distributor Name</th>
              <th className="p-3">Registration No.</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  Loading distributors...
                </td>
              </tr>
            )}

            {!loading && !error && distributorsList.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  No distributors found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              distributorsList.map((d, i) => (
                <React.Fragment key={d.id}>
                  <tr className="hover:bg-gray-50 transition">
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => handleRowToggle(d.id)}
                    >
                      {expandedRow === d.id ? (
                        <ChevronUp className="w-4 h-4 inline-block mr-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 inline-block mr-1" />
                      )}
                      {i + 1}
                    </td>
                    <td className="p-3 text-gray-600">{d.id}</td>

                    {/* ✅ Added onClick for selection */}
                    <td
                      className="p-3 text-red-600 font-medium cursor-pointer hover:underline"
                      onClick={() => handleRowClick(d)}
                    >
                      {d.name}
                    </td>

                    <td className="p-3 text-gray-600">{d.registration_number}</td>
                    <td className="p-3 text-gray-600">{d.email}</td>
                    <td className="p-3 text-gray-600">{d.phone_number}</td>
                    <td className="p-3">
                      <span className="px-3 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(d)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(d)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>

                  {expandedRow === d.id && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="rounded-t-lg overflow-hidden border border-gray-200">
                          {/* Header */}
                          <div className="grid grid-cols-4 bg-rose-100 text-gray-800 text-sm font-semibold">
                            <div className="py-2 px-3 border-r border-gray-200">
                              Address
                            </div>
                            <div className="py-2 px-3 border-r border-gray-200">
                              City
                            </div>
                            <div className="py-2 px-3 border-r border-gray-200">
                              State
                            </div>
                            <div className="py-2 px-3">Pincode</div>
                          </div>

                          {/* Data Row */}
                          <div className="grid grid-cols-4 bg-white text-gray-700 text-sm">
                            <div className="py-2 px-3 border-t border-gray-100">
                              {d.address}
                            </div>
                            <div className="py-2 px-3 border-t border-gray-100">
                              {d.city}
                            </div>
                            <div className="py-2 px-3 border-t border-gray-100">
                              {d.state}
                            </div>
                            <div className="py-2 px-3 border-t border-gray-100">
                              {d.pin_code}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
{/* ADD/EDIT FORM MODAL */}
<AnimatePresence>
  {isModalOpen && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-4xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <DistributorFormUI
          isEditing={isEditing}
          distributor={{
            id: formData.distributorId,
            name: formData.distributorName,
            registration_number: formData.registrationNumber,
            email: formData.email,
            phone_number: formData.phone,
            address: formData.address,
            state: formData.state,
            city: formData.city,
            pin_code: formData.pincode,
          }}
          onChange={(updated) =>
            setFormData({
              distributorId: updated.id,
              distributorName: updated.name,
              registrationNumber: updated.registration_number,
              email: updated.email,
              phone: updated.phone_number,
              address: updated.address,
              state: updated.state,
              city: updated.city,
              pincode: updated.pin_code,
            })
          }
          onSubmit={handleSave}
          onClose={() => setIsModalOpen(false)}
          onDelete={isEditing ? () => handleDeleteClick(formData) : undefined}
        />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      {/* SAVE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isConfirmOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {isEditing ? 'Confirm Update' : 'Confirm Save'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {isEditing
                  ? 'Are you sure you want to update this distributor’s details?'
                  : 'Are you sure you want to save this new distributor?'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Delete Distributor
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-red-600">
                  {itemToDelete?.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
