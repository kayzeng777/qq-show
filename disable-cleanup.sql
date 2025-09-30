-- 禁用自动清理功能：不删除任何记录
-- 这个文件用于更新cleanup_unused_shares函数，使其不删除任何记录

-- 更新清理函数，使其不删除任何记录
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

-- 测试清理函数（应该返回0，不删除任何记录）
-- SELECT cleanup_unused_shares();

-- 查看当前所有记录数量
-- SELECT COUNT(*) as total_records FROM shares;

-- 查看访问统计
-- SELECT 
--   COUNT(*) as total_records,
--   AVG(access_count) as avg_access_count,
--   MAX(access_count) as max_access_count,
--   MIN(access_count) as min_access_count
-- FROM shares;
