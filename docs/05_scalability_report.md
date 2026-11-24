# Phase 5 – Scalability Report

## 1. Status and scope

This report follows the Netflix streaming database project’s Phase 5 requirements: compare optimized query performance on the seed and large datasets, examine growth, report storage, and propose partitioning, sharding, replica, cache, and maintenance strategies.

**Evidence status at this review:** the workspace contains `seed_data.zip`, but not `large_data.zip`. Both `benchmarks/results/optimized/summary.csv` and `benchmarks/results/large/summary.csv` are empty, and the `benchmarks/results/large/` directory has no raw plan files. Therefore the large-dataset counts, timings, storage figures, and plan details preserved below are historical values already recorded in this report; they cannot currently be reproduced or independently verified from the files in the workspace. Treat them as reported results until the source archive and benchmark artifacts are restored.

The project requires the optimized workload, 3 runs per query, and write statements wrapped in `BEGIN` / `ROLLBACK`. The original workload file should remain unchanged. Benchmark-only fixture adjustments, if needed because the large data does not contain a fixed identifier, must be saved and documented separately.

## 2. Dataset and environment

### 2.1 Row counts previously recorded

The previous version of this report recorded the following counts as read from the 11 large CSV files. The large archive is not available in this workspace to recheck them.

| Table | Seed rows | Previously recorded large rows | Growth |
|---|---:|---:|---:|
| `plans` | 4 | 4 | 1.000× |
| `accounts` | 25,000 | 500,000 | 20.000× |
| `profiles` | 75,000 | 1,500,000 | 20.000× |
| `genres` | 15 | 15 | 1.000× |
| `titles` | 3,000 | 60,000 | 20.000× |
| `title_genres` | 5,963 | 119,166 | 19.984× |
| `episodes` | 20,000 | 400,000 | 20.000× |
| `viewing_activity` | 200,401 | 4,012,819 | 20.024× |
| `ratings` | 33,900 | 674,605 | 19.900× |
| `my_list` | 59,992 | 1,199,989 | 20.002× |
| `invoices` | 133,057 | 2,657,600 | 19.973× |
| **Total** | **556,332** | **12,124,194** | **21.794×** |

The project brief estimates about 20× growth for the large tables while small lookup tables stay fixed. The exact counts above remain pending CSV revalidation.

### 2.2 Viewing timestamp distribution previously recorded

The previous report recorded viewing data from 1 January 2025 through 1 July 2026, with 19 calendar months and 121 July 2026 rows. Monthly `RANGE` partitioning on `started_at` is a reasonable design for time-bounded queries and retention, but these timestamps and counts also need confirmation from `large_data.zip`.

### 2.3 Data integrity and NULL behavior

The previous report recorded no duplicate keys, invalid foreign keys, invalid device values, or checked business-rule violations. Those checks are not reproducible without the large CSVs and database. Re-run the loader’s row-count and integrity checks when the archive is restored.

Movie viewing rows may have `episode_id IS NULL`; this is valid for the project schema. Queries that anti-join against episode IDs must handle SQL NULL semantics. The optimized workload uses `NOT EXISTS` for R13 for this reason.

### 2.4 Fixed workload identifiers

The previous report says the large-data run substituted `title_id = 40002` for several seed-specific series queries and used `view_id = 990000001` for W01. However, `benchmarks/results/large/workload.sql` is not present in the current workspace, so those substitutions and their fixture data cannot be audited. Keep `queries/workload_30.sql` and `sql/06_optimized_queries.sql` unchanged; if substitutions are needed to execute large-data fixtures, retain the exact benchmark-only workload and explain how each substitute preserves the query’s intent.

## 3. Previously recorded large-data benchmark results

The previous report contained the results below. They are preserved for continuity, but are **not verified against current benchmark files**: the optimized and large `summary.csv` files are empty, and there are no raw plans in the large-results directory. Growth is large average divided by optimized seed average. Targets match the project brief.

