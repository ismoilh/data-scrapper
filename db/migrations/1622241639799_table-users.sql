-- Up Migration
CREATE TABLE IF NOT EXISTS public."users"
(
    id SERIAL,
    email VARCHAR(255) not NULL UNIQUE,
    first_name VARCHAR(255) not NULL,
    last_name VARCHAR(255) not NULL,
    avatar text,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS first_name_idx ON public."users" (first_name);

CREATE INDEX IF NOT EXISTS last_name_idx ON public."users" (last_name);

-- Down Migration
DROP TABLE IF EXISTS public."users";

DROP INDEX IF EXISTS public.first_name_idx;

DROP INDEX IF EXISTS public.last_name_idx;