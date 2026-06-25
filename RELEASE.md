# Release Management with Semantic Release

This project uses [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) for automated versioning and changelog generation.

## Commit Message Convention

เรา ใช้ [Conventional Commits](https://conventionalcommits.org/) specification สำหรับการเขียน commit messages:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature (triggers minor version bump)
- **fix**: A bug fix (triggers patch version bump)
- **perf**: A code change that improves performance (triggers patch version bump)
- **refactor**: A code change that neither fixes a bug nor adds a feature (triggers patch version bump)
- **build**: Changes that affect the build system or external dependencies (triggers patch version bump)
- **ci**: Changes to our CI configuration files and scripts (triggers patch version bump)
- **docs**: Documentation only changes (no release)
- **style**: Changes that do not affect the meaning of the code (no release)
- **test**: Adding missing tests or correcting existing tests (no release)

### Breaking Changes
For breaking changes, add `BREAKING CHANGE:` in the commit footer or add `!` after the type:
```
feat!: remove deprecated user endpoints
```
or
```
feat: add new authentication system

BREAKING CHANGE: old auth endpoints are no longer available
```

### Examples

```bash
# Feature (minor version bump)
feat: add expense filtering by date range

# Bug fix (patch version bump)
fix: resolve null pointer exception in expense calculation

# Breaking change (major version bump)
feat!: migrate to new authentication system

# Documentation (no release)
docs: update API documentation for expense endpoints

# CI changes (patch version bump)
ci: add automated testing on pull requests
```

## Release Process

### Automatic Release
Releases จะถูกสร้างโดยอัตโนมัติเมื่อ:
- Code ถูก push ไป `main` branch
- Commit message ตาม convention ข้างบน
- Tests ผ่านทั้งหมด
- Build สำเร็จ

### Manual Release (Local)
```bash
# ตรวจสอบให้แน่ใจว่าคุณอยู่บน main branch
git checkout main
git pull origin main

# Run semantic release locally (ต้องมี GitHub token)
npm run release
```

## Configuration

### Release Branches
- `main`: Production releases
- `dev`: Pre-releases (beta versions)

### Plugins Used
- `@semantic-release/commit-analyzer`: วิเคราะห์ commit messages
- `@semantic-release/release-notes-generator`: สร้าง release notes
- `@semantic-release/changelog`: อัปเดต CHANGELOG.md
- `@semantic-release/npm`: จัดการ package.json version (แต่ไม่ publish to npm)
- `@semantic-release/github`: สร้าง GitHub releases และอัปโหลด assets
- `@semantic-release/git`: Commit กลับการเปลี่ยนแปลงใน CHANGELOG.md และ package.json

### GitHub Secrets Required
ไม่ต้องเพิ่ม secrets เพิ่มเติม เพราะใช้ `GITHUB_TOKEN` ที่มีให้โดยอัตโนมัติ

## Troubleshooting

### Release ไม่ทำงาน
1. ตรวจสอบว่า commit message ถูกต้องตาม convention
2. ตรวจสอบว่า tests ผ่านทั้งหมด
3. ตรวจสอบ GitHub Actions logs
4. ตรวจสอบว่าไม่มี `[skip ci]` ใน commit message

### ไม่มี release ใหม่
- Semantic release จะสร้าง release ใหม่เมื่อมีการเปลี่ยนแปลงที่มีผลต่อ version เท่านั้น
- Changes ที่เป็น `docs`, `style`, `test` จะไม่ทำให้เกิด release ใหม่

### Version ผิด
- Major version: Breaking changes (`feat!:` หรือ `BREAKING CHANGE:`)
- Minor version: New features (`feat:`)
- Patch version: Bug fixes (`fix:`), performance (`perf:`), refactor (`refactor:`), etc.
