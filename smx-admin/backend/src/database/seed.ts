import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AdminRoleSeeder } from './seeders/admin-role.seeder';
import { AdminUserSeeder } from './seeders/admin-user.seeder';
import { Logger } from '@nestjs/common';
import { DatabaseModule } from './database.module';

async function bootstrap() {
  const logger = new Logger('Seeder');
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    logger.log('Starting database seeding...');

    // Get the database module
    const databaseModule = app.select(DatabaseModule);

    // Seed roles first since users depend on them
    const roleSeeder = databaseModule.get(AdminRoleSeeder);
    await roleSeeder.seed();

    // Then seed users
    const userSeeder = databaseModule.get(AdminUserSeeder);
    await userSeeder.seed();

    logger.log('Database seeding completed successfully');
  } catch (error) {
    logger.error('Error during database seeding:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Wrap the bootstrap call in an async IIFE to handle the floating promise
void (async () => {
  try {
    await bootstrap();
  } catch (error) {
    console.error('Error during bootstrap:', error);
    process.exit(1);
  }
})();
