# 🤝 Contributing to BCI Research Demo

Thank you for your interest in contributing! This document provides guidelines for maintaining code quality and consistency.

---

## 📋 Before You Start

- Read [README.md](README.md) for overview
- Review [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for architecture
- Follow the [Quick Start Guide](QUICK_START.md) to set up locally

---

## 🎯 Contribution Types

### 1. Bug Fixes

**What to do:**

1. Open issue describing the bug
2. Create branch: `git checkout -b fix/bug-name`
3. Fix the issue
4. Test thoroughly
5. Submit PR with description

**Checklist:**
- [ ] Bug is reproducible
- [ ] Fix doesn't break existing tests
- [ ] Code follows TypeScript conventions
- [ ] Comments explain "why" not just "what"

---

### 2. New Features

**What to do:**

1. Discuss in an issue first
2. Create branch: `git checkout -b feature/feature-name`
3. Implement with tests
4. Update README/docs if needed
5. Submit PR with motivation

**Checklist:**
- [ ] Feature aligns with research paper goals
- [ ] Fully typed (no `any`)
- [ ] Includes code comments
- [ ] Updates relevant README sections
- [ ] Added tests (if applicable)

---

### 3. Code Quality Improvements

**What to do:**

1. Refactor code for clarity
2. Improve type safety
3. Update documentation
4. Submit PR explaining improvements

**Checklist:**
- [ ] No behavioral changes
- [ ] Tests still pass
- [ ] Code is more readable/maintainable
- [ ] Type coverage increased

---

## 📝 Code Style

### TypeScript

**Always:**
- ✅ Use explicit types (no `any`)
- ✅ Use `interface` for objects, `type` for unions
- ✅ Add JSDoc comments above functions
- ✅ One file per component/service
- ✅ Group related functions in services

**Never:**
- ❌ Use `var` (use `const` or `let`)
- ❌ Implicit `any` types
- ❌ Skip type annotations
- ❌ Mix frontend/backend logic

### Example Backend Service

```typescript
/**
 * Description of what this service does.
 * 
 * Paper reference: Section X.X - Feature Title
 * 
 * @example
 * const result = await myFunction(input);
 * console.log(result);
 */

interface InputType {
  field1: string;
  field2: number;
}

interface OutputType {
  result: string;
  value: number;
}

/**
 * Explains what the function does.
 * 
 * @param input - Description of parameter
 * @returns OutputType - Description of return value
 */
export function myFunction(input: InputType): OutputType {
  // Implementation with comments
  return {
    result: input.field1,
    value: input.field2,
  };
}
```

### Example React Component

```typescript
/**
 * Component Description
 * 
 * Props:
 * - prop1: What it controls
 * - onProp2: Callback when something happens
 * 
 * Paper reference: Section X.X - Why this component exists
 */

interface MyComponentProps {
  title: string;
  onAction: (data: string) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
}) => {
  const [state, setState] = useState<string>('');

  const handleClick = useCallback(() => {
    onAction(state);
  }, [state, onAction]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <button onClick={handleClick}>Action</button>
    </div>
  );
};
```

---

## 🗂️ File Organization

### Backend Services

```typescript
// backend/src/services/myService.ts

/**
 * Service Description
 * Paper: Section X.X - Why this service matters
 */

// 1. Type definitions at top
interface MyInput { ... }
interface MyOutput { ... }

// 2. Helper functions (unexported)
function helperFunction() { ... }

// 3. Main exported functions
export function primaryFunction() { ... }

// 4. Complex exported classes
export class MyClass { ... }
```

### Frontend Components

```typescript
// frontend/src/components/MyComponent.tsx

/**
 * Component Description
 * 
 * Maps to: Paper section / Research goal
 */

import React, { useState } from 'react';
import { MyType } from '../types/index';
import { myHook } from '../hooks/myHook';

interface MyComponentProps {
  required: string;
  optional?: number;
}

// Single component per file
export const MyComponent: React.FC<MyComponentProps> = (props) => {
  // State and hooks
  // Event handlers
  // Effects
  // Render
};
```

---

## 🧪 Testing

### What to Test

- ✅ All service functions
- ✅ Component rendering
- ✅ API integration
- ✅ State transitions
- ✅ Edge cases

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myService';

describe('myService', () => {
  it('should process input correctly', () => {
    const result = myFunction({ field1: 'test', field2: 42 });
    expect(result.value).toBe(42);
  });

  it('should handle edge cases', () => {
    // Test with empty, null, invalid inputs
  });
});
```

### Running Tests

```bash
# Backend tests
npm test --workspace=backend

# Frontend tests
npm test --workspace=frontend

# All tests
npm test
```

---

## 📚 Documentation

### Update These When You Change Code

1. **Code Comments** - Explain "why", not "what"
2. **Function JSDoc** - Parameters, return values, examples
3. **README** - If adding major features
4. **API Docs** - If changing endpoints
5. **Type Definitions** - Keep interfaces in sync

### Documentation Template

```typescript
/**
 * Brief description (one line)
 * 
 * Longer explanation if needed. Can span multiple lines.
 * Explain the "why" - why does this exist?
 * 
 * Paper Reference: Section X.X - Connection to research
 * 
 * @param paramName - What this parameter does
 * @returns What the function returns
 * 
 * @example
 * const result = myFunction(input);
 * console.log(result);
 * 
 * @throws Error when something goes wrong
 */
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Run tests:**
   ```bash
   npm test
   ```

2. **Type check:**
   ```bash
   npm run build
   ```

3. **Check for unused imports:**
   - Use IDE to remove unused imports

4. **Test locally:**
   - Run `npm run dev`
   - Test your changes manually

### PR Template

```markdown
## Description
Brief description of changes

## Motivation
Why is this change needed?

## Changes
- Specific change 1
- Specific change 2

## Testing
How to test these changes

## Paper Reference
If applicable: Section X.X - Relevance

## Checklist
- [ ] Code follows TypeScript conventions
- [ ] All types are explicit (no `any`)
- [ ] Comments explain the code
- [ ] Tests pass
- [ ] Relevant docs updated
- [ ] No console errors/warnings
```

---

## 🎯 Research Alignment

### Always Ask

1. **Does this align with the paper?**
   - Feature from Section 2-3 of paper?
   - Defensible in academic context?

2. **Is it explainable?**
   - Can you explain it to a researcher?
   - Are design choices documented?

3. **Is it maintainable?**
   - Will future developers understand?
   - Code is self-explanatory?

### Paper Mapping

When adding features, map to paper:

```
// Good
/**
 * Adaptive Difficulty Scaling
 * Paper: Section 3.3 - Real-time adaptation based on performance
 * Implementation: Adjusts flash speed and object count
 */

// Avoid
/**
 * Make game harder
 */
```

---

## 🐛 Reporting Issues

### Issue Template

```markdown
## Description
Clear description of issue

## Reproduce
Steps to reproduce:
1. ...
2. ...
3. ...

## Expected
What should happen?

## Actual
What actually happens?

## Environment
- OS: macOS/Linux/Windows
- Node: v18+
- Branch: main
```

---

## 🚀 Performance Considerations

### Backend

- Avoid expensive computations in hot paths
- Cache preprocessed signals if needed
- Monitor API response times
- Use appropriate data structures

### Frontend

- Memoize expensive computations (`useMemo`)
- Use `useCallback` for event handlers
- Avoid re-renders with React.memo
- Lazy load heavy components

### Database

- Add indexes to frequently queried fields
- Use pagination for large result sets
- Clean up old sessions periodically

---

## 🔒 Security Guidelines

### Never Commit

- Private keys or secrets
- Database credentials
- Personal information
- Test data with real user info

### Always Sanitize

- User inputs
- API responses
- File uploads
- Database queries

### Use Environment Variables

```env
# ✅ Good: .env (not committed)
DATABASE_URL="postgresql://user:pass@host/db"
API_KEY="secret-key"

# ✅ Good: .env.example (committed)
DATABASE_URL="YOUR_DATABASE_URL_HERE"
API_KEY="YOUR_API_KEY_HERE"
```

---

## 📊 Code Review Checklist

Reviewers will check:

### Functionality
- [ ] Code works as intended
- [ ] No breaking changes
- [ ] Tests pass

### Code Quality
- [ ] TypeScript types are correct
- [ ] No `any` types
- [ ] Following project style
- [ ] Well commented

### Documentation
- [ ] Updated relevant docs
- [ ] Added code comments
- [ ] JSDoc for new functions
- [ ] Updated README if needed

### Tests
- [ ] Added tests for new code
- [ ] Edge cases covered
- [ ] Tests are meaningful

### Paper Alignment
- [ ] Aligns with research goals
- [ ] Defensible approach
- [ ] Proper attribution/references

---

## 🎓 Learning Resources

### Understanding the Architecture

1. Read [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
2. Review backend service files in order:
   - `eegSignalService.ts`
   - `preprocessingService.ts`
   - `featureExtractionService.ts`
   - `ldaClassifier.ts`
   - `decisionLogicService.ts`

3. Review frontend components:
   - `SessionInit.tsx`
   - `GameBoard.tsx`
   - `CalibrationDashboard.tsx`

### Understanding the Paper

- Section 2.1-2.5: Signal processing pipeline
- Section 3.1-3.3: Gamified interface & adaptation
- Read comments in code linking to paper sections

---

## 💬 Communication

### Questions?

- Open an issue on GitHub
- Discuss in pull request comments
- Reference specific code lines
- Ask about design decisions

### Suggesting Changes

1. **Small changes:** Submit PR directly
2. **Large changes:** Discuss in issue first
3. **Uncertain:** Ask in discussion/issue

---

## 🙏 Thank You!

Your contributions help advance BCI research and education. Together, we're making brain-computer interfaces more accessible and understandable!

---

**Happy contributing! 🧠✨**
