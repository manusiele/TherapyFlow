'use client'

import { useState, useEffect } from 'react'
import { patients } from '@/lib/supabase'

interface Patient {
  id: string
  name: string
  email: string
  phone: string | null
  date_of_birth: string | null
  emergency_contact: string | null
  created_at: string
}

interface PatientManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PatientManagementModal({ isOpen, onClose }: PatientManagementModalProps) {
  const [patientList, setPatientList] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    emergencyContact: ''
  })

  useEffect(() => {
    if (isOpen) {
      fetchPatients()
    }
  }, [isOpen])

  const fetchPatients = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await patients.getAll()
      if (error) {
        console.error('Error fetching patients:', error)
        return
      }
      setPatientList(data || [])
    } catch (err) {
      console.error('Error loading patients:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone || '',
      dateOfBirth: patient.date_of_birth || '',
      emergencyContact: patient.emergency_contact || ''
    })
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setSelectedPatient(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      emergencyContact: ''
    })
  }

  const handleSave = async () => {
    try {
      if (selectedPatient && isEditing) {
        await patients.update(selectedPatient.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          emergency_contact: formData.emergencyContact
        })
      } else if (isAdding) {
        await patients.create({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          emergency_contact: formData.emergencyContact
        })
      }
      
      await fetchPatients()
      setIsEditing(false)
      setIsAdding(false)
      setSelectedPatient(null)
    } catch (err) {
      console.error('Error saving patient:', err)
    }
  }

  const handleDelete = async () => {
    if (!selectedPatient) return
    
    if (confirm(`Are you sure you want to delete ${selectedPatient.name}?`)) {
      try {
        await patients.delete(selectedPatient.id)
        await fetchPatients()
        setSelectedPatient(null)
      } catch (err) {
        console.error('Error deleting patient:', err)
      }
    }
  }

  const filteredPatients = patientList.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Patient Management</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Patient List */}
          <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
              <button
                onClick={handleAdd}
                className="mt-3 w-full btn-primary py-2 text-sm"
              >
                + Add New Patient
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-slate-500">Loading...</div>
              ) : filteredPatients.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No patients found</div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className={`p-4 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                      selectedPatient?.id === patient.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="font-medium text-slate-900 dark:text-slate-100">{patient.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{patient.email}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Patient Details */}
          <div className="flex-1 p-6 overflow-y-auto">
            {!selectedPatient && !isAdding ? (
              <div className="h-full flex items-center justify-center text-slate-500">
                Select a patient to view details or add a new patient
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {isAdding ? 'New Patient' : isEditing ? 'Edit Patient' : 'Patient Details'}
                  </h3>
                  {!isEditing && !isAdding && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing && !isAdding}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing && !isAdding}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing && !isAdding}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    disabled={!isEditing && !isAdding}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    disabled={!isEditing && !isAdding}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:opacity-50"
                  />
                </div>

                {(isEditing || isAdding) && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 btn-primary py-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setIsAdding(false)
                        if (selectedPatient) {
                          handleSelectPatient(selectedPatient)
                        }
                      }}
                      className="flex-1 btn-secondary py-2"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
