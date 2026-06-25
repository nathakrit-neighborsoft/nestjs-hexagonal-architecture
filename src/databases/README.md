# Database Migrations Guide

## Overview
ระบบ migration สำหรับจัดการโครงสร้างฐานข้อมูลของ Expense Tracker API โดยใช้ TypeORM พร้อมระบบติดตาม timestamp และ execution history แบบครบถ้วน

## Configuration
Configuration ทั้งหมดอยู่ในไฟล์:
- `src/configs/typeorm.config.ts` - หลัก configuration
- `src/databases/data-source.ts` - DataSource สำหรับ migrations

## Available Commands

### Migration Commands
```bash
# สร้าง migration ใหม่จาก entity changes
npm run migration:generate -- src/databases/migrations/MigrationName

# สร้าง migration file เปล่า
npm run migration:create -- src/databases/migrations/MigrationName

# รัน migrations ทั้งหมด
npm run migration:run

# ย้อนกลับ migration ล่าสุด
npm run migration:revert

# ดู migration status
npm run migration:show
```

### Schema Commands
```bash
# ลบฐานข้อมูลทั้งหมด
npm run schema:drop

# Sync schema (development only)
npm run schema:sync
```

### Utility Commands
```bash
# Reset ฐานข้อมูลทั้งหมดและรัน migrations ใหม่
npm run db:reset

# ตรวจสอบสถานะ migrations พร้อม history
npm run db:status

# ดูสถิติ migrations แบบละเอียด
npm run db:stats
```

## Migration Files
อยู่ใน `src/databases/migrations/`

### Current Migrations
1. `1756391900901-CreateUsersTable.ts` - สร้าง users table
   - uuid (Primary Key)
   - email (Unique)
   - password
   - createdAt, updatedAt

2. `1756391900902-CreateExpensesTable.ts` - สร้าง expenses table
   - uuid (Primary Key)
   - title, amount, date, category, notes
   - user_id (Foreign Key → users.uuid)
   - createdAt, updatedAt
   - Indexes: user_id, user_id+category, user_id+date, user_id+category+date

3. `1756391900903-CreateCustomMigrationsHistoryTable.ts` - สร้าง enhanced migrations_history table
   - Enhanced tracking พร้อม timestamp และ execution details

## Enhanced Migration Tracking

### Custom Migrations History Table
ระบบใหม่ใช้ตาราง `migrations_history` แทน `migrations` มาตรฐาน พร้อมฟิลด์เพิ่มเติม:

- `id` - Primary Key
- `timestamp` - Migration timestamp (เดิม)
- `name` - Migration name (เดิม) 
- `executed_at` - วันเวลาที่รัน migration (ใหม่)
- `execution_time` - เวลาที่ใช้ในการ execute (milliseconds)
- `success` - สถานะการทำงานสำเร็จหรือไม่
- `error_message` - ข้อความ error (หากมี)
- `created_at` - วันเวลาที่สร้าง record
- `updated_at` - วันเวลาที่อัปเดท record ล่าสุด

## Workflow

### Development
1. แก้ไข Entity files
2. Generate migration: `npm run migration:generate -- src/databases/migrations/YourMigrationName`
3. Review generated migration
4. Run migration: `npm run migration:run`

### Production
1. Review all migrations
2. Run: `npm run migration:run`

### การ Setup Database ใหม่
```bash
# วิธีที่ 1: ใช้ migrations (แนะนำ)
npm run migration:run

# วิธีที่ 2: Reset ทั้งหมด (development only)
npm run db:reset
```

## Environment Variables
```env
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=expense_tracker_db
```

## Best Practices
1. ใช้ descriptive names สำหรับ migration files
2. Review migration files ก่อน run production
3. สำรอง database ก่อนรัน migrations ใน production
4. ไม่แก้ไข migration files ที่รันไปแล้ว
5. ใช้ transactions ใน complex migrations

## Troubleshooting

### หาก migration ล้มเหลว
```bash
# ดูสถานะปัจจุบัน
npm run migration:show

# ย้อนกลับ migration ล่าสุด
npm run migration:revert
```

### หาก entity ไม่ตรงกับ database
```bash
# Generate migration ใหม่
npm run migration:generate -- src/databases/migrations/FixEntityMismatch
```

### ดู Migration Statistics
```bash
# ดูสถิติการรัน migrations
npm run db:stats

# ดูสถานะและ history
npm run db:status
```

### Reset database (development only)
```bash
npm run db:reset
```

## Migration History Features

### Automatic Tracking
- ทุก migration จะถูก log พร้อม timestamp
- บันทึกเวลาที่ใช้ในการ execute
- ติดตามสถานะสำเร็จ/ล้มเหลว
- เก็บ error messages หากเกิดปัญหา

### Statistics Available
- จำนวน migrations ทั้งหมด
- อัตราความสำเร็จ
- เวลาเฉลี่ยในการ execute
- Migration แรกและล่าสุด

### Enhanced Error Handling
- บันทึก error details อัตโนมัติ
- แสดงประวัติ failures
- ติดตาม execution performance
