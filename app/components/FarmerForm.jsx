'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchDistributors,
  createFarmer,
  updateFarmer,
  createCattle,
  updateCattle,
  deleteCattle,
  fetchAllCattle,
} from '@/app/redux/distributorsSlice'
import { X, ChevronDown, Pencil, Trash2, Check, XCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid' // used only for client-temp ids; add `uuid` to your deps if not present

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
  const { data: distributors, loading, selectedDistributor } = useSelector(state => state.distributors)

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
  }

  // When creating cattle before farmer exists, we need local temp ids.
  // We'll convert them after farmer is created by saving to backend.
  const [farmerDetails, setFarmerDetails] = useState(initialData?.farmerDetails || defaultFarmerState)
  const [cattleList, setCattleList] = useState(initialData?.cattleList?.map(c => ({ ...c })) || [])
  const [cattleInput, setCattleInput] = useState({ age: '2-5 years', weight: '680-1090', type: 'Cow', total: 1 })
  const [openSections, setOpenSections] = useState({ farmerDetails: true, cattleDetails: true })
  const [editCattleId, setEditCattleId] = useState(null)
  const [isAddingCattle, setIsAddingCattle] = useState(!initialData?.cattleList?.length)

  // fetch distributors when modal opens
  useEffect(() => {
    if (isOpen) dispatch(fetchDistributors())
  }, [dispatch, isOpen])

  // prefill distributor_id when distributor changes
  useEffect(() => {
    if (distributor) {
      setFarmerDetails(prev => ({ ...prev, distributor_id: distributor.id }))
    }
  }, [distributor])

  // when edit mode and initialData provided, set states
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFarmerDetails(initialData.farmerDetails || defaultFarmerState)
      // make sure cattleList references are fresh copies
      setCattleList((initialData.cattleList || []).map(c => ({ ...c })))
      // fetch cattle from backend if farmer id exists (keeps store in sync)
