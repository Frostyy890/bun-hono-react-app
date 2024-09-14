## bun-hono_api

Install dependencies:

```bash
bun install
```

Run the server:

```bash
bun run docker:dev # builds and runs PostgreSQL database container

bun run migrations:apply # push migrations to the database

bun run dev # runs the server in dev mode on http://localhost:${port}, default port: 3000

# or to start the server:

bun run start
```
Additional commands:

```bash
bun run db:studio # runs database studio

bun run migrations:generate # generates migrations based on schema changes

bun run docker:down # run this command to stop running the database container

bun run docker:purge # stops running database container and removes its volumes !Run only if necessary

```

## bun-vite-react_client

Install dependencies

```bash
cd client
bun install
```

Run the app:

```bash
cd client
bun run dev
```
This project was created using `bun init` in bun v1.1.21. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
