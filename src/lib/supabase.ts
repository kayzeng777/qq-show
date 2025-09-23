import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 检查环境变量是否存在
const hasSupabaseConfig = supabaseUrl && supabaseAnonKey

export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

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
    if (supabase) {
      // 使用Supabase存储
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
    } else {
      // 回退到localStorage
      console.warn('Supabase未配置，使用localStorage作为回退')
      localStorage.setItem(`outfit_${id}`, JSON.stringify(outfit))
      localStorage.setItem(`language_${id}`, language)
      return true
    }
  } catch (error) {
    console.error('保存分享数据失败:', error)
    return false
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
        console.error('获取分享数据失败:', error)
        return null
      }
      
      return data
    } else {
      // 回退到localStorage
      console.warn('Supabase未配置，使用localStorage作为回退')
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
