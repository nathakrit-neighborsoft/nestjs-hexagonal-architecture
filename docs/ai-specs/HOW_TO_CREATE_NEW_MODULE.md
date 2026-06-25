# 🚀 วิธีการสร้าง Module ใหม่ - NestJS Hexagonal Architecture

## 📋 ภาพรวม

คู่มือนี้จะแสดงวิธีการใช้ AI Agent Specification เพื่อสร้าง module ใหม่ในโปรเจ็กต์ NestJS Hexagonal Architecture แบบ step-by-step

## 📁 ไฟล์ที่เกี่ยวข้อง

- `ai-agent-spec.md` - specification หลักของโปรเจ็กต์
- `ai-module-template-spec.md` - template สำหรับสร้าง module ใหม่
- `AI_SPEC_USAGE.md` - คู่มือการใช้งาน specification

## 🎯 ขั้นตอนการสร้าง Module ใหม่

### 1. การเตรียมตัว

#### 1.1 กำหนดข้อมูล Module
ก่อนเริ่มต้น ให้กำหนดข้อมูลดังนี้:
- **Module Name**: ชื่อ module (เช่น `orders`, `payments`, `notifications`)
- **Entity Name**: ชื่อ entity หลัก (เช่น `Order`, `Payment`, `Notification`)
- **Domain**: ขอบเขตธุรกิจที่ module นี้รับผิดชอบ

#### 1.2 Prompt สำหรับ AI Agent
```
ช่วยสร้าง module ใหม่ชื่อ '{MODULE_NAME}' สำหรับ {DESCRIPTION} 
โดยใช้ ai-agent-spec.md และ ai-module-template-spec.md เป็นแนวทาง

ตัวอย่าง:
ช่วยสร้าง module ใหม่ชื่อ 'orders' สำหรับจัดการคำสั่งซื้อ 
โดยใช้ ai-agent-spec.md และ ai-module-template-spec.md เป็นแนวทาง
```

### 2. โครงสร้าง Module ที่จะถูกสร้าง

```
src/{module-name}/
├── adapters/
│   ├── inbounds/              # API Layer
│   │   ├── {entity}.controller.ts
│   │   ├── create{Entity}.dto.ts
│   │   ├── update{Entity}.dto.ts
│   │   └── {entity}Response.dto.ts
│   └── outbounds/             # Database Layer
│       ├── {entity}.entity.ts
│       └── {entity}.typeorm.repository.ts
├── applications/
│   ├── domains/               # Business Logic
│   │   ├── {entity}.domain.ts
│   │   └── {entity}.domain.spec.ts
│   ├── ports/                 # Interfaces
│   │   └── {entity}.repository.ts
│   └── usecases/             # Application Logic
│       ├── create{Entity}.usecase.ts
│       ├── create{Entity}.usecase.spec.ts
│       ├── get{Entity}ById.usecase.ts
│       └── get{Entity}ById.usecase.spec.ts
└── {module}.module.ts         # NestJS Module
```

### 2.1 แนวทาง TDD (เขียนเทสก่อน)
- เขียนไฟล์เทสของ UseCase ก่อนเสมอ โดยใช้แพทเทิร์นจาก `docs/ai-specs/unit-test-spec.md`
- ยังไม่ต้องสร้าง adapter/infrastructure ใดๆ ใช้ mock สำหรับ repository แทน
- รันเทสให้แดงก่อน (Red) → เขียนโค้ดให้น้อยที่สุดให้เทสผ่าน (Green) → ปรับปรุงโค้ดให้สะอาด (Refactor)
- คำสั่งที่ใช้บ่อย:
  - `pnpm test:watch` รันเทสแบบต่อเนื่อง
  - `pnpm test path/to/usecase.spec.ts` รันเฉพาะไฟล์
  - `pnpm test:cov` ตรวจ coverage

### 3. ตัวอย่างการสร้าง "Orders" Module

#### 3.1 คำสั่ง Prompt
```
ช่วยสร้าง module ใหม่ชื่อ 'orders' สำหรับจัดการคำสั่งซื้อ 
ที่มีฟิลด์: orderId, customerId, items[], totalAmount, status, orderDate
โดยใช้ ai-agent-spec.md และ ai-module-template-spec.md เป็นแนวทาง
```

#### 3.2 AI จะทำการ:
1. **สร้างโครงสร้างโฟลเดอร์**
2. **แทนที่ Template Variables**:
   - `{MODULE_NAME}` → `orders`
   - `{ENTITY_NAME}` → `Order`
3. **สร้างไฟล์ตามลำดับ**:
   - Domain Layer → Ports → Use Cases → Adapters → Module

