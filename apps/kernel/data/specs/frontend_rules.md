# Frontend Rules (Apps/Studio)

## 1. The Stack
- **Framework**: Next.js 14 (App Router).
- **Styling**: Tailwind CSS (Utility First).
- **Components**: Shadcn/UI (Radix Primitives).

## 2. Styling Rules
- **Mandatory**: Use Tailwind utility classes (`className="p-4 bg-red-500"`).
- **Forbidden**: 
  - CSS Modules (`.module.css`).
  - SCSS/SASS.
  - Inline Styles (`style={{ color: 'red' }}`).

## 3. Component Architecture
- **Server Components**: Default. Use for fetching data.
- **Client Components**: Use `'use client'` at top of file for interactivity (hooks).
- **Icons**: Lucide React (`lucide-react`).
