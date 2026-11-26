# 设定 Momo 云端同步（Supabase）

大约 10 分钟。全部免费额度就够用。

1. **开项目**：到 https://supabase.com 登入 → New project。地区选 **Southeast Asia (Singapore)**，资料比较近。记下数据库密码（app 不会用到）。
2. **建资料表和权限**：左边 **SQL Editor** → New query → 把 `supabase/schema.sql` 全部贴上 → Run。会建立两个表，并开启「每个家长只能看自己的资料」的权限（Row Level Security）。
3. **电邮登入**：**Authentication → Sign In / Providers → Email** 保持开启。
   **Authentication → Emails → Magic Link** 模板里加一行，让邮件里有 6 位登入码（iPad 主画面上的 Momo 需要用码登入）：
   `你的 Momo 登入码：{{ .Token }}`
4. **网址**：**Authentication → URL Configuration**
   - Site URL：`https://sclim999.github.io/kidlearning-/`
   - Redirect URLs 加上同一个网址
5. **把项目接上 Momo**：**Project Settings → API**，复制 **Project URL** 和 **anon public** 金钥，填进 `js/core/sync-config.js`：
   ```js
   const SYNC_CFG={url:'https://xxxx.supabase.co',key:'eyJ...'};
   ```
   （也可以把这两个值给 Claude，让它帮你填好、提交。）**不要**用 service_role 金钥。

## 家长怎么用
设置（要家长密码）→ ☁️ 云端同步 → 输入家长电邮 → 输入邮件里的登入码。每台设备都用同一个电邮登入，就会自动同步。

## 隐私
- 云端只有：家长电邮（登入用）、孩子的昵称和头像、学习记录。没有录音、照片、生日、学校等资料。
- 资料经 HTTPS 传送；每个家长只能读写自己的那一行（Row Level Security）。
- 「删除云端资料」会删掉云端的学习记录、全部云端备份和这个登入账号；这台设备上的资料保留。
- 注意：Momo 放在 sclim999.github.io，同一个网址下的其他项目也能读到浏览器里的登入凭证。只在那里放自己写的、信任的项目。
