# CLAUDE.md

## 项目概述

这是**血池（Fund Pool）服务**的 monorepo，基于 NestJS + DDD 架构。
血池负责维护游戏奖池金额的增减，并为下游游戏服务提供当前奖池档位信息，用于决定 RTP 随机概率。

本仓库仅包含 Node.js 服务，整体系统的其他组件由独立团队维护：
- **fund-pool-flink**（Java）：接收玩家下注流水，做时间窗口聚合
- **fund-pool-admin**（其他团队）：运营后台，管理奖池配置和人工调账
- **game-1 / game-2 / ...**（下游团队）：游戏服务，调用本仓库的 fund-pool-api 获取奖池档位

## 系统交互全景

```
player → fund-pool-flink → MongoDB / ClickHouse ← fund-pool-aggregator (consumer/schedule)
operations → fund-pool-admin → MongoDB
game-1/2   → fund-pool-api  → MongoDB (read-only)
```

## 仓库结构

```
apps/
├── fund-pool-api/          # HTTP 接口服务，供游戏方调用（端口 3001）
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── config/
│       ├── common/         # 全局异常过滤器、响应拦截器、业务异常类
│       └── modules/
│           └── fund-pool/  # 完整 DDD 四层结构
└── fund-pool-aggregator/   # Pulsar Consumer + 定时任务（待实现）
    └── src/
```

每个模块的内部结构：

```
<module>/
├── <module>.module.ts
├── interface/          # Controller + DTO
├── application/        # 用例编排，不写业务规则
│   └── queries/        # 查询对象（CQRS 风格）
├── domain/             # 实体、Repository 接口、领域服务
└── infrastructure/     # Mongoose Schema、Repository 实现
```

## 技术栈

| 关注点       | 选型                        |
|-------------|---------------------------|
| 框架         | NestJS ^10                |
| 语言         | TypeScript ^5.1.3         |
| 运行时       | Node.js v18.17.1          |
| 数据库       | MongoDB（via Mongoose）   |
| 消息队列     | Apache Pulsar（aggregator 用）|
| 测试         | Jest                      |

## 核心数据集合（MongoDB db: dosFundPoolDB）

| 集合                      | 说明                              | 本仓库读写权限       |
|--------------------------|----------------------------------|-------------------|
| `fundPoolConfig`         | 奖池静态配置（含 levelConfig 档位）| fund-pool-api 只读 |
| `fundPoolRuntime`        | 奖池实时状态（余额、流水累计）     | fund-pool-api 只读 |
| `fundPoolChangeLog`      | 每次金额变动记录                  | aggregator 写      |
| `fundPoolBalanceTimeseries` | ClickHouse 时序快照            | 不在本仓库          |
| `fundPoolTag`            | 允许进入的标签规则                | aggregator 读      |

### fundPoolConfig 关键字段

- `poolId`：业务唯一 ID（唯一索引）
- `gameIds: string[]`：关联的游戏 ID 列表（复合索引 `gameIds + status`）
- `status`：0=disabled，1=enabled（软删除）
- `levelConfig: { levelNo, minBalance, maxBalance }[]`：档位区间配置
- `betAmountMin / betAmountMax`：适用下注金额范围
- `singlePayoutLimit`：单笔派彩上限

### fundPoolRuntime 关键字段

- `poolId`：唯一索引，关联 fundPoolConfig
- `currentBalance`：当前实时余额
- `lastChangeAt`：最后变更时间

## 架构规则

### 依赖方向
```
interface → application → domain ← infrastructure
```
- `domain/` 不得引入 NestJS / Mongoose，只有纯业务逻辑
- `infrastructure/` 实现 domain 定义的接口，domain 不反向依赖 infrastructure
- `application/` 负责编排：调领域服务 → 通过 Repository 查询数据 → 组装响应

### 命名规范
- **文件名**：kebab-case + 层级后缀，如 `fund-pool-config.entity.ts`、`fund-pool-config.repository.impl.ts`
- **类名**：PascalCase + 层级后缀，如 `FundPoolConfigEntity`、`FundPoolAppService`
- **接口**：必须加 `I` 前缀，如 `IFundPoolConfigRepository`
- **DI token**：使用与接口名一致的字符串字面量，如 `'IFundPoolConfigRepository'`

### 响应格式（fund-pool-api 统一）

所有响应均包装为：
```json
{ "code": 0, "message": "success", "data": { ... } }
```
业务错误码：
- `1001`：参数错误（gameId 为空或非法）
- `1002`：游戏不存在
- `1003`：未查询到资金池
- `1004`：服务内部错误

由 `ResponseInterceptor`（成功）和 `GlobalExceptionFilter`（异常）统一处理，Controller 不做包装。

### 错误处理
- 业务违规在 application 层抛出 `BusinessException(code, message)`
- 输入校验由 `ValidationPipe` + `GlobalExceptionFilter` 处理，自动映射到 1001
- application 层和 domain 层不捕获 `BusinessException`，让其自然冒泡

### currentLevelNo 计算规则
`currentLevelNo` 不存储，在查询时实时计算：
- 遍历 `fundPoolConfig.levelConfig`，找到 `currentBalance` 落在 `[minBalance, maxBalance]` 内的档位
- `minBalance` 为 null 视为 0，`maxBalance` 为 null 视为正无穷
- 无匹配时回退到最低档位

## 代码风格

- 代码注释使用**英文**
- 无需生成 Swagger / API 文档
- `ValidationPipe` 全局配置 `whitelist: true, transform: true`
- 不对不可能发生的情况做防御性错误处理，只在系统边界（用户输入）做校验

## 测试

- 使用 Jest，测试文件与源码同目录，命名为 `*.spec.ts`
- 建议覆盖 `domain/` 层的 `currentLevelNo` 计算逻辑

## 常用命令

```bash
# 开发启动
npm run start:fund-pool-api:dev

# 构建
npm run build:fund-pool-api

# 生产运行
npm run start:fund-pool-api:prod

# 编译检查
npx tsc --noEmit -p apps/fund-pool-api/tsconfig.app.json
```

## 环境变量

| 变量名                | 说明               | 默认值                                    |
|--------------------|------------------|------------------------------------------|
| `FUND_POOL_API_PORT` | fund-pool-api 端口 | `3001`                                  |
| `MONGODB_URI`       | MongoDB 连接串     | `mongodb://localhost:27017/dosFundPoolDB` |
