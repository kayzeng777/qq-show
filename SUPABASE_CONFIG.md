# Supabase 配置说明

## 问题
当前分享功能使用localStorage，发给别人后无法显示分享页面，因为别人没有本地存储数据。

## 解决方案
需要配置Supabase来存储分享数据，实现跨设备的永久分享链接。

## 配置步骤

### 1. 创建Supabase项目
1. 访问 https://supabase.com
2. 创建新项目
3. 等待项目初始化完成

### 2. 设置数据库表
在Supabase SQL编辑器中运行：

```sql
CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  outfit JSONB NOT NULL,
  language TEXT NOT NULL DEFAULT 'zh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shares_created_at ON shares(created_at);

ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON shares FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON shares FOR INSERT WITH CHECK (true);
```

### 3. 获取API密钥
1. 在项目设置中找到 "API" 部分
2. 复制 Project URL 和 anon/public key

### 4. 更新配置
编辑 `src/lib/supabase.ts` 文件，将第4-5行的占位符替换为实际的URL和密钥：

```typescript
const supabaseUrl = 'https://your-actual-project.supabase.co'
const supabaseAnonKey = 'your-actual-anon-key'
```

### 5. 重新构建和部署
```bash
npm run build
git add .
git commit -m "配置Supabase"
git push origin main
```

## 配置后的效果
- ✅ 分享链接可以发给任何人
- ✅ 跨设备访问分享页面
- ✅ 永久存储分享数据
- ✅ 自动回退到localStorage（如果Supabase失败）

## 成本
Supabase免费计划足够使用：
- 500MB 数据库存储
- 2GB 带宽
- 50,000 行数据
