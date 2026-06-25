import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import { drones } from '../schemas/drones.schema';
import { expenses } from '../schemas/expenses.schema';
import { todos } from '../schemas/todos.schema';
import { user } from '../schemas/auth.schema';
import * as schema from '../schemas';
import { createAuth } from '../../auth/auth';

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'admin123';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? 'Admin User';

export async function seed() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nestjs-hexagonal-architecture-typeorm',
  });

  const db = drizzle(pool, { schema });
  const auth = createAuth(db);

  try {
    console.log('Seeding database...');

    const existing = await db.select().from(user).limit(1);
    if (existing.length > 0) {
      console.log(`User already exists (${existing[0].email}). Skipping seed.`);
      console.log('To re-seed, drop all rows first.');
      return;
    }

    console.log(`Creating admin user (${ADMIN_EMAIL})...`);
    await auth.api.signUpEmail({
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: ADMIN_NAME },
    });
    const [admin] = await db.select().from(user).limit(1);
    console.log(`Created user: ${admin.id}`);

    console.log('Inserting drones...');
    await db.insert(drones).values([
      {
        company: 'DJI',
        model: 'Agras T40',
        fullName: 'DJI Agras T40 Agricultural Drone',
        priceRTF: '15999.00',
        tankCapacity: '40.00',
        flightSpeed: '10.00',
        sprayWidth: '11.00',
        coveragePerDay: '40.00',
        rtfEquipment: 'Battery, charger, controller',
      },
      {
        company: 'DJI',
        model: 'Agras T30',
        fullName: 'DJI Agras T30 Agricultural Drone',
        priceRTF: '12499.00',
        tankCapacity: '30.00',
        flightSpeed: '10.00',
        sprayWidth: '9.00',
        coveragePerDay: '30.00',
        rtfEquipment: 'Battery, charger, controller',
      },
      {
        company: 'XAG',
        model: 'P100',
        fullName: 'XAG P100 Pro Agricultural Drone',
        priceRTF: '13900.00',
        tankCapacity: '50.00',
        flightSpeed: '12.00',
        sprayWidth: '12.00',
        coveragePerDay: '45.00',
        rtfEquipment: 'Battery, charger, smart controller',
      },
      {
        company: 'XAG',
        model: 'V40',
        fullName: 'XAG V40 Agricultural Drone',
        priceRTF: '8900.00',
        tankCapacity: '20.00',
        flightSpeed: '8.00',
        sprayWidth: '7.00',
        coveragePerDay: '20.00',
        rtfEquipment: 'Battery, charger',
      },
      {
        company: 'Yamaha',
        model: 'Fazer R',
        fullName: 'Yamaha Fazer R Industrial Drone',
        priceRTF: '45000.00',
        tankCapacity: '32.00',
        flightSpeed: '20.00',
        sprayWidth: '15.00',
        coveragePerDay: '60.00',
        rtfEquipment: 'Full industrial kit',
      },
    ]);

    console.log('Inserting expenses...');
    const now = new Date();
    await db.insert(expenses).values([
      {
        title: 'Drone battery replacement',
        amount: '450.00',
        date: new Date(now.getFullYear(), now.getMonth(), 5).toISOString().split('T')[0],
        category: 'Equipment',
        notes: 'Replaced old battery',
        userId: admin.id,
      },
      {
        title: 'Field survey fuel',
        amount: '120.50',
        date: new Date(now.getFullYear(), now.getMonth(), 12).toISOString().split('T')[0],
        category: 'Fuel',
        notes: 'Truck fuel for 3 field trips',
        userId: admin.id,
      },
      {
        title: 'Annual drone insurance',
        amount: '1200.00',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 20).toISOString().split('T')[0],
        category: 'Insurance',
        notes: 'Coverage for all 3 drones',
        userId: admin.id,
      },
      {
        title: 'Pesticide restock',
        amount: '780.00',
        date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
        category: 'Chemicals',
        notes: 'Herbicide for spring season',
        userId: admin.id,
      },
      {
        title: 'Maintenance - propeller set',
        amount: '85.00',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString().split('T')[0],
        category: 'Maintenance',
        notes: 'Replaced damaged propellers on T30',
        userId: admin.id,
      },
    ]);

    console.log('Inserting todos...');
    const [firstDrone] = await db.select().from(drones).limit(1);
    await db.insert(todos).values([
      {
        title: 'Calibrate spray nozzles',
        description: 'Run calibration sequence on T40',
        userId: admin.id,
        droneId: firstDrone?.uuid ?? null,
        completed: false,
      },
      {
        title: 'Update flight controller firmware',
        description: 'Latest DJI firmware release notes to review',
        userId: admin.id,
        droneId: firstDrone?.uuid ?? null,
        completed: false,
      },
      {
        title: 'Schedule annual maintenance',
        description: 'Book service appointment for all drones',
        userId: admin.id,
        droneId: null,
        completed: true,
      },
    ]);

    console.log('\nSeed completed successfully!');
    console.log(`  Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}
