'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

// Types
interface Document {
  id: string
  filename: string
  created_at: string
  processing_status: 'pending' | 'processing' | 'completed' | 'failed'
  extractionCounts: {
    general: number
    companyProfile: number
    styleProfile: number
    personaProfile: number
    dataVisualization: number
    report_8020: number
    designDetails: number
    visual_doodle: number
  }
}

interface Stats {
  totalDocuments: number
  totalExtractions: number
  processingStatus: {
    pending: number
    completed: number
    failed: number
  }
  extractionTypes: {
    general: number
    companyProfile: number
    styleProfile: number
    personaProfile: number
    dataVisualization: number
    report_8020: number
    designDetails: number
    visual_doodle: number
  }
}

interface AppState {
  documents: Document[]
  stats: Stats | null
  loading: boolean
  error: string | null
  selectedDocument: Document | null
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'SET_STATS'; payload: Stats }
  | { type: 'SET_SELECTED_DOCUMENT'; payload: Document | null }
  | { type: 'UPDATE_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: string }

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  refreshData: () => Promise<void>
  deleteExtraction: (type: string, id: string) => Promise<boolean>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Initial state
const initialState: AppState = {
  documents: [],
  stats: null,
  loading: false,
  error: null,
  selectedDocument: null,
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload, loading: false }
    case 'SET_STATS':
      return { ...state, stats: action.payload, loading: false }
    case 'SET_SELECTED_DOCUMENT':
      return { ...state, selectedDocument: action.payload }
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? action.payload : doc
        ),
        selectedDocument: state.selectedDocument?.id === action.payload.id ? action.payload : state.selectedDocument
      }
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
        selectedDocument: state.selectedDocument?.id === action.payload ? null : state.selectedDocument
      }
    default:
      return state
  }
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const refreshData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      // Fetch documents and stats in parallel
      const [documentsResponse, statsResponse] = await Promise.all([
        fetch('/api/documents'),
        fetch('/api/stats')
      ])

      if (!documentsResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const documents = await documentsResponse.json()
      const stats = await statsResponse.json()

      dispatch({ type: 'SET_DOCUMENTS', payload: documents })
      dispatch({ type: 'SET_STATS', payload: stats })
    } catch (error) {
      console.error('Error refreshing data:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' })
      toast.error('Failed to load data')
    }
  }

  const deleteExtraction = async (type: string, id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/extractions/${type}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete extraction')
      }

      toast.success('Extraction deleted successfully')
      await refreshData() // Refresh data after deletion
      return true
    } catch (error) {
      console.error('Error deleting extraction:', error)
      toast.error('Failed to delete extraction')
      return false
    }
  }

  // Initial data load
  useEffect(() => {
    refreshData()
  }, [])

  const value: AppContextType = {
    state,
    dispatch,
    refreshData,
    deleteExtraction,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}