const farmerId = initialData.farmerDetails?.farmerId || initialData.farmerDetails?.id
const distributorId = distributor?.id // ✅ Use the distributor prop directly
console.log(distributorId)
if (farmerId && distributorId) {
  dispatch(fetchAllCattle({ distributorId, farmerId }))
    .then(resp => {
      if (resp?.payload?.length) setCattleList(resp.payload)
    })
}
    } else if (mode === 'add') {
      setFarmerDetails(defaultFarmerState)
      setCattleList([])
    }
  }, [mode, initialData, dispatch, distributor])

  if (!isOpen) return null

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

  // Generate a temp client id for new cattle when farmer does not exist yet.
  const makeTempCattleId = () => `temp-${uuidv4()}`

  const handleAddCattle = async () => {
    const total = parseInt(cattleInput.total)
    if (!total || total <= 0) { alert('Enter valid number'); return }

    // When editing an existing farmer (mode === 'edit'), we should create each cattle on backend immediately
    if (mode === 'edit' && farmerDetails.farmerId) {
      const created = []
      for (let i = 0; i < total; i++) {
        const payload = {
          age: cattleInput.age,
          weight: cattleInput.weight,
          type: cattleInput.type,
        }
        try {
          const res = await dispatch(createCattle({
            distributorId: farmerDetails.distributor_id,
            farmerId: farmerDetails.farmerId,
            cattle: payload
          })).unwrap()
          // server returns saved cattle (with real id)
          created.push(res)
        } catch (err) {
          console.error('Failed to create cattle:', err)
          alert('Failed to add one or more cattle. Check console.')
        }
      }
      setCattleList(prev => [...prev, ...created])
    } else {
      // add locally with temp IDs until farmer is created
      const newEntries = []
      for (let i = 0; i < total; i++) {
        const id = makeTempCattleId()
        const { total: _t, ...data } = cattleInput
        newEntries.push({ id, ...data })
      }
      setCattleList(prev => [...prev, ...newEntries])
    }

    setCattleInput({ age: '2-5 years', weight: '680-1090', type: 'Cow', total: 1 })
    setIsAddingCattle(false)
  }

  const handleEditCattle = cattle => {
    setEditCattleId(cattle.id)
    setCattleInput({ age: cattle.age, weight: cattle.weight, type: cattle.type, total: 1 })
    setIsAddingCattle(false)
  }

  const handleUpdateCattle = async () => {
    if (!editCattleId) return

    // If cattle id is a temp id (client-only), update local list only
    if (String(editCattleId).startsWith('temp-')) {
      setCattleList(prev => prev.map(c =>
        c.id === editCattleId ? { ...c, age: cattleInput.age, weight: cattleInput.weight, type: cattleInput.type } : c
      ))
    } else {
      // persist update to backend
      try {
        const res = await dispatch(updateCattle({
          distributorId: farmerDetails.distributor_id,
          farmerId: farmerDetails.farmerId,
          cattleId: editCattleId,
          updates: { age: cattleInput.age, weight: cattleInput.weight, type: cattleInput.type }
        })).unwrap()
        // overwrite in local list with server-returned record
        setCattleList(prev => prev.map(c => (c.id === res.id ? res : c)))
      } catch (err) {
        console.error('Failed to update cattle:', err)
        alert('Failed to update cattle. Check console.')
      }
    }

    setEditCattleId(null)
    setCattleInput({ age: '2-5 years', weight: '680-1090', type: 'Cow', total: 1 })
  }

  const handleDeleteCattle = async (id) => {
    if (!window.confirm('Delete this cattle entry?')) return

    // If temp id => just remove locally
    if (String(id).startsWith('temp-')) {
      setCattleList(prev => prev.filter(c => c.id !== id))
      return
    }

    // If in edit mode and real id, call backend then remove
    try {
      if (mode === 'edit') {
        await dispatch(deleteCattle({
          distributorId: farmerDetails.distributor_id,
          farmerId: farmerDetails.farmerId,
          cattleId: id
        })).unwrap()
      }
      setCattleList(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Failed to delete cattle:', err)
      alert('Failed to delete cattle. Check console.')
    }
  }

  // When saving the whole farmer (create or update)
  const handleMainSave = async () => {
    const payload = {
      farmer_name: farmerDetails.farmerName,
      whatsapp_no: farmerDetails.whatsappNo,
      phone_no: farmerDetails.phoneNo,
      email: farmerDetails.email,
      address: farmerDetails.address,
      state: farmerDetails.state,
      city: farmerDetails.city,
      pin_code: farmerDetails.pinCode,
      aadhar_no: farmerDetails.aadharNo,
      total_cattle: cattleList.filter(c => !String(c.id).startsWith('temp-')).length + cattleList.filter(c => String(c.id).startsWith('temp-')).length,
    }

    try {
      if (mode === 'edit') {
        // update farmer
        const updatedFarmer = await dispatch(updateFarmer({
          distributorId: farmerDetails.distributor_id,
          farmerId: farmerDetails.farmerId,
          updates: payload
        })).unwrap()
        // if there remain any temp-cattle (shouldn't normally happen in edit mode) create them now
        const temps = cattleList.filter(c => String(c.id).startsWith('temp-'))
        for (const t of temps) {
          const res = await dispatch(createCattle({
            distributorId: farmerDetails.distributor_id,
            farmerId: farmerDetails.farmerId,
            cattle: { age: t.age, weight: t.weight, type: t.type }
          })).unwrap()
          // replace temp with server record
          setCattleList(prev => prev.map(c => c.id === t.id ? res : c))
        }

        console.log('Farmer updated successfully', updatedFarmer)
      } else {
        // create farmer first
        const createdFarmer = await dispatch(createFarmer({
          distributorId: farmerDetails.distributor_id,
          farmer: payload
        })).unwrap()

        // If we created the farmer, create cattle that were added locally (temps)
        const temps = cattleList.filter(c => String(c.id).startsWith('temp-'))
        const createdCattle = []
        for (const t of temps) {
          try {
            const res = await dispatch(createCattle({
              distributorId: createdFarmer.distributor_id,
              farmerId: createdFarmer.id || createdFarmer.farmerId || createdFarmer._id,
              cattle: { age: t.age, weight: t.weight, type: t.type }
            })).unwrap()
            createdCattle.push(res)
          } catch (err) {
            console.error('Failed to create cattle after farmer creation:', err)
          }
        }
        // set local cattleList to the created ones (backend ids)
        setCattleList(prev => {
          const nonTemps = prev.filter(c => !String(c.id).startsWith('temp-'))
          return [...nonTemps, ...createdCattle]
        })

        console.log('Farmer created successfully', createdFarmer)
      }

      onClose()
      onSave?.()
    } catch (err) {
      console.error('Failed to save farmer:', err)
      alert('Failed to save farmer. Check console for details.')
    }
  }

  const handleDeleteFarmer = () => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      onDelete?.(farmerDetails)
      onClose()
    }
  }

  const totalCattleCount = cattleList.length
  const title = titleOverride || (mode === 'edit' ? 'Edit Farmer' : 'New Farmer')
  const saveButtonText = mode === 'edit' ? 'Save Changes' : 'Save'

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
                        <td className="px-4 py-2">{cattle.id}</td>
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
          <button onClick={handleMainSave} className="bg-[#b91c1c] text-white px-5 py-2 rounded-md hover:bg-[#991b1b]">{saveButtonText}</button>
        </div>
      </div>
    </div>
  )
}

export default FarmerForm