#### 3.3 ไฟล์ที่จะถูกสร้าง
```
src/orders/
├── adapters/
│   ├── inbounds/
│   │   ├── order.controller.ts
│   │   ├── createOrder.dto.ts
│   │   ├── updateOrder.dto.ts
│   │   └── orderResponse.dto.ts
│   └── outbounds/
│       ├── order.entity.ts
│       └── order.typeorm.repository.ts
├── applications/
│   ├── domains/
│   │   ├── order.domain.ts
│   │   └── order.domain.spec.ts
│   ├── ports/
│   │   └── order.repository.ts
│   └── usecases/
│       ├── createOrder.usecase.ts
│       ├── createOrder.usecase.spec.ts
│       ├── getOrderById.usecase.ts
│       └── getOrderById.usecase.spec.ts
└── orders.module.ts
```

### 4. ขั้นตอนหลังการสร้าง

#### 4.1 ลงทะเบียน Module ใน AppModule
```typescript
// src/app.module.ts
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // ... existing imports
    OrdersModule,
  ],
})
export class AppModule {}
```

#### 4.2 สร้าง Database Migration
```bash
pnpm run migration:generate -- --name=CreateOrdersTable
pnpm run migration:run
```

#### 4.3 ทดสอบ Module
```bash
# Unit tests
pnpm test orders

# E2E tests
pnpm run test:e2e

# Check linting
pnpm lint

# Check test coverage
pnpm run test:cov
```

### 4.4 ลำดับการพัฒนาด้วย TDD ที่แนะนำ
- เขียนเทส UseCase ก่อน (เช่น create, getById, update, delete, getAll)
- เขียนโค้ด UseCase ให้น้อยที่สุดเพื่อให้เทสผ่าน โดย mock repository
- ถ้าจำเป็นต้องมี business logic ใน Domain ให้เพิ่ม method และเขียนเทสของ Domain ด้วย
- Refactor โค้ดโดยให้เทสยังเขียวทั้งหมด
- จากนั้นจึงค่อยสร้าง Entity/Repository/Controller และ Integration/E2E Tests

## 🛠️ เทคนิคการใช้งาน AI Agent

### 1. คำสั่ง Prompt ที่มีประสิทธิภาพ

#### ✅ Prompt ที่ดี
```
ช่วยสร้าง module ใหม่ชื่อ 'products' สำหรับจัดการสินค้า
ที่มีฟิลด์: name, description, price, categoryId, stock, isActive
โดยใช้ ai-agent-spec.md และ ai-module-template-spec.md เป็นแนวทาง
```

#### ❌ Prompt ที่ไม่ดี
```
สร้าง module products
```

### 2. การขอแก้ไขเพิ่มเติม

```
เพิ่ม use case สำหรับ:
- searchProductsByCategory
- updateProductStock
- getProductsByPriceRange

และเพิ่ม validation สำหรับ price ต้องมากกว่า 0
```

### 3. การขอสร้างความสัมพันธ์ระหว่าง Module

```
เพิ่มความสัมพันธ์ระหว่าง Orders และ Products:
- Order มี OrderItems[]
- OrderItem อ้างอิง productId และมี quantity, unitPrice
โดยใช้ TypeORM relations
```

## 📝 Checklist การสร้าง Module

### ✅ Pre-Development
- [ ] กำหนด module name และ entity name ชัดเจน
- [ ] วาดภาพ domain model และความสัมพันธ์
- [ ] ระบุ business rules หลัก
- [ ] กำหนด API endpoints ที่ต้องการ

### ✅ Development Process
- [ ] Domain entity พร้อม business logic
- [ ] Repository interface (ports)
- [ ] Use cases สำหรับทุก business operation
- [ ] TypeORM entity พร้อม relations
- [ ] Repository implementation
- [ ] DTOs พร้อม validation
- [ ] Controller พร้อม Swagger documentation
- [ ] Module configuration

### ✅ Testing
- [ ] เขียน UseCase tests ก่อน และผ่านทั้งหมด (Red → Green → Refactor)
- [ ] Domain tests ผ่านทั้งหมด (เฉพาะกรณีมี business methods)
- [ ] Integration tests สำหรับ repository
- [ ] Controller tests
- [ ] E2E tests สำหรับ critical paths

### ✅ Quality Assurance
- [ ] Code linting ผ่าน (`pnpm lint`)
- [ ] Type checking ผ่าน (`pnpm build`)
- [ ] Test coverage >= 80%
- [ ] Migration ทำงานได้ถูกต้อง
- [ ] Swagger documentation ครบถ้วน

