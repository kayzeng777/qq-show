-- 创建shares表来存储分享数据
CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  outfit JSONB NOT NULL,
  language TEXT NOT NULL DEFAULT 'zh',
  name TEXT DEFAULT 'My Outfit',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_shares_created_at ON shares(created_at);

-- 启用行级安全策略（可选，根据需要调整）
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- 创建策略允许所有人读取和插入数据
CREATE POLICY "Allow public read access" ON shares FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON shares FOR INSERT WITH CHECK (true);

-- 可选：创建清理策略，删除30天前的数据
-- CREATE POLICY "Auto cleanup old shares" ON shares FOR DELETE USING (created_at < NOW() - INTERVAL '30 days');
