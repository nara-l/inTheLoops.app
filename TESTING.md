# 🧪 Testing Workflow Guide

## 🚀 **Recommended Development Workflow**

### **Option 1: Watch Mode (Best for Active Development)**
```bash
cd viewer
npm run test:watch
```

**What happens:**
- ✅ Tests run **automatically** when you save files
- ✅ **Only runs related tests** to changed files (fast!)
- ✅ **Real-time feedback** in terminal
- ✅ **Interactive mode** - press keys for different actions

**Interactive Commands:**
- `a` - Run all tests
- `f` - Run only failed tests
- `o` - Run only tests related to changed files
- `q` - Quit watch mode

### **Option 2: Manual Testing**
```bash
cd viewer
npm test              # Run all tests once
npm run test:coverage # See what's covered
```

### **Option 3: GitHub Actions (Automatic)**
Tests run automatically on:
- ✅ Every `git push` to master
- ✅ Every Pull Request
- ✅ Multiple Node.js versions (18, 20)

## 🔄 **Daily Development Process**

### **Morning Setup:**
```bash
cd viewer
npm run test:watch    # Start in terminal tab/split
npm run dev          # Start dev server in another tab
```

### **While Coding:**
1. **Save file** → Tests auto-run → See results instantly
2. **If test fails** → Fix code → Save → Tests re-run
3. **Green tests** → Continue coding confidently

### **Before Committing:**
```bash
npm test              # Run all tests one final time
npm run lint         # Check code style
git add .
git commit -m "Your changes"
git push             # GitHub Actions will run tests
```

## 📊 **What Gets Tested**

### **Critical Components (28 tests):**
- ✅ **Hash Generation** (`stableId.ts`) - URL stability
- ✅ **Data Mapping** (`mapBang.ts`) - Content integrity  
- ✅ **Input Validation** - Security & data quality
- ✅ **ID Generation** - Collision prevention

### **Test Files:**
- `src/lib/__tests__/stableId.test.ts` - ID generation
- `src/lib/__tests__/mapBang.test.ts` - Data transformation
- `src/app/api/__tests__/validation.test.ts` - API validation

## 🛡️ **What Tests Prevent**

- **Broken URLs** (hash changes)
- **Corrupt data display** (mapping errors)
- **Invalid file uploads** (validation bypass)
- **Content overwrites** (ID collisions)

## 🎯 **VS Code Integration**

### **Install Extensions:**
1. **Jest** extension for VS Code
2. **Test Explorer UI**

### **Setup:**
- Tests show inline in editor
- Run/debug individual tests
- See coverage highlights

## 🔧 **Troubleshooting**

### **Tests Won't Run:**
```bash
cd viewer
rm -rf node_modules package-lock.json
npm install
npm test
```

### **Watch Mode Not Detecting Changes:**
```bash
# In watch mode, press 'a' to run all tests
# Or restart watch mode
```

### **Failed Tests:**
- Read the error message carefully
- Check what changed in related files
- Run `npm run test:coverage` to see what's tested

## 📈 **Expanding Tests**

### **When to Add Tests:**
- ✅ New critical utility functions
- ✅ Complex business logic
- ✅ Bug fixes (prevent regression)
- ✅ API endpoints with validation

### **Testing Philosophy:**
- **Test behavior, not implementation**
- **Focus on critical paths (20-30%)**
- **Fast, reliable, maintainable**

---

## 🚀 **Quick Start**

**Right now, run this:**
```bash
cd viewer
npm run test:watch
```

**Then in another terminal:**
```bash
cd viewer  
npm run dev
```

**Now you're developing with live test feedback!** 🎉