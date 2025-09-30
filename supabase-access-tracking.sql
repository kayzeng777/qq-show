-- 添加访问跟踪字段到shares表
ALTER TABLE shares ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE shares ADD COLUMN IF NOT EXISTS access_count INTEGER DEFAULT 0;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_shares_last_accessed ON shares(last_accessed_at);
CREATE INDEX IF NOT EXISTS idx_shares_access_count ON shares(access_count);

-- 创建函数来更新访问记录
CREATE OR REPLACE FUNCTION update_share_access(share_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE shares 
  SET 
    last_accessed_at = NOW(),
    access_count = access_count + 1
  WHERE id = share_id;
END;
$$ LANGUAGE plpgsql;

-- 创建清理策略：不删除任何记录（已禁用自动清理）
CREATE OR REPLACE FUNCTION cleanup_unused_shares()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- 不删除任何记录，返回0
  deleted_count := 0;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 创建定期清理的定时任务（需要启用pg_cron扩展）
-- 注意：这需要在Supabase中手动启用pg_cron扩展
-- SELECT cron.schedule('cleanup-unused-shares', '0 2 * * *', 'SELECT cleanup_unused_shares();');
