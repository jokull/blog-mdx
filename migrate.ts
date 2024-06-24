import { $ } from "bun";

// Make a genesis migration giving us all the SQL DDL statements
await $`bun run migrate`.quiet();

// Echo them
await $`cat drizzle/*.sql > .drizzle.sql`.quiet();

// Dump Turso schema
await $`dotenvx run --quiet -- atlas schema inspect --env turso > .turso.hcl`.quiet();

// Get Atlas migrations
await $`atlas schema diff --dev-url "sqlite://dev?mode=memory" --from file://.turso.hcl --to file://.drizzle.sql --format '{{ sql . "  " }}'`;

// And cleanup
await $`rm -rf drizzle`.quiet();
