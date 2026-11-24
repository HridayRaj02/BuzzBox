-- =====================================================================
-- CP4: monthly RANGE partitioning design for viewing activity
--
-- This is a separate, side-by-side copy. It does NOT replace or modify
-- netflix.viewing_activity, which remains the CP1/CP3 comparison table.
--
-- Run after sql/01_schema.sql, sql/02_load_data.sql, and (optionally)
-- sql/05_indexes.sql:
--   psql -d netflix_large -v ON_ERROR_STOP=1 -f sql/08_partitioning.sql
--
-- Partition key: started_at (TIMESTAMPTZ), monthly RANGE partitions.
-- Partition timezone/boundaries: Asia/Kolkata (the CSV timestamps use
-- +05:30). Monthly partitions are created for Jan-2025 through Dec-2027;
-- DEFAULT catches timestamps outside that range.
--
-- IMPORTANT PostgreSQL rule:
-- A partitioned UNIQUE/PRIMARY KEY must include every partition key.
-- Therefore the PK below is (view_id, started_at), not view_id alone.
-- This does not enforce global uniqueness of view_id across months.
-- The original netflix.viewing_activity keeps its original PK(view_id).
-- Do not cut over production writes to this copy until a global ID
-- registry/allocation mechanism has been implemented and tested.
-- =====================================================================

SET search_path TO netflix;

