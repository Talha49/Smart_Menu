# Project Fixes & Solutions

## Lockfile Issue Fix (Windows)

### Problem
Next.js 16.0.3 on Windows was throwing:
```
Error: An IO error occurred while attempting to create and acquire the lockfile
TypeError: bindings.lockfileTryAcquireSync is not a function
```

### Solution Implemented

1. **Created automatic cleanup script** (`scripts/start-dev.js`)
   - Automatically cleans `.next` directory and `.next.lock` file before starting
   - Prevents lockfile conflicts

2. **Updated npm scripts**
   - `npm run dev` - Uses the cleanup script automatically
   - `npm run dev:direct` - Direct Next.js start (if needed)
   - `npm run clean` - Manual cleanup command
   - `npm run clean:full` - Full cleanup including node_modules

3. **Added `.npmrc` file**
   - Sets `legacy-peer-deps=true` to handle React 19 peer dependency issues

4. **Updated `next.config.ts`**
   - Added webpack configuration to prevent file system issues
   - Configured experimental features properly

### Usage

**Normal development:**
```bash
npm run dev
```

**If you still get lockfile errors:**
```bash
npm run clean
npm run dev
```

**Full reset (if issues persist):**
```bash
npm run clean:full
```

### Why This Works

- The cleanup script removes stale lockfiles before Next.js tries to create them
- This prevents the native binding conflict on Windows
- The `.npmrc` ensures consistent dependency resolution
- The webpack config prevents file system access issues

### Prevention

The `npm run dev` command now automatically cleans up before starting, so this should not happen again. If it does, use `npm run clean` first.

