// 暂时禁用Supabase，使用localStorage
export const supabase = null

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
    // 使用localStorage存储
    localStorage.setItem(`outfit_${id}`, JSON.stringify(outfit))
    localStorage.setItem(`language_${id}`, language)
    return true
  } catch (error) {
    console.error('保存分享数据失败:', error)
    return false
  }
}

// 获取分享数据
export async function getShareData(id: string): Promise<ShareData | null> {
  try {
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
  } catch (error) {
    console.error('获取分享数据失败:', error)
    return null
  }
}