| Query | Type | Optimized seed (ms) | Large (ms) | Growth | Target status as previously recorded |
|---|---|---:|---:|---:|---|
| R01 | READ | 0.157 | 0.377 | 2.401× | < 5 ms met |
| R02 | READ | 0.098 | 0.102 | 1.041× | < 5 ms met |
| R03 | READ | 1.460 | 22.289 | 15.266× | < 250 ms met |
| R04 | READ | 0.969 | 9.896 | 10.213× | < 250 ms met |
| R05 | READ | 0.490 | 5.210 | 10.633× | < 250 ms met |
| R06 | READ | 0.229 | 0.218 | 0.952× | < 5 ms met |
| R07 | READ | 0.094 | 0.043 | 0.457× | < 5 ms met |
| R08 | READ | 5.703 | 92.061 | 16.143× | < 5,000 ms met |
| R09 | READ | 32.044 | 414.878 | 12.947× | < 5,000 ms met |
| R10 | READ | 0.081 | 0.224 | 2.765× | < 5 ms met |
| R11 | READ | 6.664 | 64.459 | 9.673× | < 250 ms met |
| R12 | READ | 1.766 | 28.107 | 15.916× | < 5,000 ms met |
| R13 | READ | 0.151 | 0.340 | 2.252× | < 250 ms met |
| R14 | READ | 50.713 | 367.910 | 7.255× | < 5,000 ms met |
| R15 | READ | 9.783 | 59.946 | 6.128× | < 5,000 ms met |
| R16 | READ | 321.487 | 3,062.078 | 9.525× | < 5,000 ms met |
| R17 | READ | 12.412 | 90.042 | 7.254× | < 5,000 ms met |
| R18 | READ | 40.838 | 965.358 | 23.639× | < 5,000 ms met |
| R19 | READ | 10.408 | 237.936 | 22.861× | < 5,000 ms met |
| R20 | READ | 2.778 | 56.017 | 20.165× | < 5,000 ms met |
| R21 | READ | 0.720 | 20.605 | 28.618× | < 250 ms met |
| R22 | READ | 0.259 | 1.548 | 5.977× | < 250 ms met |
| R23 | READ | 31.886 | 36.767 | 1.153× | < 250 ms met |
| R24 | READ | 0.087 | 0.129 | 1.483× | < 5 ms met |
| R25 | READ | 1.039 | 4.112 | 3.958× | < 250 ms met |
| W01 | WRITE | 1.506 | 1.891 | 1.256× | < 5 ms met |
| W02 | WRITE | 1.475 | 2.497 | 1.693× | < 5 ms met |
| W03 | WRITE | 0.846 | 1.497 | 1.770× | < 5 ms met |
| W04 | WRITE | 197.795 | 5,655.539 | 28.593× | < 2,000 ms missed |
| W05 | WRITE | 26.353 | 1,105.907 | 41.965× | < 2,000 ms met |
| **Total** | | **760.291** | **12,307.983** | **16.189×** | — |

### 3.1 Project performance targets

| Query group | Queries | Target (average of 3 runs) |
|---|---|---:|
| Real-time / member-facing | R01, R02, R06, R07, R10, R24, W01, W02, W03 | < 5 ms |
| Interactive rows, search, and operations | R03, R04, R05, R11, R13, R21, R22, R23, R25 | < 250 ms |
| Reports and analytics | R08, R09, R12, R14, R15, R16, R17, R18, R19, R20 | < 5,000 ms |
| Batch jobs | W04, W05 | < 2,000 ms |

According to the previously recorded values, W04 is the only target miss. Confirm this against the actual three-run summary and inspect its plan before deciding on a fix.

## 4. Growth analysis (based on the previously recorded figures)

These are interpretations of the historical timing and plan descriptions, not independently checked against raw plans in the current workspace.

| Query pattern | Previously recorded behavior | What to verify in the plans |
|---|---|---|
| Point lookups and profile-scoped rows (R01, R02, R06, R07, R10, R24) | All remained below 0.4 ms in the recorded large run despite roughly 20× growth in major tables. | Selective B-tree/expression index access, index conditions, rows visited, and buffer hits. |
| Date-filtered and operational queries (R03, R11, R21, R22) | Recorded growth was about 6×–29×; times remained below 65 ms. | Whether timestamp/status indexes are selected and how many rows qualify. |
| Broad analytics (R09, R14, R16, R18) | Recorded growth was about 7×–24×; R16 was reported at 3,062 ms. | Rows scanned, join strategy, sort/hash spills, temp buffers, and whether date ranges prune data. |
| Original-title and anti-join reports (R13, R19) | R13 was recorded below 1 ms; R19 at about 238 ms. | Episode-index anti-join and title/time index use; count actual index probes. |
| Deep pagination (R23) | Recorded growth was about 1.15× to 36.8 ms. | Sort elimination and the cost of walking past 150,000 rows. |
| Bulk writes (W04, W05) | W04 was reported at about 5,656 ms and missed target; W05 at about 1,106 ms and met target. | Insert row count, index maintenance, FK-trigger time, buffers dirtied, and invoice lookup path. |

The project expects analysis grouped by near-flat growth, roughly proportional growth, and superlinear growth. Classify the queries after restoring the summaries and plans; the historical ratios above are a starting point, not verified evidence.

## 5. Scale-only risks and follow-up

The prior report identifies W04 as the only large-data target miss. Its account scan and bulk invoice inserts make it a reasonable first investigation. Use the actual W04 plan to separate source-row processing, invoice index maintenance, and foreign-key trigger time. Any change should preserve the billing result and be benchmarked with the same rollback method.

Other high-volume risks to check include R16’s full-history grouping and sort, R18/R09’s broad analytics reads, and R23’s deep offset. Consider summary tables only where freshness requirements permit. Keyset pagination can reduce deep-page work, but would require a defined cursor and an approved equivalent workload.

## 6. Storage

