# ⚡ Quick Guide - สร้าง Module ใหม่

## 🚀 สำหรับคนรีบ (5 นาที)

### 1. Prompt Template
```
ช่วยสร้าง module ใหม่ชื่อ '{MODULE_NAME}' สำหรับ {DESCRIPTION}
ที่มีฟิลด์: {LIST_OF_FIELDS}
โดยใช้ ai-module-template-spec.md เป็นแนวทาง
```

### 2. ตัวอย่าง Prompts

#### 📦 Simple CRUD Module
```
ช่วยสร้าง module ใหม่ชื่อ 'categories' สำหรับจัดการหมวดหมู่
ที่มีฟิลด์: name, slug, description, isActive
โดยใช้ ai-module-template-spec.md เป็นแนวทาง
```

#### 🛒 Complex Business Module
```
ช่วยสร้าง module ใหม่ชื่อ 'orders' สำหรับจัดการคำสั่งซื้อ
ที่มีฟิลด์: customerId, items[], totalAmount, status, orderDate
พร้อม business rules: order total คำนวณจาก items, ไม่แก้ไข order ที่ shipped
โดยใช้ ai-module-template-spec.md เป็นแนวทาง
```

#### 🔗 Module with Relations
```
ช่วยสร้าง module ใหม่ชื่อ 'reviews' สำหรับรีวิวสินค้า
ที่มีฟิลด์: productId, userId, rating, comment, createdAt
พร้อม relations ไป products และ users modules
โดยใช้ ai-module-template-spec.md เป็นแนวทาง
```

### 3. หลังสร้าง Module เสร็จ

#### Register ใน AppModule
```typescript
// src/app.module.ts  
import { {MODULE_NAME}Module } from './{module-name}/{module-name}.module';

@Module({
  imports: [
    // ... existing
    {MODULE_NAME}Module,
  ],
})
```

#### Run Commands
```bash
pnpm run migration:generate -- --name=Create{Entity}Table
pnpm run migration:run
pnpm test {module-name}
pnpm lint
```

## 📋 Module Structure Checklist

```
✅ Domain Layer
  └── {entity}.domain.ts + .spec.ts

✅ Ports Layer  
  └── {entity}.repository.ts

✅ Use Cases Layer
  └── create/get/update/delete usecase + tests

✅ Outbound Adapters
  └── {entity}.entity.ts + .typeorm.repository.ts

✅ Inbound Adapters
  └── {entity}.controller.ts + DTOs

✅ Module Config
  └── {module}.module.ts
```

## 🎯 Common Patterns

### Domain Entity
```typescript
export class {Entity}Domain {
  constructor(private props: {Entity}Props) {}
  
  // Business methods
  validate() { /* rules */ }
  canBeDeleted() { /* logic */ }
  
  static create(props): {Entity}Domain { /* factory */ }
  toPlainObject(): {Entity}Props { /* serialization */ }
}
```

### Use Case
```typescript
@Injectable()
export class Create{Entity}UseCase {
  constructor(private repository: {Entity}Repository) {}
  
  async execute(data): Promise<{Entity}Domain> {
    // 1. Validate
    // 2. Create domain
    // 3. Apply business rules  
    // 4. Save via repository
  }
}
```

### Controller
```typescript
@Controller('{module-name}')
@ApiTags('{Entity}')
export class {Entity}Controller {
  constructor(private useCase: Create{Entity}UseCase) {}
  
  @Post()
  async create(@Body() dto: Create{Entity}Dto) {
    const domain = await this.useCase.execute(dto);
    return this.domainToResponse(domain);
  }
}
```

## 🔥 Power User Tips

### 1. Batch Creation
```
สร้าง modules พร้อมกัน: categories, brands, tags
สำหรับระบบจัดการสินค้า โดยให้มี relations:
- Product belongsTo Category, Brand
- Product hasMany Tags (many-to-many)
```

### 2. Event-Driven Integration
```
สร้าง module 'notifications' ที่ listen events จาก:
- OrderCreated → ส่งอีเมลยืนยัน
- PaymentCompleted → ส่ง SMS แจ้งเตือน  
- OrderShipped → ส่งแจ้งเตือนติดตาม
```

### 3. Advanced Business Logic
```
สร้าง module 'inventory' พร้อม business rules:
- Auto-reserve stock เมื่อมี order
- Alert เมื่อ stock ต่ำกว่า minimum  
- FIFO/LIFO stock movement
- Batch tracking สำหรับของใกล้หมดอายุ
```

## 📞 AI Helper Commands

### แก้ไข/เพิ่มเติม Module
```
เพิ่ม use case ใน orders module:
- GetOrdersByDateRange
- GetMonthlySalesReport  
- CancelOrder (with refund logic)
```

### Debug & Fix
```
module ที่สร้างมี error: {ERROR_MESSAGE}
ช่วยแก้ไขตาม ai-agent-spec.md
```

### Optimization  
```
เพิ่ม performance optimization ใน products module:
- Caching สำหรับ popular products
- Database indexing สำหรับ search
- Pagination สำหรับ large datasets
```

---
💡 **Pro Tip**: เก็บ quick guide นี้ไว้ใช้อ้างอิงเมื่อสร้าง module ใหม่ รับรอง 5 นาทีเสร็จ!
