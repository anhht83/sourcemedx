import { DataSource } from 'typeorm';
import dataSourceConfig from '../config/data-source';
import { Logger } from '@nestjs/common';

type TableRow = { tablename: string };
type TypeRow = { typname: string };

async function dropTables() {
  const logger = new Logger('DropTables');
  const dataSource = new DataSource({
    ...dataSourceConfig.options,
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    logger.log('Connected to database');

    // Drop the migrations table first
    await dataSource.query(`DROP TABLE IF EXISTS "migrations" CASCADE;`);
    logger.log('Dropped migrations table');

    // Get all tables
    const tables: TableRow[] = await dataSource.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    // Drop all tables
    for (const table of tables) {
      await dataSource.query(
        `DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`,
      );
      logger.log(`Dropped table: ${table.tablename}`);
    }

    // Drop all custom types
    const types: TypeRow[] = await dataSource.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typtype = 'e' 
      AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    `);

    for (const type of types) {
      await dataSource.query(
        `DROP TYPE IF EXISTS "public"."${type.typname}" CASCADE;`,
      );
      logger.log(`Dropped type: ${type.typname}`);
    }

    logger.log('Successfully dropped all tables and types');
  } catch (error) {
    logger.error('Error dropping tables:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

// Wrap the bootstrap call in an async IIFE to handle the floating promise
void (async () => {
  try {
    await dropTables();
  } catch (error) {
    console.error('Error during bootstrap:', error);
    process.exit(1);
  }
})();