The previous report recorded a large database size of **3,055,253,183 bytes**, with **1,111,965,696 table bytes** and **1,933,623,296 index bytes** after loading data, applying indexes, and creating the partitioned copy. These values cannot be verified from the current workspace. Seed database size was recorded as not measured. The reported **655.2 MB** CSV input size is also not verifiable because `large_data.zip` is absent.

Re-run the following on both seed and large databases after `ANALYZE` and record the output with database name and timestamp:

```sql
SELECT current_database() AS database_name,
       pg_size_pretty(pg_database_size(current_database())) AS database_size;

SELECT c.relname AS relation_name,
       pg_size_pretty(pg_table_size(c.oid)) AS table_bytes,
       pg_size_pretty(pg_indexes_size(c.oid)) AS index_bytes,
       pg_size_pretty(pg_total_relation_size(c.oid)) AS total_bytes
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'netflix'
  AND c.relkind IN ('r', 'p')
ORDER BY pg_total_relation_size(c.oid) DESC;
```

Avoid double-counting partition parents and child relations when summing sizes. State whether the partitioned copy and its indexes are included.

## 7. Architecture for 100×

### 7.1 Monthly range partitioning

Monthly `RANGE` partitioning on `viewing_activity.started_at` is a plausible design because several analytics queries filter by time and it supports retention operations. The project’s [partitioning script](../sql/08_partitioning.sql) creates a side-by-side copy, monthly partitions, a default partition, indexes, `ANALYZE`, row-comparison checks, and an `EXPLAIN` example.

The script itself says it has **not** been executed in the authoring environment. No partition-validation output is present in the current workspace, so claims in the previous report that row comparisons returned zero or that June pruning was measured should be treated as unverified until the script is run and its outputs are saved.

Before using the partitioned copy, align its constraints with `sql/01_schema.sql`: the partition script uses `BIGINT` for `view_id` while the original uses `INTEGER`; it checks `duration_watched_sec > 0` while the project schema allows `>= 0`; and it uses a single-column episode foreign key with `ON DELETE SET NULL`, while the original enforces `(episode_id, title_id)` and `ON DELETE RESTRICT`. These are behavior differences, so the partitioned table is not yet a faithful schema copy.

The partition primary key `(view_id, started_at)` includes the partition key, as PostgreSQL requires, but does not guarantee global uniqueness of `view_id` alone. The original table’s `PRIMARY KEY (view_id)` remains unchanged. A production cutover needs a globally unique ID allocation or registry design.

### 7.2 Sharding

Account-based sharding is the strongest first candidate for transactional operations because an account owns its profiles and billing/settings are account-scoped. The current `viewing_activity` table stores `profile_id`, so routing needs a reliable profile-to-account directory or a carefully constrained account routing key.

Under account sharding, global reports become cross-shard: R03 top titles, R09 genre completion, R17 ratings by Original status, R19 title totals, and R20 My List popularity. Shards can return partial counts, sums, maxima, or grouped values for a coordinator to merge. R16 can remain local by account if all its profiles are colocated, though it still aggregates that account’s history.

Profile-based sharding simplifies R01 but can split household profiles. Title-based sharding helps title-centric analytics but scatters household activity. Account placement is the better initial transactional trade-off; back it with measured workload distribution before implementation.

### 7.3 Read replicas and caching

| Workload | Suggested route | Reason |
|---|---|---|
| R01, R06, R24 | Primary for strict freshness; replica if bounded lag is acceptable | Plays and list/profile changes can be recent. |
| R10 and account settings | Primary | Identity and account status should be current. |
| W01–W05 | Primary | These are transactional writes. |
| R03, R08, R09, R12, R14–R20 | Analytics/read replica where lag is acceptable | Reporting can be isolated from transactional traffic. |
| R04, R05, R11, R13, R21–R23, R25 | Replica or cache only if the use case tolerates the freshness delay | Payment retry and compliance views may require primary freshness. |

Cache stable catalogue/search results only with an explicit TTL and invalidation policy. Avoid caching account status, billing state, or compliance decisions without approved freshness and invalidation rules.

### 7.4 Maintenance and retention

- Keep autovacuum enabled; monitor dead tuples, vacuum lag, and per-partition statistics before changing settings.
- Run `ANALYZE` after bulk loads and after creating or attaching partitions.
- Create each monthly partition before its first write and monitor the default partition for unexpected timestamps.
- Define retention and legal requirements before detaching or dropping old viewing partitions.
- Schedule any future summary/materialized-view refreshes and expose their freshness time to consumers.
- Track index size and write overhead; partitioning does not remove the need for indexes and vacuuming.

## 8. Conclusion

The prior version of this report records a 20× large-data run and flags W04 above the 2,000 ms target. Those values are useful as historical notes, but the current workspace lacks the large-data archive, optimized/large summaries, raw plans, and partition-validation output needed to verify them. The partitioning design is present but unexecuted, and its copy schema needs alignment with the project schema before it can be treated as equivalent. Restore the data and benchmark artifacts, rerun the required three-run workload and validation checks, then update the results and readiness conclusion from reproducible evidence.
