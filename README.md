# Vibe 生产排程系统

本地化生产管理系统，融合数据本地确权、物料约束甘特图、半成品二级加工、剩余配套（ATP）四大核心功能。

## 功能特性

- **数据本地确权**：IndexedDB + JSON 导出，数据完全掌控
- **10款产品BOM**：草莓奶昔、拿铁、杨枝甘露等完整配方
- **ATP计算**：实时剩余配套分析，自动识别瓶颈物料
- **智能排程**：7天甘特图，物料校验，冲突预警
- **车间执行**：一键完工，自动库存扣减
- **半成品管理**：支持二级加工，损耗率、保质期自动计算

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:3000

1. 点击"初始化测试数据"加载10款产品
2. 进入"BI决策"查看剩余配套分析
3. 在"智能排程"添加生产任务
4. 使用"车间执行"完成生产并扣减库存

## 项目结构

```
├── app/
│   ├── page.tsx           # 中控台（数据导入导出）
│   ├── bi/page.tsx        # BI决策（ATP分析）
│   ├── schedule/page.tsx  # 智能排程（甘特图）
│   ├── workshop/page.tsx  # 车间执行
│   └── supply/page.tsx    # 供应链输入
├── lib/
│   ├── db.ts              # Dexie 数据库定义
│   ├── atp.ts             # ATP 计算逻辑
│   ├── production.ts      # 生产完工逻辑
│   └── seed-data.ts       # 测试数据
└── components/
    └── Sidebar.tsx        # 侧边栏导航
```

## 核心逻辑

### ATP（剩余配套）计算
根据当前库存和BOM配方，计算每款产品可生产数量，并识别瓶颈物料。

### 库存扣减闭环
车间完工时自动扣减原料/半成品库存，半成品加工自动产出并设置保质期。

### 测试场景
- 牛奶仅剩2L（瓶颈物料）
- 草莓明天到货50kg
- 多产品竞争同一原料

## 技术栈

- Next.js 15 + TypeScript
- Dexie.js (IndexedDB)
- Tailwind CSS
- date-fns

## 推送到 GitHub

```bash
# 在 GitHub 网站创建新仓库后
git remote add origin https://github.com/你的用户名/vibe-production-system.git
git push -u origin main
```
