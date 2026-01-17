# libs/db

Shared DB helpers for services.

This lib provides a small TypeORM integration: a `createDataSource` factory and an example `Delivery` entity.

Usage notes:

- Ensure `reflect-metadata` is imported once in your application's entrypoint (e.g. `main.ts`).
- Example to create and initialize a DataSource:

```ts
import { createDataSource } from '@ibieats/db';

const ds = createDataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT || 5432),
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	entities: [__dirname + '/**/*.entity{.ts,.js}'],
	synchronize: false,
});

await ds.initialize();
```

Keep schemas owned by each service; this lib offers a shared client factory and lightweight common entity examples.