-- 1. Create a partitioned copy with the same column types, checks, and
--    foreign-key behavior as the Netflix schema. The primary key differs
--    because PostgreSQL requires the partition key in a partitioned PK.
-- NOTE: IF NOT EXISTS does not migrate an older copy. On an existing
-- partitioned copy, inspect its definition and rebuild it deliberately
-- before relying on these corrected constraints.
CREATE TABLE IF NOT EXISTS viewing_activity_partitioned (
    view_id INTEGER NOT NULL,
    profile_id INTEGER NOT NULL,
    title_id INTEGER NOT NULL,
    episode_id INTEGER,
    started_at TIMESTAMPTZ NOT NULL,
    duration_watched_sec INTEGER NOT NULL
        CHECK (duration_watched_sec >= 0),
    device_type VARCHAR(10) NOT NULL,
    completed BOOLEAN NOT NULL,
    CONSTRAINT fk_viewing_profile
        FOREIGN KEY (profile_id)
        REFERENCES profiles(profile_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_viewing_title
        FOREIGN KEY (title_id)
        REFERENCES titles(title_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_viewing_episode_title
        FOREIGN KEY (episode_id, title_id)
        REFERENCES episodes(episode_id, title_id)
        MATCH SIMPLE
        ON DELETE RESTRICT,
    CONSTRAINT viewing_activity_partitioned_pkey
        PRIMARY KEY (view_id, started_at)
) PARTITION BY RANGE (started_at);

COMMENT ON TABLE viewing_activity_partitioned IS
'CP4 monthly partitioned copy of viewing_activity; original table remains unchanged.';

COMMENT ON CONSTRAINT viewing_activity_partitioned_pkey
ON viewing_activity_partitioned IS
'Partition key started_at must be included; this key does not guarantee global uniqueness of view_id alone.';

-- 2. Create monthly partitions for Jan-2025 through Dec-2027.
--    Use explicit Asia/Kolkata midnight boundaries so the monthly ranges
--    align with the +05:30 timestamps in the supplied CSV.
DO $partition_setup$
DECLARE
    month_start DATE := DATE '2025-01-01';
    month_end DATE;
    lower_bound TIMESTAMPTZ;
    upper_bound TIMESTAMPTZ;
    partition_name TEXT;
BEGIN
    WHILE month_start < DATE '2028-01-01' LOOP
        month_end := (month_start + INTERVAL '1 month')::DATE;
        lower_bound := month_start::TIMESTAMP AT TIME ZONE 'Asia/Kolkata';
        upper_bound := month_end::TIMESTAMP AT TIME ZONE 'Asia/Kolkata';
        partition_name := 'viewing_activity_p' || TO_CHAR(month_start, 'YYYYMM');

        IF TO_REGCLASS('netflix.' || partition_name) IS NULL THEN
            EXECUTE FORMAT(
                'CREATE TABLE netflix.%I PARTITION OF netflix.viewing_activity_partitioned
                 FOR VALUES FROM (%L) TO (%L)',
                partition_name, lower_bound, upper_bound
            );
        END IF;

        month_start := month_end;
    END LOOP;
END
$partition_setup$;

-- Catch future or unexpected timestamps rather than rejecting inserts.
CREATE TABLE IF NOT EXISTS viewing_activity_p_default
    PARTITION OF viewing_activity_partitioned DEFAULT;

-- 3. Copy the existing table into the partitioned structure.
--    ON CONFLICT makes a rerun safe for rows already copied.
INSERT INTO viewing_activity_partitioned (
    view_id, profile_id, title_id, episode_id, started_at,
    duration_watched_sec, device_type, completed
)
SELECT
    view_id, profile_id, title_id, episode_id, started_at,
    duration_watched_sec, device_type, completed
FROM viewing_activity
ON CONFLICT (view_id, started_at) DO NOTHING;

-- 4. Partition-aware indexes matching the important CP3 access paths.
--    Creating an index on the partitioned parent creates matching
--    partition indexes for existing and future attached partitions.

-- R01: latest unfinished plays for one profile, title, and timestamp.
CREATE INDEX IF NOT EXISTS viewing_activity_part_profile_unfinished_idx
    ON viewing_activity_partitioned (profile_id, title_id, started_at DESC)
    INCLUDE (episode_id, duration_watched_sec)
    WHERE NOT completed;

-- R14: profile history ordered by time for kids-profile probes.
CREATE INDEX IF NOT EXISTS viewing_activity_part_profile_started_idx
    ON viewing_activity_partitioned (profile_id, started_at DESC)
    INCLUDE (title_id, episode_id, duration_watched_sec, completed);

-- R19: title-specific view counts and latest view.
CREATE INDEX IF NOT EXISTS viewing_activity_part_title_started_idx
    ON viewing_activity_partitioned (title_id, started_at DESC);

-- R13: anti-join probes; NULL episode IDs are excluded.
CREATE INDEX IF NOT EXISTS viewing_activity_part_episode_idx
    ON viewing_activity_partitioned (episode_id)
    WHERE episode_id IS NOT NULL;

-- R23: newest-first support console ordering.
CREATE INDEX IF NOT EXISTS viewing_activity_part_started_idx
    ON viewing_activity_partitioned (started_at DESC);

-- Optional BRIN for broad time-range scans within large individual
-- partitions. Keep only if measured plans show a benefit; it complements
-- rather than replaces the B-tree ordering index above.
CREATE INDEX IF NOT EXISTS viewing_activity_part_started_brin_idx
    ON viewing_activity_partitioned USING BRIN (started_at)
    WITH (pages_per_range = 64);

-- 5. Refresh planner statistics after the bulk copy and index creation.
ANALYZE viewing_activity_partitioned;

-- 6. Row-count and full-row comparison checks.
SELECT
    (SELECT COUNT(*) FROM viewing_activity) AS original_rows,
    (SELECT COUNT(*) FROM viewing_activity_partitioned) AS partitioned_rows;

-- Both values should be zero. EXCEPT ALL checks full row contents, not
-- merely the row count.
SELECT COUNT(*) AS rows_missing_from_partitioned
FROM (
    SELECT view_id, profile_id, title_id, episode_id, started_at,
           duration_watched_sec, device_type, completed
    FROM viewing_activity
    EXCEPT ALL
    SELECT view_id, profile_id, title_id, episode_id, started_at,
           duration_watched_sec, device_type, completed
    FROM viewing_activity_partitioned
) AS missing_rows;

SELECT COUNT(*) AS extra_rows_in_partitioned
FROM (
    SELECT view_id, profile_id, title_id, episode_id, started_at,
           duration_watched_sec, device_type, completed
    FROM viewing_activity_partitioned
    EXCEPT ALL
    SELECT view_id, profile_id, title_id, episode_id, started_at,
           duration_watched_sec, device_type, completed
    FROM viewing_activity
) AS extra_rows;

-- 7. Demonstrate monthly partition pruning for June 2026.
--    Inspect the plan: only the June 2026 partition should be scanned.
EXPLAIN (ANALYZE, BUFFERS)
SELECT COUNT(*)
FROM viewing_activity_partitioned
WHERE started_at >= TIMESTAMPTZ '2026-06-01 00:00:00+05:30'
  AND started_at <  TIMESTAMPTZ '2026-07-01 00:00:00+05:30';

-- 8. Show partition sizes and row counts after loading.
SELECT
    child.relname AS partition_name,
    pg_size_pretty(pg_total_relation_size(child.oid)) AS total_size,
    pg_total_relation_size(child.oid) AS total_size_bytes
FROM pg_inherits i
JOIN pg_class parent ON parent.oid = i.inhparent
JOIN pg_class child ON child.oid = i.inhrelid
JOIN pg_namespace n ON n.oid = parent.relnamespace
WHERE n.nspname = 'netflix'
  AND parent.relname = 'viewing_activity_partitioned'
ORDER BY child.relname;

-- Operational notes:
-- * Create next month's partition before its first write.
-- * Monitor the DEFAULT partition; move out-of-range rows before adding
--   a new bounded partition that would otherwise overlap its data.
-- * The original viewing_activity table and its PK(view_id) are untouched.
-- * This script has not been executed against PostgreSQL in the authoring
--   environment. Run it on the large database and preserve the EXPLAIN
--   output as CP4 evidence before calling the partition design validated.
