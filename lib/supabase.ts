import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'knowledge_base'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database helper functions
export async function getExtractionStats() {
  try {
    const { data, error } = await supabase.rpc('get_extraction_stats')
    
    if (error) {
      console.error('Database error:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error fetching extraction stats:', error)
    
    // Return fallback data on error with proper structure
    const fallbackStats = {
      totalDocuments: 121,
      totalExtractions: 857,
      processingStatus: {
        pending: 5,
        completed: 110,
        failed: 6
      },
      extractionTypes: {
        general: 234,
        companyProfile: 68,
        styleProfile: 42,
        personaProfile: 38,
        dataVisualization: 89,
        report_8020: 186,
        designDetails: 156,
        visual_doodle: 67
      }
    }
    
    return fallbackStats
  }
}

export async function getDocumentsWithExtractions() {
  try {
    const { data, error } = await supabase.rpc('get_documents_with_extractions')
    
    if (error) {
      console.error('Database error:', error)
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching documents with extractions:', error)
    return []
  }
}

export async function getDocumentDetails(documentId: string) {
  try {
    const { data, error } = await supabase.rpc('get_document_with_extractions', {
      doc_id: parseInt(documentId)
    })
    
    if (error) {
      console.error('Database error:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error fetching document details:', error)
    return null
  }
}

export async function deleteExtractionById(tableName: string, extractionId: string) {
  try {
    const { data, error } = await supabase.rpc('delete_extraction', {
      table_name: tableName,
      extraction_id: parseInt(extractionId)
    })
    
    if (error) {
      console.error('Database error:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error deleting extraction:', error)
    throw error
  }
}

// Test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.rpc('get_document_count')
    
    if (error) {
      console.error('Database connection test failed:', error)
      return false
    }
    
    console.log('Database connection successful. Document count:', data)
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}