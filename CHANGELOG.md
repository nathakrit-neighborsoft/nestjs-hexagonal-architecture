# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.1.0](https://github.com/nathakrit-neighborsoft/nestjs-hexagonal-architecture/compare/v2.0.0...v2.1.0) (2026-06-25)

### Features

* **drones:** add OpenAPI response schema ([96bfb57](https://github.com/nathakrit-neighborsoft/nestjs-hexagonal-architecture/commit/96bfb5749a03f16db4ae991d740e8d07ec19282a))

### Code Refactoring

* **auth:** simplify response handling with early return ([59ba814](https://github.com/nathakrit-neighborsoft/nestjs-hexagonal-architecture/commit/59ba814cd3883b96e06edae688ba5f8e1f880baa))

## [2.0.0](https://github.com/nathakrit-neighborsoft/nestjs-hexagonal-architecture/compare/v1.0.0...v2.0.0) (2026-06-25)

### ⚠ BREAKING CHANGES

* **db:** existing users and their expenses/todos are
dropped. Run `pnpm drizzle:migrate` then `pnpm db:seed`.
Login: admin@example.com / admin123

### Features

* **db:** add Better Auth migration and seed script ([f25d715](https://github.com/nathakrit-neighborsoft/nestjs-hexagonal-architecture/commit/f25d71519c45902d23ec6f0c4f48e1b4e7f227a4))

## 1.0.0 (2026-06-25)

### Features

* 🎸 init project ([1ae3ee1](https://github.com/nathakrit-neighborsoft/nestjs-hexagonal-architecture/commit/1ae3ee1bad56414402a5d44800da38511c34b6cd))
* add drones & todos modules, migrate to Better Auth ([0b31b63](https://github.com/nathakrit-neighborsoft/nestjs-hexagonal-architecture/commit/0b31b63d306e2e28ec3868d644fe1ec972f21cd7))
* migrate from TypeORM to Drizzle ORM ([53e8f59](https://github.com/nathakrit-neighborsoft/nestjs-hexagonal-architecture/commit/53e8f596ad67a8bdfae0eabc601bdedd7040acf7))

## [1.2.0](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/compare/v1.1.0...v1.2.0) (2025-10-01)

### Features

*  🎸  add unit tests for expense use cases ([c3e06f1](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/c3e06f13fe825e764198732276f47cc6454e2770))
* 🎸 add unit tests for create use case in AI module ([3c318f4](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/3c318f4db316beb7cb5079c16977a96c5b10fe94))
* 🎸 enhance AI specifications and repository functionality ([7686676](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/7686676f1296b352788c7cab6886f0cfdf4eb28d))

### Code Refactoring

* 💡  standardize entity naming conventions in AI module template ([eb9e6c1](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/eb9e6c1ab2c0fd2b932be514bca5c9435c656c2f))
* 💡 remove userId from unit tests in AI module ([160f8d9](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/160f8d9a4bcaf5a18944b10c873f1c76f9c710ea))

## [1.1.0](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/compare/v1.0.0...v1.1.0) (2025-09-02)

### Features

* 🎸 add Kubernetes deployment configuration ([17e84b0](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/17e84b0804a5ca0fd8b186dbe10cac928a67d5be))

## 1.0.0 (2025-09-02)

### Features

*  🎸 add comprehensive module creation documentation ([766adb1](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/766adb1577a69c60a3b27a93356625993a39ccf6))
* 🎸 add AI specification and module template documentation ([f6a11da](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/f6a11da2f028538fd896ff3d9127bff387c90128))
* 🎸 add authentication and product management features ([4910974](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/4910974072e1df6296dfd268e5ce9c8e203c56bd))
* 🎸 add unit test templates for CRUD operations on entities ([ff6e7df](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/ff6e7dff14c8e75562cd961d4bed4d23042628cd))
* 🎸 create 'orders' module for managing purchase orders ([00d7d68](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/00d7d68945701c4f9ccb254528625070ae3c8afd))
* 🎸 enhance entity UUID handling in specifications ([3e2ea31](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/3e2ea31fe8cbaadf7288b2f0541e156d08626eb9))
* 🎸 enhance product controller and use case for improved data retrieval ([0ad0f25](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/0ad0f25707ffe8fbbc2062dbf10abe1826457e52))
* 🎸 enhance product repository with pagination and search capabilities ([c555e64](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/c555e6449e29737bffef6f55a78a010f7b098d24))
* 🎸 first commit ([9b485d2](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/9b485d269ff0464a0dc7b8f94b43fa835adff455))
* 🎸 implement posts module for blog management ([b9c2760](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/b9c2760db78551aa97dfe589ad0227e3097b42b5))
* 🎸 implement product domain and repository patterns ([975470b](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/975470b517e02114acf1ff9f0c340ac1b916192e))
* 🎸 initialize project structure with essential configurations and modules ([4fc206d](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/4fc206d1c0319ead42d648c2e4e47a6ec06f39dc))
* 🎸 refactor user and product modules to use TypeORM repository ([edbe578](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/edbe578bce56fecec4a6a69f6aeee85225e513cf))

### Bug Fixes

* 🐛 correct test suite description for delete expense use case ([269c485](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/269c485665711432038c61c5b860a85d7a597da0))
* 🐛 update imports in ai-module-template-spec.md to use 'type' for type-only imports ([ddb153e](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/ddb153e9b7db9909c141cddf3119c18698ff7cd0))

### Code Refactoring

* 💡 generalize entity handling across modules for improved consistency ([a71c718](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/a71c718c9925775d169e6d2d7744eb0b6ea99074))
* 💡 generalize entity types and interfaces for improved reusability ([eed1230](https://github.com/nathakritbc/nestjs-hexagonal-architecture-typeorm/commit/eed123029410c2c03a6d913913465efa45f16097))

## [1.2.2](https://github.com/nathakritbc/expense_tracker_api/compare/v1.2.1...v1.2.2) (2025-08-29)

### Bug Fixes

* add permissions to keepalive workflow ([d37f48e](https://github.com/nathakritbc/expense_tracker_api/commit/d37f48e49a2a8847ac6504a91832c904e0cc45f5))

## [1.2.1](https://github.com/nathakritbc/expense_tracker_api/compare/v1.2.0...v1.2.1) (2025-08-29)

### Bug Fixes

* improve keepalive workflow with better error handling and fallback URL ([4286f38](https://github.com/nathakritbc/expense_tracker_api/commit/4286f38e51c4820f2af74f7befc711f66478df17))

## [1.2.0](https://github.com/nathakritbc/expense_tracker_api/compare/v1.1.1...v1.2.0) (2025-08-29)

### Features

* 🎸 Add keepalive workflow to ensure Render service remains active with scheduled health checks ([e5185d9](https://github.com/nathakritbc/expense_tracker_api/commit/e5185d98a241fec2fb44b22ac74c8cdd880233be))

## [1.1.1](https://github.com/nathakritbc/expense_tracker_api/compare/v1.1.0...v1.1.1) (2025-08-29)

### Bug Fixes

* 🐛 Update keepalive workflow to use API_URL secret for health check ([1cb321f](https://github.com/nathakritbc/expense_tracker_api/commit/1cb321fcfe5b2a8493079654166f8494f0f51a11))

## [1.1.0](https://github.com/nathakritbc/expense_tracker_api/compare/v1.0.1...v1.1.0) (2025-08-29)

### Features

* 🎸 Add GitHub Actions workflow to keep Render service alive with scheduled health checks ([1334e1c](https://github.com/nathakritbc/expense_tracker_api/commit/1334e1cf44a9d200226200b60acc058f87f4794e))

## [1.0.1](https://github.com/nathakritbc/expense_tracker_api/compare/v1.0.0...v1.0.1) (2025-08-29)

### Code Refactoring

* 💡 Extract Swagger configuration into a separate file and update setup to use the new configuration ([bf2d50e](https://github.com/nathakritbc/expense_tracker_api/commit/bf2d50e29b413626a63162703116b61f2f4593ee))

## 1.0.0 (2025-08-29)

### Features

*  🎸 add Docker support and environment configuration ([057d42f](https://github.com/nathakritbc/expense_tracker_api/commit/057d42fdba32e2f179563ac30b48fc984f7de814))
*  🎸 update HTTP documentation for authentication and expenses ([08f4ed4](https://github.com/nathakritbc/expense_tracker_api/commit/08f4ed45222221e7328e89266aa8f2946cc50455))
* 🎉 add comprehensive README.md for Expense Tracker API ([563dc2d](https://github.com/nathakritbc/expense_tracker_api/commit/563dc2d76115690e433187df3de32126a0446293))
* 🎸 add authentication module with login and registration use cases, JWT strategy, and controller ([79d720e](https://github.com/nathakritbc/expense_tracker_api/commit/79d720e1f7ca6d69df2cfb13bb19383dfd4dc5c6))
* 🎸 add configuration and utility files for authentication, validation, and data handling ([5a1f96b](https://github.com/nathakritbc/expense_tracker_api/commit/5a1f96b405320a680d832289615ad07df1bb6d67))
* 🎸 add GetExpenseById use case with error handling and corresponding tests ([831e717](https://github.com/nathakritbc/expense_tracker_api/commit/831e717796dc86f334db90edea0456daaf97f761))
* 🎸 add TypeORM configuration and database module for PostgreSQL integration ([bc3fd25](https://github.com/nathakritbc/expense_tracker_api/commit/bc3fd2533e5697b8ca607d64e99ef7fe82c2864e))
* 🎸 add user and expenses tables with relationships ([cd4d44f](https://github.com/nathakritbc/expense_tracker_api/commit/cd4d44f455a9dafd09e0b45e1445658909d6f813))
* 🎸 configure TypeORM settings and introduce data source ([d3f7de4](https://github.com/nathakritbc/expense_tracker_api/commit/d3f7de4bd1d4c32411a3eb9d01a01c6747a67f29))
* 🎸 enhance expense update functionality by adding UUID handling and updating example expense data in HTTP documentation ([8113b95](https://github.com/nathakritbc/expense_tracker_api/commit/8113b9500c35fa4c5fb48c88cd61cc1cb5117804))
* 🎸 enhance migration utilities with type safety and detailed logging ([aae9402](https://github.com/nathakritbc/expense_tracker_api/commit/aae9402bc3c1a273bef6b795d0b9dc6cb619d39c))
* 🎸 implement expenses module with CRUD operations, expense reporting, and DTOs for expense management ([4637916](https://github.com/nathakritbc/expense_tracker_api/commit/46379163cfa4aa7447b69ac9104fa2537246cef5))
* 🎸 implement user module with user entity, repository, and use cases for user management ([7a7340c](https://github.com/nathakritbc/expense_tracker_api/commit/7a7340c621216b7602d5fd53106ed54296536824))
* 🎸 init project ([f0cfedc](https://github.com/nathakritbc/expense_tracker_api/commit/f0cfedca42bf6ed0243bde678f4ffafe8e2e83d1))
* 🎸 update Docker configuration and deployment scripts ([1af5584](https://github.com/nathakritbc/expense_tracker_api/commit/1af558498ae2a0a5d02f00ffa790ca87639b2c47))
* 🎸 update expense examples in HTTP documentation with new titles and UUIDs ([96ec5ff](https://github.com/nathakritbc/expense_tracker_api/commit/96ec5ffb8a7becfe3d7ee31974ac5ebc2782d75b))
* 🎸 update Swagger authentication configuration for expenses ([c2939a2](https://github.com/nathakritbc/expense_tracker_api/commit/c2939a28125e9e98cb85a9918258bcc347ab106b))
* 🎸implement enhanced migration system with custom tracking ([dc1de70](https://github.com/nathakritbc/expense_tracker_api/commit/dc1de702fa1c9cc28b57e85f17b9f7401480524a))
* 🎸remove custom validation functions for date format and integer number ([75947d8](https://github.com/nathakritbc/expense_tracker_api/commit/75947d8a2f86c6575546a16297abac0a4ca82754))

### Code Refactoring

* 💡 enhance expense query logic by consolidating query builder usage and adding totalPages to metadata ([786beb9](https://github.com/nathakritbc/expense_tracker_api/commit/786beb966b378a5b1ccb1b07453afbb0a5104297))
* 💡 improve code readability in ExpenseTypeOrmRepositor ([eaee3cf](https://github.com/nathakritbc/expense_tracker_api/commit/eaee3cf324c9d36b0c00f0b1500bb914f0ca7ec1))
* 💡 optimize expense report query by consolidating query builders and improving type conversions ([7312983](https://github.com/nathakritbc/expense_tracker_api/commit/7312983aba694bf48c7e9f68bf9bfa6ad4e61d02))

## 1.0.0 (2025-08-29)

### Features

*  🎸 add Docker support and environment configuration ([057d42f](https://github.com/nathakritbc/expense_tracker_api/commit/057d42fdba32e2f179563ac30b48fc984f7de814))
*  🎸 update HTTP documentation for authentication and expenses ([08f4ed4](https://github.com/nathakritbc/expense_tracker_api/commit/08f4ed45222221e7328e89266aa8f2946cc50455))
* 🎉 add comprehensive README.md for Expense Tracker API ([563dc2d](https://github.com/nathakritbc/expense_tracker_api/commit/563dc2d76115690e433187df3de32126a0446293))
* 🎸 add authentication module with login and registration use cases, JWT strategy, and controller ([79d720e](https://github.com/nathakritbc/expense_tracker_api/commit/79d720e1f7ca6d69df2cfb13bb19383dfd4dc5c6))
* 🎸 add configuration and utility files for authentication, validation, and data handling ([5a1f96b](https://github.com/nathakritbc/expense_tracker_api/commit/5a1f96b405320a680d832289615ad07df1bb6d67))
* 🎸 add GetExpenseById use case with error handling and corresponding tests ([831e717](https://github.com/nathakritbc/expense_tracker_api/commit/831e717796dc86f334db90edea0456daaf97f761))
* 🎸 add TypeORM configuration and database module for PostgreSQL integration ([bc3fd25](https://github.com/nathakritbc/expense_tracker_api/commit/bc3fd2533e5697b8ca607d64e99ef7fe82c2864e))
* 🎸 add user and expenses tables with relationships ([cd4d44f](https://github.com/nathakritbc/expense_tracker_api/commit/cd4d44f455a9dafd09e0b45e1445658909d6f813))
* 🎸 configure TypeORM settings and introduce data source ([d3f7de4](https://github.com/nathakritbc/expense_tracker_api/commit/d3f7de4bd1d4c32411a3eb9d01a01c6747a67f29))
* 🎸 enhance expense update functionality by adding UUID handling and updating example expense data in HTTP documentation ([8113b95](https://github.com/nathakritbc/expense_tracker_api/commit/8113b9500c35fa4c5fb48c88cd61cc1cb5117804))
* 🎸 enhance migration utilities with type safety and detailed logging ([aae9402](https://github.com/nathakritbc/expense_tracker_api/commit/aae9402bc3c1a273bef6b795d0b9dc6cb619d39c))
* 🎸 implement expenses module with CRUD operations, expense reporting, and DTOs for expense management ([4637916](https://github.com/nathakritbc/expense_tracker_api/commit/46379163cfa4aa7447b69ac9104fa2537246cef5))
* 🎸 implement user module with user entity, repository, and use cases for user management ([7a7340c](https://github.com/nathakritbc/expense_tracker_api/commit/7a7340c621216b7602d5fd53106ed54296536824))
* 🎸 init project ([f0cfedc](https://github.com/nathakritbc/expense_tracker_api/commit/f0cfedca42bf6ed0243bde678f4ffafe8e2e83d1))
* 🎸 update Docker configuration and deployment scripts ([1af5584](https://github.com/nathakritbc/expense_tracker_api/commit/1af558498ae2a0a5d02f00ffa790ca87639b2c47))
* 🎸 update expense examples in HTTP documentation with new titles and UUIDs ([96ec5ff](https://github.com/nathakritbc/expense_tracker_api/commit/96ec5ffb8a7becfe3d7ee31974ac5ebc2782d75b))
* 🎸 update Swagger authentication configuration for expenses ([c2939a2](https://github.com/nathakritbc/expense_tracker_api/commit/c2939a28125e9e98cb85a9918258bcc347ab106b))
* 🎸implement enhanced migration system with custom tracking ([dc1de70](https://github.com/nathakritbc/expense_tracker_api/commit/dc1de702fa1c9cc28b57e85f17b9f7401480524a))
* 🎸remove custom validation functions for date format and integer number ([75947d8](https://github.com/nathakritbc/expense_tracker_api/commit/75947d8a2f86c6575546a16297abac0a4ca82754))

### Code Refactoring

* 💡 enhance expense query logic by consolidating query builder usage and adding totalPages to metadata ([786beb9](https://github.com/nathakritbc/expense_tracker_api/commit/786beb966b378a5b1ccb1b07453afbb0a5104297))
* 💡 improve code readability in ExpenseTypeOrmRepositor ([eaee3cf](https://github.com/nathakritbc/expense_tracker_api/commit/eaee3cf324c9d36b0c00f0b1500bb914f0ca7ec1))
* 💡 optimize expense report query by consolidating query builders and improving type conversions ([7312983](https://github.com/nathakritbc/expense_tracker_api/commit/7312983aba694bf48c7e9f68bf9bfa6ad4e61d02))

## [1.2.0](https://github.com/nathakritbc/expense_tracker_api/compare/v1.1.0...v1.2.0) (2025-08-28)

### Features

*  🎸 add Docker support and environment configuration ([057d42f](https://github.com/nathakritbc/expense_tracker_api/commit/057d42fdba32e2f179563ac30b48fc984f7de814))
* 🎸 update Docker configuration and deployment scripts ([1af5584](https://github.com/nathakritbc/expense_tracker_api/commit/1af558498ae2a0a5d02f00ffa790ca87639b2c47))
* 🎸 update Swagger authentication configuration for expenses ([c2939a2](https://github.com/nathakritbc/expense_tracker_api/commit/c2939a28125e9e98cb85a9918258bcc347ab106b))

## [1.1.0](https://github.com/nathakritbc/expense_tracker_api/compare/v1.0.0...v1.1.0) (2025-08-28)

### Features

*  🎸 update HTTP documentation for authentication and expenses ([08f4ed4](https://github.com/nathakritbc/expense_tracker_api/commit/08f4ed45222221e7328e89266aa8f2946cc50455))
* 🎉 add comprehensive README.md for Expense Tracker API ([563dc2d](https://github.com/nathakritbc/expense_tracker_api/commit/563dc2d76115690e433187df3de32126a0446293))
* 🎸 add user and expenses tables with relationships ([cd4d44f](https://github.com/nathakritbc/expense_tracker_api/commit/cd4d44f455a9dafd09e0b45e1445658909d6f813))
* 🎸 configure TypeORM settings and introduce data source ([d3f7de4](https://github.com/nathakritbc/expense_tracker_api/commit/d3f7de4bd1d4c32411a3eb9d01a01c6747a67f29))
* 🎸 enhance migration utilities with type safety and detailed logging ([aae9402](https://github.com/nathakritbc/expense_tracker_api/commit/aae9402bc3c1a273bef6b795d0b9dc6cb619d39c))
* 🎸 update expense examples in HTTP documentation with new titles and UUIDs ([96ec5ff](https://github.com/nathakritbc/expense_tracker_api/commit/96ec5ffb8a7becfe3d7ee31974ac5ebc2782d75b))
* 🎸implement enhanced migration system with custom tracking ([dc1de70](https://github.com/nathakritbc/expense_tracker_api/commit/dc1de702fa1c9cc28b57e85f17b9f7401480524a))
* 🎸remove custom validation functions for date format and integer number ([75947d8](https://github.com/nathakritbc/expense_tracker_api/commit/75947d8a2f86c6575546a16297abac0a4ca82754))

### Code Refactoring

* 💡 enhance expense query logic by consolidating query builder usage and adding totalPages to metadata ([786beb9](https://github.com/nathakritbc/expense_tracker_api/commit/786beb966b378a5b1ccb1b07453afbb0a5104297))
* 💡 optimize expense report query by consolidating query builders and improving type conversions ([7312983](https://github.com/nathakritbc/expense_tracker_api/commit/7312983aba694bf48c7e9f68bf9bfa6ad4e61d02))

## 1.0.0 (2025-08-28)

### Features

* 🎸 add authentication module with login and registration use cases, JWT strategy, and controller ([79d720e](https://github.com/nathakritbc/expense_tracker_api/commit/79d720e1f7ca6d69df2cfb13bb19383dfd4dc5c6))
* 🎸 add configuration and utility files for authentication, validation, and data handling ([5a1f96b](https://github.com/nathakritbc/expense_tracker_api/commit/5a1f96b405320a680d832289615ad07df1bb6d67))
* 🎸 add GetExpenseById use case with error handling and corresponding tests ([831e717](https://github.com/nathakritbc/expense_tracker_api/commit/831e717796dc86f334db90edea0456daaf97f761))
* 🎸 add TypeORM configuration and database module for PostgreSQL integration ([bc3fd25](https://github.com/nathakritbc/expense_tracker_api/commit/bc3fd2533e5697b8ca607d64e99ef7fe82c2864e))
* 🎸 enhance expense update functionality by adding UUID handling and updating example expense data in HTTP documentation ([8113b95](https://github.com/nathakritbc/expense_tracker_api/commit/8113b9500c35fa4c5fb48c88cd61cc1cb5117804))
* 🎸 implement expenses module with CRUD operations, expense reporting, and DTOs for expense management ([4637916](https://github.com/nathakritbc/expense_tracker_api/commit/46379163cfa4aa7447b69ac9104fa2537246cef5))
* 🎸 implement user module with user entity, repository, and use cases for user management ([7a7340c](https://github.com/nathakritbc/expense_tracker_api/commit/7a7340c621216b7602d5fd53106ed54296536824))
* 🎸 init project ([f0cfedc](https://github.com/nathakritbc/expense_tracker_api/commit/f0cfedca42bf6ed0243bde678f4ffafe8e2e83d1))

### Code Refactoring

* 💡 improve code readability in ExpenseTypeOrmRepositor ([eaee3cf](https://github.com/nathakritbc/expense_tracker_api/commit/eaee3cf324c9d36b0c00f0b1500bb914f0ca7ec1))
