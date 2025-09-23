# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 等待项目初始化完成

## 2. 设置数据库表

在 Supabase SQL 编辑器中运行 `supabase-setup.sql` 文件中的 SQL 代码：

```sql
-- 创建shares表来存储分享数据
CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  outfit JSONB NOT NULL,
  language TEXT NOT NULL DEFAULT 'zh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_shares_created_at ON shares(created_at);

-- 启用行级安全策略
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- 创建策略允许所有人读取和插入数据
CREATE POLICY "Allow public read access" ON shares FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON shares FOR INSERT WITH CHECK (true);
```

## 3. 获取 API 密钥

1. 在 Supabase 项目设置中找到 "API" 部分
2. 复制以下信息：
   - Project URL
   - anon/public key

## 4. 设置环境变量

创建 `.env.local` 文件（如果不存在）：

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 5. 成本说明

Supabase 免费计划包括：
- 500MB 数据库存储
- 2GB 带宽
- 50,000 行数据

对于分享功能，这应该足够使用。每个分享记录大约占用几KB空间。

## 6. 数据清理

可以考虑设置自动清理策略来删除旧的分享数据：

```sql
-- 删除30天前的数据
DELETE FROM shares WHERE created_at < NOW() - INTERVAL '30 days';
```

或者设置定时任务来定期清理。
