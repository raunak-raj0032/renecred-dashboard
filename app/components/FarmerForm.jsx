'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchDistributors,
  createFarmer,
  updateFarmer,
  createCattle,
  updateCattle,
  deleteCattle,
  fetchCattle,
} from '@/app/redux/distributorsSlice'
import { X, ChevronDown, Pencil, Trash2, Check, XCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid' // used only for client-temp ids; add `uuid` to your deps if not present
import ConfirmationModal from './ConfirmationModal' // <- modal you provided

// ---------------- Helper Components ----------------
const FormInput = ({ label, id, name, placeholder, type = 'text', value, onChange, disabled = false }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-[#b91c1c] focus:border-[#b91c1c] ${disabled ? 'bg-gray-100' : ''}`}
    />
  </div>
)

const FormSelect = ({ label, id, name, value, onChange, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-[#b91c1c] focus:border-[#b91c1c]"
    >
      {children}
    </select>
  </div>
)

const AccordionSection = ({ title, isOpen, onToggle, children }) => (
  <div className="border border-gray-300 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center p-4 bg-[#b91c1c] text-white font-semibold"
    >
      {title}
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 bg-white">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

// ---------------- Utility: map DB record <-> UI record ----------------
const normalizeCattleFromServer = (r) => ({
  id: r.id,
  cattleId: r.cattle_id,
  age: r.age_range,
  weight: r.weight_range,
  type: r.cattle_type,
})

const serverPayloadFromUI = (ui) => ({
  // `ui` may be { age, weight, type } plus we set cattle_id and farmer_id externally
  age_range: ui.age,
  weight_range: ui.weight,
  cattle_type: ui.type,
})

// ---------------- Main Component ----------------
const FarmerForm = ({
  distributor,              // distributor prop
  mode = 'add',
  initialData = null,
  onSave,
  onDelete,
  onClose,
  isOpen,
  titleOverride,
}) => {
  const dispatch = useDispatch()
  // slice structure expects state.distributors to contain arrays: distributors, farmers, cattle
  const { distributors, farmers, cattle, loading, selectedDistributor } = useSelector(state => state.distributors)

  const defaultFarmerState = {
    distributor_id: distributor?.id || '',
    farmerId: '',
    farmerName: '',
    whatsappNo: '',
    phoneNo: '',
    email: '',
    address: '',
    state: '',
    city: '',
    pinCode: '',
    aadharNo: '',
    status: 'Active',
  }

  // local UI state (farmer details + cattle list)
  const [farmerDetails, setFarmerDetails] = useState(initialData?.farmerDetails || defaultFarmerState)
  // UI cattle items use fields: id (temp or server id), age, weight, type
  const [cattleList, setCattleList] = useState(initialData?.cattleList?.map(c => ({ ...c })) || [])
  const [cattleInput, setCattleInput] = useState({ age: '2-5 years', weight: '680-1090', type: 'Cow', total: 1 })
  const [openSections, setOpenSections] = useState({ farmerDetails: true, cattleDetails: true })
  const [editCattleId, setEditCattleId] = useState(null)
  const [isAddingCattle, setIsAddingCattle] = useState(!initialData?.cattleList?.length)

  // Pending operations to apply on Save
  const [deletedCattleIds, setDeletedCattleIds] = useState([]) // real ids scheduled for delete
  const [pendingUpdatedCattle, setPendingUpdatedCattle] = useState({}) // { [id]: { age, weight, type } }

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmDesc, setConfirmDesc] = useState('')
  const [confirmConfirmText, setConfirmConfirmText] = useState('Yes')
  const [confirmCancelText, setConfirmCancelText] = useState('No')
  const [confirmClassName, setConfirmClassName] = useState('text-red-600 font-semibold')
  const [confirmAction, setConfirmAction] = useState(() => () => {}) // function to run on confirm

  // fetch distributors when modal opens
  useEffect(() => {
    if (isOpen) dispatch(fetchDistributors())
  }, [dispatch, isOpen])

  // prefill distributor_id when distributor prop changes
  useEffect(() => {
    if (distributor) {
      setFarmerDetails(prev => ({ ...prev, distributor_id: distributor.id }))
    }
  }, [distributor])

  // when edit mode and initialData provided, set states and fetch cattle for this farmer
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFarmerDetails(initialData.farmerDetails || defaultFarmerState)
      setCattleList((initialData.cattleList || []).map(c => ({ ...c })))
      setDeletedCattleIds([])
      setPendingUpdatedCattle({})

      // fetch all cattle and filter by farmer id (since APIs are flat)
      const farmerId = initialData.farmerDetails?.farmerId || initialData.farmerDetails?.id
      if (farmerId) {
        dispatch(fetchCattle())
          .then(resp => {
            const all = resp?.payload || []
            const filtered = all
              .filter(x => x.farmer_id === farmerId)
              .map(normalizeCattleFromServer)
            if (filtered.length) setCattleList(filtered)
          })
          .catch(err => {
            console.error('Failed to fetch cattle for farmer:', err)
          })
      }
    } else if (mode === 'add') {
      setFarmerDetails(defaultFarmerState)
      setCattleList([])
      setDeletedCattleIds([])
      setPendingUpdatedCattle({})
    }
  }, [mode, initialData, dispatch])

  // ---------- Handlers ----------
  const handleFarmerChange = e => {
    const { name, value } = e.target
    setFarmerDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleCattleInputChange = e => {
    const { name, value } = e.target
    setCattleInput(prev => ({ ...prev, [name]: value }))
  }

  const handleToggleSection = section => setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))

  // confirmation helper
  const openConfirm = ({ title = 'Confirm', description = '', confirmText = 'Yes', cancelText = 'No', className = 'text-red-600 font-semibold', action = () => {} }) => {
    setConfirmTitle(title)
    setConfirmDesc(description)
    setConfirmConfirmText(confirmText)
    setConfirmCancelText(cancelText)
    setConfirmClassName(className)
    setConfirmAction(() => action)
    setConfirmOpen(true)
  }

  const closeConfirm = () => {
    setConfirmOpen(false)
    // small delay clear to avoid stale closures (not strictly required)
    setTimeout(() => {
      setConfirmAction(() => () => {})
    }, 200)
  }

  // Generate a temp client id for new cattle when farmer does not exist yet.
  const makeTempCattleId = () => `temp-${uuidv4()}`

  // Add cattle locally (always use temp ids). Changes only applied to backend on Save.
  const handleAddCattle = () => {
    const total = parseInt(cattleInput.total)
    if (!total || total <= 0) { alert('Enter valid number'); return }

    const newEntries = []
    for (let i = 0; i < total; i++) {
      const id = makeTempCattleId()
      const { total: _t, ...data } = cattleInput
      newEntries.push({ id, ...data })
    }
    setCattleList(prev => [...prev, ...newEntries])

    setCattleInput({ age: '2-5 years', weight: '680-1090', type: 'Cow', total: 1 })
    setIsAddingCattle(false)
  }

  const handleEditCattle = cattle => {
    setEditCattleId(cattle.id)
    setCattleInput({ age: cattle.age, weight: cattle.weight, type: cattle.type, total: 1 })
    setIsAddingCattle(false)
  }

  // Update cattle locally. If it's a real id, add to pendingUpdatedCattle so save will persist it.
  const handleUpdateCattle = () => {
    if (!editCattleId) return

    if (String(editCattleId).startsWith('temp-')) {
      setCattleList(prev => prev.map(c =>
        c.id === editCattleId ? { ...c, age: cattleInput.age, weight: cattleInput.weight, type: cattleInput.type } : c
      ))
    } else {
      setCattleList(prev => prev.map(c =>
        c.id === editCattleId ? { ...c, age: cattleInput.age, weight: cattleInput.weight, type: cattleInput.type } : c
      ))

      setPendingUpdatedCattle(prev => ({
        ...prev,
        [editCattleId]: { age: cattleInput.age, weight: cattleInput.weight, type: cattleInput.type }
      }))
    }

    setEditCattleId(null)
    setCattleInput({ age: '2-5 years', weight: '680-1090', type: 'Cow', total: 1 })
  }

  // schedule deletion through confirmation modal
  const scheduleDeleteCattle = (id) => {
    // remove from UI immediately
    setCattleList(prev => prev.filter(c => c.id !== id))

    // schedule delete for Save
    setDeletedCattleIds(prev => {
      if (prev.includes(id)) return prev
      return [...prev, id]
    })

    // remove any pending update for this id
    setPendingUpdatedCattle(prev => {
      if (!prev[id]) return prev
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  // Handler to open confirm modal for cattle deletion
  const handleDeleteCattle = (id) => {
    openConfirm({
      title: 'Delete Cattle',
      description: 'Are you sure you want to delete this cattle entry? This will remove it on save.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      className: 'text-red-600 font-semibold',
      action: () => {
        scheduleDeleteCattle(id)
        closeConfirm()
      }
    })
  }

  // delete farmer (use confirmation modal)
  const confirmDeleteFarmer = () => {
    openConfirm({
      title: 'Delete Farmer',
      description: 'Are you sure you want to delete this farmer? This action cannot be undone.',
      confirmText: 'Yes, Delete',
      cancelText: 'No',
      className: 'text-red-600 font-semibold',
      action: async () => {
        try {
          // call provided onDelete (your parent handles dispatch)
          onDelete?.(farmerDetails)
        } catch (err) {
          console.error('Failed to delete farmer:', err)
        } finally {
          closeConfirm()
          onClose()
        }
      }
    })
  }

  // When saving the whole farmer (create or update)
  const handleMainSave = async () => {
    const payload = {
      distributor_id: farmerDetails.distributor_id,
      farmer_name: farmerDetails.farmerName,
      whatsapp_no: farmerDetails.whatsappNo,
      phone_no: farmerDetails.phoneNo,
      email: farmerDetails.email,
      address: farmerDetails.address,
      state: farmerDetails.state,
      city: farmerDetails.city,
      pin_code: farmerDetails.pinCode,
      aadhar_no: farmerDetails.aadharNo,
      total_cattle: cattleList.length,
      status: farmerDetails.status,
    }

    try {
      if (mode === 'edit') {
        // 🧠 Check if farmer details actually changed
        const currentFarmer = farmers?.find(f => f.id === farmerDetails.farmerId)
        const hasFarmerChanges =
          currentFarmer &&
          Object.keys(payload).some(key => currentFarmer[key] !== payload[key])

        const hasTempCattle = cattleList.some(c => String(c.id).startsWith('temp-'))
        const hasDeletedCattle = deletedCattleIds.length > 0
        const hasPendingUpdates = Object.keys(pendingUpdatedCattle).length > 0

        // If nothing changed, close
        if (!hasFarmerChanges && !hasTempCattle && !hasDeletedCattle && !hasPendingUpdates) {
          console.log('No changes detected, skipping update.')
          onClose()
          return
        }

        // Update farmer if needed
        if (hasFarmerChanges) {
          await dispatch(updateFarmer({ id: farmerDetails.farmerId, updates: payload })).unwrap()
          console.log('✅ Farmer updated successfully')
        }

        // Create temp cattle on backend
        if (hasTempCattle) {
          const temps = cattleList.filter(c => String(c.id).startsWith('temp-'))
          for (const t of temps) {
            try {
              const createPayload = {
                farmer_id: farmerDetails.farmerId,
                cattle_id: uuidv4(),
                ...serverPayloadFromUI(t),
              }
              const res = await dispatch(createCattle(createPayload)).unwrap()
              setCattleList(prev =>
                prev.map(c => (c.id === t.id ? normalizeCattleFromServer(res) : c))
              )
            } catch (err) {
              console.error('❌ Failed to create cattle after farmer update:', err)
            }
          }
        }

        // Apply pending updates
        if (Object.keys(pendingUpdatedCattle).length > 0) {
          for (const [id, upd] of Object.entries(pendingUpdatedCattle)) {
            try {
              const updates = {
                age_range: upd.age,
                weight_range: upd.weight,
                cattle_type: upd.type,
              }
              const res = await dispatch(updateCattle({ id, updates })).unwrap()
              const normalized = normalizeCattleFromServer(res)
              setCattleList(prev => prev.map(c => (c.id === normalized.id ? normalized : c)))
            } catch (err) {
              console.error(`❌ Failed to update cattle ${id}:`, err)
            }
          }
          setPendingUpdatedCattle({})
        }

        // Delete scheduled cattle
        if (hasDeletedCattle) {
          for (const id of deletedCattleIds) {
            try {
              await dispatch(deleteCattle(id)).unwrap()
              console.log(`🗑️ Deleted cattle ${id}`)
            } catch (err) {
              console.error(`❌ Failed to delete cattle ${id}:`, err)
            }
          }
          setDeletedCattleIds([]) // clear after successful deletion
        }

      } else {
        // Create new farmer first
        const createdFarmer = await dispatch(createFarmer(payload)).unwrap()
        setFarmerDetails(prev => ({ ...prev, farmerId: createdFarmer.id }))

        // Create cattle added locally
        const temps = cattleList.filter(c => String(c.id).startsWith('temp-'))
        const createdCattle = []
        for (const t of temps) {
          try {
            const createPayload = {
              farmer_id: createdFarmer.id,
              cattle_id: uuidv4(),
              ...serverPayloadFromUI(t),
            }
            const res = await dispatch(createCattle(createPayload)).unwrap()
            createdCattle.push(normalizeCattleFromServer(res))
          } catch (err) {
            console.error('❌ Failed to create cattle after farmer creation:', err)
          }
        }

        setCattleList(prev => {
          const nonTemps = prev.filter(c => !String(c.id).startsWith('temp-'))
          return [...nonTemps, ...createdCattle]
        })

        console.log('✅ Farmer created successfully', createdFarmer)
      }

      // After successful local updates, close and trigger parent onSave
      onClose()
      onSave?.()

    } catch (err) {
      console.error('❌ Failed to save farmer:', err)
      alert('Failed to save farmer. Check console for details.')
    }
  }

  // wrapper to confirm save before executing handleMainSave
  const confirmAndSave = () => {
    openConfirm({
      title: mode === 'edit' ? 'Confirm Update' : 'Confirm Save',
      description: mode === 'edit'
        ? 'Are you sure you want to save the changes to this farmer (includes pending cattle changes)?'
        : 'Are you sure you want to save this new farmer and its cattle?',
      confirmText: mode === 'edit' ? 'Save Changes' : 'Save',
      cancelText: 'Cancel',
      className: 'text-green-600 font-semibold',
      action: async () => {
        try {
          await handleMainSave()
        } finally {
          closeConfirm()
        }
      }
    })
  }

  const handleDeleteFarmer = () => {
    // Keep old semantics but use modal
    confirmDeleteFarmer()
  }

  const totalCattleCount = cattleList.length
  const title = titleOverride || (mode === 'edit' ? 'Edit Farmer' : 'New Farmer')
  const saveButtonText = mode === 'edit' ? 'Save Changes' : 'Save'

  // ---------- Dirty-checking logic to enable/disable Save ----------
  const isFarmerChanged = useMemo(() => {
    if (mode === 'edit') {
      const currentFarmer = farmers?.find(f => f.id === farmerDetails.farmerId)
      if (!currentFarmer) return true
      const payload = {
        distributor_id: farmerDetails.distributor_id,
        farmer_name: farmerDetails.farmerName,
        whatsapp_no: farmerDetails.whatsappNo,
        phone_no: farmerDetails.phoneNo,
        email: farmerDetails.email,
        address: farmerDetails.address,
        state: farmerDetails.state,
        city: farmerDetails.city,
        pin_code: farmerDetails.pinCode,
        aadhar_no: farmerDetails.aadharNo,
        total_cattle: cattleList.length,
        status: farmerDetails.status,
      }
      return Object.keys(payload).some(key => currentFarmer[key] !== payload[key])
    } else {
      // add mode: if any non-default field provided, treat as changed
      return Object.keys(defaultFarmerState).some(k => {
        if (k === 'distributor_id') return (farmerDetails.distributor_id || '') !== (defaultFarmerState.distributor_id || '')
        return (farmerDetails[k] || '') !== (defaultFarmerState[k] || '')
      })
    }
  }, [mode, farmerDetails, farmers, cattleList.length])

  const hasTempCattle = cattleList.some(c => String(c.id).startsWith('temp-'))
  const hasPendingUpdates = Object.keys(pendingUpdatedCattle).length > 0
  const hasDeletedCattle = deletedCattleIds.length > 0

  const isDirty = isFarmerChanged || hasTempCattle || hasPendingUpdates || hasDeletedCattle

  // <<--- IMPORTANT: only return null here AFTER hooks & memos have run, so hook order never changes
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-white border-b border-gray-300">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-3">
            {mode === 'edit' && (
              <button onClick={handleDeleteFarmer} className="text-gray-400 hover:text-red-600" title="Delete Farmer">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-red-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 bg-gray-50 max-h-[80vh] overflow-y-auto space-y-6">
          <AccordionSection title="Farmer Details" isOpen={openSections.farmerDetails} onToggle={() => handleToggleSection('farmerDetails')}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              <FormInput
                label="Distributor"
                id="distributor"
                name="distributor_id"
                value={`${distributor?.name || 'N/A'} (${distributor?.id || '—'})`}
                disabled
              />

              <FormInput label="Farmer Id" id="farmerId" name="farmerId" placeholder="Enter Farmer Id" value={farmerDetails.farmerId} onChange={handleFarmerChange} disabled={mode==='edit'} />
              <FormInput label="Farmer Name" id="farmerName" name="farmerName" placeholder="Enter Farmer name" value={farmerDetails.farmerName} onChange={handleFarmerChange} />
              <FormInput label="WhatsApp no." id="whatsappNo" name="whatsappNo" placeholder="Enter WhatsApp no." value={farmerDetails.whatsappNo} onChange={handleFarmerChange} />
              <FormInput label="Phone no." id="phoneNo" name="phoneNo" placeholder="Enter phone no." value={farmerDetails.phoneNo} onChange={handleFarmerChange} />
              <FormInput label="Email" id="email" name="email" placeholder="Enter email address" type="email" value={farmerDetails.email} onChange={handleFarmerChange} />
              <FormInput label="Address" id="address" name="address" placeholder="Enter address" value={farmerDetails.address} onChange={handleFarmerChange} />
              <FormInput label="State" id="state" name="state" placeholder="Enter state" value={farmerDetails.state} onChange={handleFarmerChange} />
              <FormInput label="City" id="city" name="city" placeholder="Enter city" value={farmerDetails.city} onChange={handleFarmerChange} />
              <FormInput label="Pin Code" id="pinCode" name="pinCode" placeholder="Enter pincode" value={farmerDetails.pinCode} onChange={handleFarmerChange} />
              <FormInput label="Aadhar No." id="aadharNo" name="aadharNo" placeholder="Enter Aadhar No." value={farmerDetails.aadharNo} onChange={handleFarmerChange} />
              <FormSelect label="Status" id="status" name="status" value={farmerDetails.status} onChange={handleFarmerChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </FormSelect>
              <FormInput label="Total No. of Cattle" id="totalCattle" name="totalCattle" value={totalCattleCount} disabled />
            </div>
          </AccordionSection>

          <AccordionSection title="Cattle Details" isOpen={openSections.cattleDetails} onToggle={() => handleToggleSection('cattleDetails')}>
            {isAddingCattle || editCattleId ? (
              <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
                <h3 className="font-medium mb-4 text-gray-800">{editCattleId ? 'Edit Cattle Entry' : 'Add Cattle Entry'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <FormSelect label="Age Range" id="age" name="age" value={cattleInput.age} onChange={handleCattleInputChange}>
                    <option value="2-5 years">2-5 years</option>
                    <option value="6-10 years">6-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </FormSelect>

                  <FormSelect label="Weight Range (kg)" id="weight" name="weight" value={cattleInput.weight} onChange={handleCattleInputChange}>
                    <option value="680-1090">680-1090</option>
                    <option value="1100-1500">1100-1500</option>
                    <option value="1500+">1500+</option>
                  </FormSelect>

                  <FormSelect label="Cattle Type" id="type" name="type" value={cattleInput.type} onChange={handleCattleInputChange}>
                    <option value="Cow">Cow</option>
                    <option value="Buffalo">Buffalo</option>
                    <option value="Other">Other</option>
                  </FormSelect>

                  {!editCattleId && <FormInput label="Total Cattle to Add" id="total" name="total" type="number" value={cattleInput.total} onChange={handleCattleInputChange} />}
                </div>

                <div className="flex gap-3 mt-6">
                  {editCattleId ? (
                    <>
                      <button onClick={handleUpdateCattle} className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"><Check className="w-4 h-4" />Update</button>
                      <button onClick={() => setEditCattleId(null)} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2"><XCircle className="w-4 h-4" />Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleAddCattle} className="bg-[#b91c1c] text-white px-5 py-2 rounded-md hover:bg-[#991b1b] flex items-center gap-2"><Check className="w-4 h-4" />Add</button>
                      <button onClick={() => setIsAddingCattle(false)} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2"><XCircle className="w-4 h-4" />Cancel</button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <button onClick={() => setIsAddingCattle(true)} className="bg-[#b91c1c] text-white px-4 py-2 rounded-md hover:bg-[#991b1b] text-sm font-medium">+ Add Cattle</button>
              </div>
            )}

            {cattleList.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full bg-white text-sm">
                  <thead className="bg-gray-100 text-gray-700 font-medium">
                    <tr>
                      <th className="px-4 py-2 text-left">Cattle ID</th>
                      <th className="px-4 py-2 text-left">Age Range</th>
                      <th className="px-4 py-2 text-left">Weight Range</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cattleList.map(cattle => (
                      <tr key={cattle.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2">{cattle.cattleId ?? cattle.id}</td>
                        <td className="px-4 py-2">{cattle.age}</td>
                        <td className="px-4 py-2">{cattle.weight}</td>
                        <td className="px-4 py-2">{cattle.type}</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditCattle(cattle)} className="text-blue-600 hover:text-blue-800" title="Edit"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteCattle(cattle.id)} className="text-red-600 hover:text-red-800" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-gray-500 italic">No cattle details added yet.</p>}
          </AccordionSection>
        </div>

        <div className="flex justify-end gap-4 px-6 py-4 border-t bg-white">
          <button onClick={onClose} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300">Cancel</button>
          <button
            onClick={confirmAndSave}
            disabled={!isDirty}
            className={`px-5 py-2 rounded-md ${isDirty ? 'bg-[#b91c1c] text-white hover:bg-[#991b1b]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {saveButtonText}
          </button>
        </div>
      </div>

      {/* Confirmation modal reused for all confirmations */}
      <ConfirmationModal
        isOpen={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        onCancel={() => {
          closeConfirm()
        }}
        onConfirm={() => {
          try {
            confirmAction()
          } catch (err) {
            console.error('Error running confirm action:', err)
          } finally {
            // the specific action should call closeConfirm when appropriate,
            // but close here as a safe fallback
            closeConfirm()
          }
        }}
        cancelText={confirmCancelText}
        confirmText={confirmConfirmText}
        confirmClassName={confirmClassName}
      />
    </div>
  )
}

export default FarmerForm
