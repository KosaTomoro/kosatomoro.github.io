---
title: 短链接分库分表技术方案
description: 基于 ShardingSphere 的短链接分库分表实现方案
date: "2025-03-16"
category: 技术
tags:
  - 分库分表
  - ShardingSphere
  - 短链接系统
draft: false
---

## 配置实现方案

### 应用配置

```yaml
# application.yaml
server:
  port: 8001

spring:
  datasource:
    driver-class-name: org.apache.shardingsphere.driver.ShardingSphereDriver
    url: jdbc:shardingsphere:classpath:shardingsphere-config.yaml
  data:
    redis:
      host: 118.31.71.XXX
      port: 6379
      password: XXXXXXX
```

### 分片配置

```yaml
# shardingsphere-config.yaml
dataSources:
  ds_0:
    dataSourceClassName: com.zaxxer.hikari.HikariDataSource
    driverClassName: com.mysql.cj.jdbc.Driver
    jdbcUrl: jdbc:mysql://118.31.71.xxx:3306/link?useUnicode=true&characterEncoding=UTF-8&rewriteBatchedStatements=true&allowMultiQueries=true&serverTimezone=Asia/Shanghai
    username: xxxx
    password: xxxx

rules:
  - !SHARDING
    tables:
      t_link:
        actualDataNodes: ds_0.t_link_${0..15}
        tableStrategy:
          standard:
            shardingColumn: gid
            shardingAlgorithmName: link_table_hash_mod
    shardingAlgorithms:
      link_table_hash_mod:
        type: HASH_MOD
        props:
          sharding-count: 16
props:
  sql-show: true
```
