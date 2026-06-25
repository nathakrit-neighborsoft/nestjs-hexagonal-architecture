# 📚 Module Creation Documentation Index

## 📖 Overview

ศูนย์รวมเอกสารทั้งหมดสำหรับการสร้าง module ใหม่ในโปรเจ็กต์ NestJS Hexagonal Architecture

## 📋 Documentation Files

### 🎯 Main Specifications
| File | Purpose | When to Use |
|------|---------|-------------|
| [`ai-agent-spec.md`](./ai-agent-spec.md) | โครงสร้างและหลักการของโปรเจ็กต์ทั้งหมด | อ่านก่อนเริ่มพัฒนา, สำหรับเข้าใจ architecture |
| [`ai-module-template-spec.md`](./ai-module-template-spec.md) | Template สำหรับสร้าง module ใหม่ | ใช้เป็น reference ตอนสร้าง module |

### 📚 User Guides  
| File | Purpose | Target Audience |
|------|---------|----------------|
| [`HOW_TO_CREATE_NEW_MODULE.md`](./HOW_TO_CREATE_NEW_MODULE.md) | คู่มือละเอียดการสร้าง module | มือใหม่, ต้องการคำแนะนำทีละขั้นตอน |
| [`QUICK_MODULE_GUIDE.md`](./QUICK_MODULE_GUIDE.md) | คู่มือฉบับรวดเร็ว | มือเก่า, ต้องการ reference รวดเร็ว |
| [`AI_SPEC_USAGE.md`](./AI_SPEC_USAGE.md) | วิธีใช้งาน specification files | สำหรับเข้าใจการใช้งานไฟล์ต่างๆ |

### 📝 Project Documentation
| File | Purpose |  
|------|---------|
| [`README.md`](./README.md) | ข้อมูลทั่วไปของโปรเจ็กต์ |
| [`MODULE_CREATION_INDEX.md`](./MODULE_CREATION_INDEX.md) | ไฟล์นี้ - ดัชนีเอกสาร |

## 🚀 Quick Start Paths

### 👶 สำหรับมือใหม่
1. อ่าน [`ai-agent-spec.md`](./ai-agent-spec.md) เพื่อเข้าใจโปรเจ็กต์
2. ศึกษา [`HOW_TO_CREATE_NEW_MODULE.md`](./HOW_TO_CREATE_NEW_MODULE.md) 
3. ทดลองสร้าง module ตามตัวอย่าง
4. ใช้ [`ai-module-template-spec.md`](./ai-module-template-spec.md) เป็น reference

### ⚡ สำหรับมือเก่า
1. เปิด [`QUICK_MODULE_GUIDE.md`](./QUICK_MODULE_GUIDE.md)
2. Copy prompt template ที่ต้องการ
3. ใช้ [`ai-module-template-spec.md`](./ai-module-template-spec.md) สำหรับ code templates

### 🤖 สำหรับ AI Agents
1. โหลด [`ai-agent-spec.md`](./ai-agent-spec.md) เข้า context เสมอ
2. ใช้ [`ai-module-template-spec.md`](./ai-module-template-spec.md) เป็นแนวทางการสร้าง code
3. อ้างอิง [`AI_SPEC_USAGE.md`](./AI_SPEC_USAGE.md) สำหรับการใช้งาน specification

## 📋 Common Workflows

### 🔧 สร้าง Simple CRUD Module
```
1. อ่าน QUICK_MODULE_GUIDE.md
2. ใช้ prompt template: Simple CRUD Module  
3. ตรวจสอบผลลัพธ์ตาม checklist ใน ai-module-template-spec.md
```

### 🏗️ สร้าง Complex Business Module
```
1. ศึกษา business requirements ใน HOW_TO_CREATE_NEW_MODULE.md
2. ใช้ prompt template: Complex Business Module
3. ตรวจสอบ business logic ใน domain layer
4. ทดสอบตาม testing strategy ใน ai-agent-spec.md
```

### 🔗 สร้าง Module with Relations
```
1. วาดภาพ ERD สำหรับความสัมพันธ์
2. ใช้ prompt template: Module with Relations  
3. ตรวจสอบ TypeORM relations ใน outbound adapters
4. ทดสอบ integration ระหว่าง modules
```

## 🎯 Module Types & Examples

### 📦 Basic CRUD Modules
- `categories` - หมวดหมู่สินค้า
- `brands` - ยี่ห้อสินค้า  
- `tags` - ป้ายกำกับ

**Example Prompt**:
```
ช่วยสร้าง module ใหม่ชื่อ 'categories' สำหรับจัดการหมวดหมู่
ที่มีฟิลด์: name, slug, description, isActive
โดยใช้ ai-module-template-spec.md เป็นแนวทาง
```

### 🛒 Business Logic Modules  
- `orders` - คำสั่งซื้อ
- `payments` - การชำระเงิน
- `inventory` - คลังสินค้า

**Example Prompt**:
```
ช่วยสร้าง module ใหม่ชื่อ 'orders' สำหรับจัดการคำสั่งซื้อ
ที่มีฟิลด์: customerId, items[], totalAmount, status, orderDate  
พร้อม business rules: order total คำนวณจาก items
โดยใช้ ai-module-template-spec.md เป็นแนวทาง
```

### 🔔 Integration Modules
- `notifications` - ระบบแจ้งเตือน
- `audit-logs` - บันทึกการเปลี่ยนแปลง  
- `reports` - รายงาน

**Example Prompt**:
```
ช่วยสร้าง module ใหม่ชื่อ 'notifications' ที่ integrate กับ orders module
เพื่อส่ง notification เมื่อ order status เปลี่ยน
โดยใช้ ai-module-template-spec.md และ event-driven pattern
```

## ✅ Quality Checklist

### ✅ Development Complete
- [ ] โครงสร้างไฟล์ตรงตาม template
- [ ] Domain layer มี business logic ครบถ้วน
- [ ] Use cases ครอบคลุม requirements  
- [ ] API endpoints มี validation และ documentation
- [ ] Tests ผ่านทั้งหมด (>80% coverage)

### ✅ Code Quality
- [ ] `pnpm lint` ผ่าน
- [ ] `pnpm build` สำเร็จ  
- [ ] `pnpm test` ผ่าน
- [ ] Migration ทำงานได้

### ✅ Documentation
- [ ] Swagger API docs ครบถ้วน
- [ ] README อัปเดตถ้าจำเป็น
- [ ] Comments ในส่วนที่ซับซ้อน

## 🆘 Troubleshooting

### 🐛 Common Issues

#### Module ไม่ register ใน AppModule
**Solution**: ตรวจสอบ `src/app.module.ts` และเพิ่ม import

#### Migration Error  
**Solution**: ตรวจสอบ entity structure และ database connection

#### Test Failures
**Solution**: ตรวจสอบ mock dependencies และ test data

#### Linting Errors
**Solution**: รัน `pnpm format` และแก้ไข manually

### 🔍 Getting Help

#### จาก AI Agent
```
ฉันกำลังสร้าง module '{MODULE_NAME}' แต่ติดปัญหา: {DESCRIBE_ISSUE}
ช่วยแนะนำแนวทางแก้ไขตาม ai-agent-spec.md
```

#### จาก Team
1. ตรวจสอบ existing modules ที่คล้ายกัน
2. ดู code ใน `src/users/` หรือ `src/products/` 
3. อ่าน specification files อีกครั้ง

---

💡 **Bookmark ไฟล์นี้** เพื่อเข้าถึงเอกสารทั้งหมดได้อย่างรวดเร็ว!
