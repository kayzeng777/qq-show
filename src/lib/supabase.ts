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
    console.log('正在保存分享数据:', { id, outfit, language, name })
    
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
      
      console.log('Supabase保存结果:', { error })
      
      if (error) {
        console.error('Supabase保存失败，回退到localStorage:', error)
        // 回退到localStorage
        localStorage.setItem(`outfit_${id}`, JSON.stringify(outfit))
        localStorage.setItem(`language_${id}`, language)
        return true
      }
      
      console.log('Supabase保存成功')
      return true
    } else {
      console.log('Supabase未配置，使用localStorage')
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
    console.log('正在获取分享数据，ID:', id)
    
    if (supabase) {
      console.log('开始Supabase查询...')
      
      // 使用更简单的查询
      const { data, error } = await supabase
        .from('shares')
        .select('id, outfit, language, name, created_at')
        .eq('id', id)
      
      console.log('Supabase查询结果:', { data, error })
      console.log('查询到的数据数量:', data?.length)
      
      if (error) {
        console.error('Supabase获取失败，回退到localStorage:', error)
        // 回退到localStorage
        const outfitData = localStorage.getItem(`outfit_${id}`)
        const languageData = localStorage.getItem(`language_${id}`)
        
        console.log('localStorage数据:', { outfitData, languageData })
        
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
      
      // 检查是否有数据
      if (data && data.length > 0) {
        const shareData = data[0]
        console.log('找到分享数据:', shareData)
        
        // 更新访问记录
        await updateShareAccess(id)
        
        return shareData
      } else {
        console.log('未找到分享数据，回退到localStorage')
        // 回退到localStorage
        const outfitData = localStorage.getItem(`outfit_${id}`)
        const languageData = localStorage.getItem(`language_${id}`)
        
        if (outfitData) {
          // 即使回退到localStorage，也尝试更新访问记录
          await updateShareAccess(id)
          
          return {
            id,
            outfit: JSON.parse(outfitData),
            language: languageData || 'zh',
            created_at: new Date().toISOString()
          }
        }
        
        return null
      }
    } else {
      console.log('Supabase未配置，使用localStorage')
      // 使用localStorage获取
      const outfitData = localStorage.getItem(`outfit_${id}`)
      const languageData = localStorage.getItem(`language_${id}`)
      
      if (outfitData) {
        // 即使Supabase未配置，也尝试更新访问记录（可能会失败，但至少尝试了）
        await updateShareAccess(id)
        
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
    if (!supabase) {
      console.error('Supabase客户端未初始化')
      return
    }
    
    // 获取当前访问次数
    const { data: currentData, error: fetchError } = await supabase
      .from('shares')
      .select('access_count, last_accessed_at')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('获取当前访问次数失败:', fetchError)
      return
    }
    
    const currentCount = currentData?.access_count || 0
    
    // 更新访问记录
    const { error } = await supabase
      .from('shares')
      .update({ 
        last_accessed_at: new Date().toISOString(),
        access_count: currentCount + 1
      })
      .eq('id', id)
    
    if (error) {
      console.error('更新访问记录失败:', error)
    } else {
      console.log(`访问记录更新成功，ID: ${id}, 新访问次数: ${currentCount + 1}`)
    }
  } catch (error) {
    console.error('更新访问记录异常:', error)
  }
}
