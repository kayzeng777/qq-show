# QQ秀2000 部署指南

## 项目概述
这是一个基于React + TypeScript + Vite的QQ秀虚拟形象搭配工具，已经构建完成并准备部署。

## 部署选项

### 1. Vercel 部署（推荐）
**优点：** 快速、简单、免费、自动HTTPS、全球CDN

**步骤：**
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 导入这个项目仓库
4. 部署设置：
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. 点击Deploy

**自定义域名：**
1. 在Vercel Dashboard中进入项目设置
2. 在Domains页面添加你的域名
3. 按照提示配置DNS记录

### 2. Netlify 部署
**优点：** 简单、免费、支持表单处理

**步骤：**
1. 访问 [netlify.com](https://netlify.com)
2. 连接GitHub仓库
3. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 点击Deploy site

**自定义域名：**
1. 在Netlify Dashboard中进入Site settings
2. 在Domain management中添加自定义域名
3. 配置DNS记录

### 3. GitHub Pages 部署
**优点：** 免费、与GitHub集成

**步骤：**
1. 确保代码已推送到GitHub
2. 在仓库设置中启用GitHub Pages
3. 选择Source为GitHub Actions
4. 推送代码后会自动部署

### 4. 传统VPS部署
**适合：** 有服务器的情况

**步骤：**
1. 将dist文件夹上传到服务器
2. 配置Nginx或Apache
3. 设置SSL证书

## DNS配置指南

### 对于Vercel/Netlify：
```
类型: CNAME
名称: www (或 @)
值: cname.vercel-dns.com (Vercel) 或 your-site.netlify.app (Netlify)
TTL: 3600
```

### 对于根域名：
```
类型: A
名称: @
值: 76.76.19.19 (Vercel) 或 75.2.60.5 (Netlify)
TTL: 3600
```

## 性能优化建议

1. **启用Gzip压缩**
2. **设置缓存策略**
3. **使用CDN**
4. **优化图片资源**

## 监控和维护

1. **设置监控**：使用Google Analytics或类似工具
2. **定期更新**：保持依赖项最新
3. **备份**：定期备份代码和资源

## 故障排除

### 常见问题：
1. **构建失败**：检查Node.js版本和依赖
2. **资源404**：检查public文件夹路径
3. **路由问题**：确保配置了正确的重定向规则

### 联系支持：
- Vercel: support@vercel.com
- Netlify: support@netlify.com
- GitHub: support@github.com
