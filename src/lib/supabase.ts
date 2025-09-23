import { createClient } from '@supabase/supabase-js'

// 使用公共的Supabase配置（不需要环境变量）
const supabaseUrl = 'https://iuthwndljsjdwhzlxopz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1dGh3bmRsanNqZHdoemx4b3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MTM2MTUsImV4cCI6MjA3NDE4OTYxNX0.q-0qS8L5lpSB-ttj1HK2wfYTu0wM44KuEJ7FhKbz2oQ'

// 检查是否有有效的配置
const hasValidConfig = supabaseUrl && supabaseAnonKey && 
  supabaseUrl.includes('supabase.co') && 
  supabaseAnonKey.length > 50

export const supabase = hasValidConfig ? createClient(supabaseUrl, supabaseAnonKey) : null

// 分享数据接口
export interface ShareData {
  id: string
  outfit: any
  language: string
  name?: string
  created_at: string
}

// 保存分享数据
export async function saveShareData(id: string, outfit: any, language: string, name?: string): Promise<boolean> {
  try {
    if (supabase) {
      // 使用Supabase存储
      const { error } = await supabase
        .from('shares')
        .insert({
          id,
          outfit,
          language,
          name: name || 'My Outfit',
          created_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('Supabase保存失败，回退到localStorage:', error)
        // 回退到localStorage
        localStorage.setItem(`outfit_${id}`, JSON.stringify(outfit))
        localStorage.setItem(`language_${id}`, language)
        return true
      }
      
      return true
    } else {
      // 使用localStorage存储
      localStorage.setItem(`outfit_${id}`, JSON.stringify(outfit))
      localStorage.setItem(`language_${id}`, language)
      return true
    }
  } catch (error) {
    console.error('保存分享数据失败:', error)
    // 最后的回退
    try {
      localStorage.setItem(`outfit_${id}`, JSON.stringify(outfit))
      localStorage.setItem(`language_${id}`, language)
      return true
    } catch (localError) {
      console.error('localStorage也失败了:', localError)
      return false
    }
  }
}

// 获取分享数据
export async function getShareData(id: string): Promise<ShareData | null> {
  try {
    if (supabase) {
      // 使用Supabase获取
      const { data, error } = await supabase
        .from('shares')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Supabase获取失败，回退到localStorage:', error)
        // 回退到localStorage
        const outfitData = localStorage.getItem(`outfit_${id}`)
        const languageData = localStorage.getItem(`language_${id}`)
        
        if (outfitData) {
          return {
            id,
            outfit: JSON.parse(outfitData),
            language: languageData || 'zh',
            created_at: new Date().toISOString()
          }
        }
        
        return null
      }
      
      // 更新访问记录
      if (data) {
        await updateShareAccess(id)
      }
      
      return data
    } else {
      // 使用localStorage获取
      const outfitData = localStorage.getItem(`outfit_${id}`)
      const languageData = localStorage.getItem(`language_${id}`)
      
      if (outfitData) {
        return {
          id,
          outfit: JSON.parse(outfitData),
          language: languageData || 'zh',
          created_at: new Date().toISOString()
        }
      }
      
      return null
    }
  } catch (error) {
    console.error('获取分享数据失败:', error)
    return null
  }
}

// 更新分享访问记录
export async function updateShareAccess(id: string): Promise<void> {
  try {
    if (supabase) {
      await supabase.rpc('update_share_access', { share_id: id })
    }
  } catch (error) {
    console.error('更新访问记录失败:', error)
  }
}