## 🚀 ตัวอย่างการใช้งานจริง

### 1. สร้าง Simple Module (Categories)
```
ช่วยสร้าง module 'categories' สำหรับจัดการหมวดหมู่สินค้า
ที่มีฟิลด์: name, slug, description, parentId, isActive
โดยใช้ ai-module-template-spec.md เป็นแนวทาง
```

### 2. สร้าง Complex Module (Orders)
```
ช่วยสร้าง module 'orders' สำหรับระบบจัดการคำสั่งซื้อ ประกอบด้วย:

Order Entity:
- orderId (UUID)
- customerId (UUID, FK to users)
- orderDate
- status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- totalAmount
- shippingAddress
- billingAddress

OrderItem Entity:
- orderItemId (UUID)  
- orderId (UUID, FK to orders)
- productId (UUID, FK to products)
- quantity
- unitPrice
- totalPrice

Business Rules:
- Order total ต้องคำนวณจาก sum ของ OrderItems
- ไม่สามารถแก้ไข Order ที่ status เป็น SHIPPED หรือ DELIVERED
- Order ต้องมี OrderItems อย่างน้อย 1 รายการ

Use Cases ที่ต้องการ:
- CreateOrder
- GetOrderById
- UpdateOrderStatus
- AddOrderItem
- RemoveOrderItem
- GetOrdersByCustomer
- GetOrdersByStatus

API Endpoints:
- POST /orders (สร้างคำสั่งซื้อ)
- GET /orders/:id (ดูรายละเอียดคำสั่งซื้อ)
- PUT /orders/:id/status (อัปเดตสถานะ)
- POST /orders/:id/items (เพิ่มสินค้า)
- DELETE /orders/:id/items/:itemId (ลบสินค้า)
- GET /orders/customer/:customerId (คำสั่งซื้อของลูกค้า)

โดยใช้ ai-module-template-spec.md เป็นแนวทาง
```

### 3. สร้าง Module พร้อม Integration
```
ช่วยสร้าง module 'notifications' สำหรับระบบแจ้งเตือน
ที่ integrate กับ orders module โดยส่ง notification เมื่อ:
- Order ถูกสร้างใหม่
- Order status เปลี่ยนแปลง
- Payment สำเร็จ

และมี use cases:
- CreateNotification
- SendEmailNotification
- SendSMSNotification
- GetNotificationsByUser
- MarkAsRead

โดยใช้ ai-module-template-spec.md และ event-driven architecture
```

## 🎯 Tips & Best Practices

### 1. การตั้งชื่อ
- **Module**: ใช้พหูพจน์ lowercase (orders, products, users)
- **Entity**: ใช้เอกพจน์ PascalCase (Order, Product, User)
- **Files**: ใช้รูปแบบตาม template

### 2. การออกแบบ Domain
- เริ่มจาก business rules ก่อน
- แยก business logic ออกจาก infrastructure
- ใช้ value objects สำหรับ complex validation

### 3. การเขียน Tests
- Test business logic ใน domain layer
- Mock dependencies ใน use case tests
- ใช้ integration tests สำหรับ database operations

### 4. การ Performance Tuning
- เพิ่ม database indexes สำหรับ frequently queried fields
- ใช้ pagination สำหรับ list operations
- พิจารณา caching สำหรับ read-heavy operations

## 🔧 Commands Reference

```bash
# Development
pnpm install              # ติดตั้ง dependencies
pnpm dev                  # รัน development server
pnpm build                # Build project

# Testing
pnpm test                 # Unit tests
pnpm test:watch           # Watch mode tests  
pnpm test:cov             # Test coverage
pnpm test:e2e             # E2E tests

# Quality
pnpm lint                 # Check linting
pnpm format               # Format code

# Database
pnpm run migration:generate -- --name=CreateSomethingTable
pnpm run migration:run    # Run migrations
pnpm run migration:revert # Rollback migrations
```

## 📞 การขอความช่วยเหลือจาก AI

เมื่อต้องการความช่วยเหลือเพิ่มเติม ให้แจ้ง AI ว่า:

```
ฉันกำลังใช้ ai-module-template-spec.md สร้าง module ใหม่ 
แต่ติดปัญหาที่ [อธิบายปัญหา] 
ช่วยแนะนำแนวทางแก้ไขตาม best practices ของโปรเจ็กต์นี้
```

---

**หมายเหตุ**: คู่มือนี้ใช้ร่วมกับ AI Agent Specification ที่มีอยู่ในโปรเจ็กต์เพื่อให้ได้ผลลัพธ์ที่สอดคล้องกับ architecture และ patterns ของโปรเจ็กต์
