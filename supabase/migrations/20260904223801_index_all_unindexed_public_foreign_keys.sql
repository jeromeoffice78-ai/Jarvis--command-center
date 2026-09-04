DO $$
DECLARE
  r record;
  idx_name text;
  col_list text;
BEGIN
  FOR r IN
    SELECT c.oid AS constraint_oid,
           c.conname,
           n.nspname AS schema_name,
           t.relname AS table_name,
           c.conkey,
           t.oid AS table_oid
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.contype = 'f'
      AND n.nspname = 'public'
      AND NOT EXISTS (
        SELECT 1
        FROM pg_index i
        WHERE i.indrelid = t.oid
          AND i.indisvalid
          AND (i.indkey::smallint[])[0:cardinality(c.conkey)-1] = c.conkey
      )
    ORDER BY t.relname, c.conname
  LOOP
    SELECT string_agg(quote_ident(a.attname), ', ' ORDER BY u.ord)
      INTO col_list
    FROM unnest(r.conkey) WITH ORDINALITY AS u(attnum, ord)
    JOIN pg_attribute a
      ON a.attrelid = r.table_oid
     AND a.attnum = u.attnum;

    idx_name := regexp_replace(r.conname, '_fkey$', '_idx');

    EXECUTE format(
      'CREATE INDEX IF NOT EXISTS %I ON %I.%I (%s)',
      idx_name,
      r.schema_name,
      r.table_name,
      col_list
    );
  END LOOP;
END $$;
