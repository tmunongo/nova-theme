---
title: "Sub-Millisecond Query Optimization in Modern Databases"
description: "Dissecting B-Tree page layouts, covering indexes, and query planner nuances to squeeze maximum throughput from relational databases."
date: 2025-10-18
tags: ["databases", "sql", "performance", "postgresql"]
series: ["Database Internals"]
draft: false
readTime: true
recommended: true
fediverse: "author@example.social"
---

Most database performance bottlenecks do not stem from engine limitations, but from query planner misalignments and unindexed sorting operations.

## Covering Indexes

When a database query can be satisfied entirely from index pages without accessing the heap table, response times plummet:

```sql
-- Creating a covering index with INCLUDE clause
CREATE INDEX idx_orders_customer_status
ON orders (customer_id, created_at DESC)
INCLUDE (total_amount, currency);

-- Index-only scan query
EXPLAIN ANALYZE
SELECT customer_id, created_at, total_amount, currency
FROM orders
WHERE customer_id = 42819
ORDER BY created_at DESC
LIMIT 10;
```

Notice how `total_amount` and `currency` are stored in leaf nodes, avoiding additional random disk I/O.

## Benchmarks

Under a load test of 10,000 concurrent requests:

* **Unindexed Heap Scan:** 142ms average response time
* **Standard B-Tree Index:** 12ms average response time
* **Covering Index:** 0.8ms average response time

Designing indexes with intention produces order-of-magnitude improvements.
