import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 分享数据接口
export interface ShareData {
  id: string
  outfit: any
  language: string
  created_at: string
}

// 保存分享数据
export async function saveShareData(id: string, outfit: any, language: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shares')
      .insert({
        id,
        outfit,
        language,
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('保存分享数据失败:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('保存分享数据失败:', error)
    return false
  }
}

// 获取分享数据
export async function getShareData(id: string): Promise<ShareData | null> {
  try {
    const { data, error } = await supabase
      .from('shares')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('获取分享数据失败:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('获取分享数据失败:', error)
    return null
  }
}
