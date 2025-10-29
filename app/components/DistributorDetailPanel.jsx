'use client'

import React, { useState, useMemo } from 'react'
import {
  ChevronLeft,
  Filter,
  Upload,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  Plus,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FarmerForm from './FarmerForm'
import ConfirmationModal from './ConfirmationModal'
import { useSelector, useDispatch } from 'react-redux'
import {
  createFarmer,
  updateFarmer,
  deleteFarmer,
  fetchDistributors,
} from '../redux/distributorsSlice'
import { fetchFarmerById } from '../redux/farmersSlice'

// ✅ Card for small stats
const StatCard = ({ title, value, changeText, changeColor, iconUrl, iconAlt, valueColor, trendType }) => {
  const TrendIcon = trendType === 'up' ? TrendingUp : TrendingDown
  return (
    <div className="rounded-xl p-4 border border-gray-200 flex items-center justify-between bg-white shadow-sm">
      <div>
        <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
        <p className={`text-2xl font-semibold ${valueColor}`}>{value}</p>
        {trendType !== 'none' && (
          <p className={`text-xs flex items-center gap-1 ${changeColor}`}>
            <TrendIcon className="w-3 h-3" />
            {changeText}
          </p>
        )}
      </div>
      <div className="p-2 rounded-full bg-gray-100 border border-gray-200">
        <img
          src={iconUrl}
          alt={iconAlt}
          className="w-6 h-6 opacity-70"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/24x24/eee/999?text=${iconAlt.charAt(0) || '?'}`
          }}
        />
      </div>
    </div>
  )
}

export default function DistributorDetailPanel({ distributor, onBack }) {
  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState('inward')
  const [isFarmerFormOpen, setIsFarmerFormOpen] = useState(false)
  const [editFarmerData, setEditFarmerData] = useState(null)
  const [formMode, setFormMode] = useState('add')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [deleteTargetFarmerId, setDeleteTargetFarmerId] = useState(null)
  const [formTitle, setFormTitle] = useState('Add Farmer')

  const distributorsState = useSelector((state) => state.distributors)
  const farmersState = useSelector((state) => state.farmers)
  const distributors = distributorsState?.data || []
  const selectedFarmer = farmersState?.selectedFarmer || null

  const currentDistributor = useMemo(
    () => distributors.find((d) => d.id === distributor.id) || distributor,
    [distributors, distributor]
  )

  const farmers = currentDistributor?.farmers || []
  const inwards = currentDistributor?.inwards || []

  // ✅ Convert API farmer object → form-compatible data
  const mapApiFarmerToForm = (apiFarmer) => ({
    farmerDetails: {
      distributor_id: apiFarmer.distributor || '',
      farmerId: apiFarmer.id || '',
      farmerName: apiFarmer.farmer_name || '',
      whatsappNo: apiFarmer.whatsapp_no || '',
      phoneNo: apiFarmer.phone_no || '',
      email: apiFarmer.email || '',
      address: apiFarmer.address || '',
      state: apiFarmer.state || '',
      city: apiFarmer.city || '',
      pinCode: apiFarmer.pin_code || '',
      aadharNo: apiFarmer.aadhar_no || '',
    },
    cattleList: (apiFarmer.cattle || []).map((c) => ({
      id: c.cattle_id || c.id || `CA-${Math.random().toString(36).slice(2, 8)}`,
      age: c.age_range || '',
      weight: c.weight_range || '',
      type: c.cattle_type || '',
    })),
  })

  // ✅ Convert form → API payload
  const mapFormToApiPayload = (formData) => {
    const fd = formData.farmerDetails || {}
    const cattleList = formData.cattleList || []
    return {
      farmer_name: fd.farmerName,
      whatsapp_no: fd.whatsappNo,
      phone_no: fd.phoneNo,
      email: fd.email,
      address: fd.address,
      city: fd.city,
      state: fd.state,
      pin_code: fd.pinCode,
      aadhar_no: fd.aadharNo,
      total_cattle: cattleList.length,
      cattle: cattleList.map((c) => ({
        cattle_id: c.id ? String(c.id) : undefined,
        age_range: c.age,
        weight_range: c.weight,
        cattle_type: c.type,
      })),
    }
  }

  // ✅ Add New Farmer
  const handleAddFarmer = () => {
    setEditFarmerData(null)
    setFormMode('add')
    setFormTitle('Add Farmer')
    setIsFarmerFormOpen(true)
  }

const handleEditFarmer = async (farmer) => {
  setFormMode('edit')
  setFormTitle('Edit Farmer')

  try {
    const result = await dispatch(fetchFarmerById(farmer.id)).unwrap()

    // ✅ Map API response → form structure
    const mappedData = mapApiFarmerToForm(result)

    // ✅ Clone object to always create a new reference
    setEditFarmerData({ ...mappedData })

    // ✅ Open form
    setIsFarmerFormOpen(true)

    console.log('🟢 Edit farmer triggered. New editFarmerData:', mappedData)
  } catch (err) {
    console.error('❌ Failed to fetch farmer details:', err)
    alert('Failed to load farmer details. Please try again.')
  }
}


  // ✅ Save farmer (add or update)
  const handleSaveFarmer = async (formData) => {
    const distributorId = currentDistributor?.id
    if (!distributorId) return

    const payload = mapFormToApiPayload(formData)

    try {
      if (formMode === 'add') {
        await dispatch(createFarmer({ distributorId, farmer: payload })).unwrap()
      } else {
        const farmerId = formData.farmerDetails?.farmerId
        if (!farmerId) return
        await dispatch(updateFarmer({ id: farmerId, updates: payload })).unwrap()
      }

      setIsFarmerFormOpen(false)
      await dispatch(fetchDistributors())
    } catch (err) {
      console.error('❌ Failed to save farmer:', err)
    }
  }

  // ✅ Delete Farmer flow
  const confirmDeleteFarmer = (farmerId) => {
    setDeleteTargetFarmerId(farmerId)
    setShowConfirmModal(true)
  }

  const handleConfirmModal = async () => {
    const distributorId = currentDistributor?.id
    if (!distributorId || !deleteTargetFarmerId) return
    await dispatch(deleteFarmer(deleteTargetFarmerId)).unwrap()
    setDeleteTargetFarmerId(null)
    setShowConfirmModal(false)
    await dispatch(fetchDistributors())
  }


  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="p-6 space-y-6 bg-white rounded-lg"
      >
        {/* HEADER */}
        <div className="flex items-center gap-2 text-[#991b1b]">
          <button onClick={onBack} className="flex items-center text-gray-500 hover:text-[#991b1b] transition p-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {currentDistributor?.name || 'N/A'}
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#8b5cf6] rounded-xl p-4 border border-[#a78bfa] flex items-center justify-between text-white shadow-sm">
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold mb-1">Your orders are growing strong 💪</h3>
              <p className="text-2xl font-bold">450 <span className="text-lg font-semibold text-gray-100">Total sales</span></p>
              <p className="text-xs text-[#a7f3d0] flex items-center gap-1">+22% Compared to last month</p>
            </div>
            <img src="/icons/promo-bag.svg" alt="Growing Orders Graphic" className="w-20 h-20 opacity-90"/>
          </div>

          <StatCard title="Total Stock"
            value={inwards.reduce((acc, i) => acc + (i.total_quantity || 0), 0) - inwards.reduce((acc, i) => acc + (i.used_quantity || 0), 0)}
            changeText="5% more than last month" changeColor="text-green-600"
            iconUrl="/icons/store.svg" iconAlt="Store Icon" valueColor="text-gray-800" trendType="up"
          />

          <StatCard title="Total Farmers"
            value={farmers.length} changeText="5% more than last month" changeColor="text-green-600"
            iconUrl="/icons/user-group.svg" iconAlt="Farmers Icon" valueColor="text-gray-800" trendType="up"
          />

          <StatCard title="Total Orders"
            value={currentDistributor?.totalOrders || 0} changeText="5% less than last month" changeColor="text-red-600"
            iconUrl="/icons/shopping-cart.svg" iconAlt="Orders Icon" valueColor="text-gray-800" trendType="down"
          />
        </div>

        {/* Overview & Address */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white">
            <h3 className="font-semibold text-gray-800 text-base">Overview</h3>
            <hr className="my-3 border-gray-200" />
            {[
              ['Distributor Name', currentDistributor?.name],
              ['Registration No.', currentDistributor?.registration_number],
              ['Email', currentDistributor?.email],
              ['Phone No.', currentDistributor?.phone_number],
              ['City', currentDistributor?.city],
              ['State', currentDistributor?.state],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-b-0">
                <dt className="text-sm font-semibold text-gray-700">{label}</dt>
                <dd className="text-sm text-gray-600">{value || '—'}</dd>
              </div>
            ))}
          </div>

          <div className="border border-gray-200 rounded-lg shadow-sm flex overflow-hidden bg-white">
            <div className="w-1/2 flex-shrink-0 bg-gray-200 flex items-center justify-center text-gray-500 text-sm min-h-[200px]">🗺️ Map Placeholder</div>
            <div className="p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">Address</h4>
              <p className="text-sm text-gray-600 mt-1">{currentDistributor?.address || 'No address available'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="flex items-center gap-2 p-4 relative">
            {['inward', 'farmers', 'orders'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 text-sm font-medium transition-all rounded-md border ${activeTab === tab ? 'bg-white text-[#991b1b] font-semibold shadow-sm border-gray-200' : 'text-gray-500 hover:text-[#991b1b] border-transparent'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-3">
              <button onClick={handleAddFarmer} className="flex items-center gap-2 bg-[#dc2626] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                <Plus className="w-3 h-3 text-white" strokeWidth={2}/> Add New
              </button>
              <button className="flex items-center gap-2 bg-white text-[#4b5563] px-3 py-2 rounded-md text-sm font-medium border border-[#d1d5db] hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 text-[#6b7280]" strokeWidth={2}/> Filters
              </button>
              <button className="flex items-center gap-2 bg-white text-[#4b5563] px-3 py-2 rounded-md text-sm font-medium border border-[#d1d5db] hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4 text-[#6b7280]" strokeWidth={2}/> Export
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeTab === 'inward' && (
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="text-xs text-[#991b1b] font-semibold bg-[#fef2f2]">
                      <tr>
                        <th className="text-left px-2 py-2">SR. NO</th>
                        <th className="text-left px-2 py-2">DISPATCH ID</th>
                        <th className="text-left px-2 py-2">FEED CONCENTRATOR</th>
                        <th className="text-left px-2 py-2">USED QTY</th>
                        <th className="text-left px-2 py-2">TOTAL QTY</th>
                        <th className="text-right px-2 py-2">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {inwards.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-2 py-2 text-gray-700">{idx + 1}</td>
                          <td className="px-2 py-2 text-gray-700">{item.dispatch_id}</td>
                          <td className="px-2 py-2 text-gray-700">{item.feed_concentrator}</td>
                          <td className="px-2 py-2 text-gray-700">{item.used_quantity}</td>
                          <td className="px-2 py-2 text-gray-700">{item.total_quantity}</td>
                          <td className="px-2 py-2 text-right">
                            <button className="text-gray-400 hover:text-blue-600 p-1"><Pencil className="w-4 h-4" /></button>
                            <button className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'farmers' && (
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-gray-600 font-semibold bg-[#fef2f2]">
                      <tr>
                        <th className="text-left px-4 py-3">SR. NO</th>
                        <th className="text-left px-4 py-3">FARMER</th>
                        <th className="text-left px-4 py-3">WHATSAPP NO.</th>
                        <th className="text-left px-4 py-3">PHONE NO.</th>
                        <th className="text-left px-4 py-3">TOTAL CATTLE</th>
                        <th className="text-right px-4 py-3">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {farmers.map((farmer, idx) => (
                        <tr key={farmer.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">{idx + 1}</td>
                          <td className="px-4 py-3 text-gray-900 font-medium">{farmer.farmer_name}</td>
                          <td className="px-4 py-3 text-gray-700">{farmer.whatsapp_no}</td>
                          <td className="px-4 py-3 text-gray-700">{farmer.phone_no}</td>
                          <td className="px-4 py-3 text-gray-700">{farmer.total_cattle || 0}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => handleEditFarmer(farmer)} className="text-gray-400 hover:text-blue-600 p-1"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => confirmDeleteFarmer(farmer.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="p-6 text-gray-600 text-sm">Orders data will go here...</div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Are you sure?"
        description="Do you want to delete this farmer?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleConfirmModal}
        onCancel={() => { setShowConfirmModal(false); setDeleteTargetFarmerId(null) }}
      />

<FarmerForm 
distributor={currentDistributor}
        isOpen={isFarmerFormOpen}
        onClose={() => setIsFarmerFormOpen(false)}
        onSave={handleSaveFarmer}
        initialData={editFarmerData}
        titleOverride={formTitle}
        mode={formMode}
      />
    </>
  )
}
