# Logic64: Cloud Architecture Specification (v1.0)
**Type**: SaaS Platform for AI Code Governance.
**Target Audience**: Vibecoders using Cursor & Claude.
**Core Tech**: MCP over SSE (Server-Sent Events).

> **Context**: This document defines the **Target Product (Logic64)** that is being built.
> The **Builder Tool (mcp-logic64)** is the governance engine used to enforce this specification.

## 1. نظرة عامة على النظام (System Overview)
Logic64 هو نظام يتكون من جزأين رئيسيين يعملان بتناغم تام:

1.  **The Design Studio (logic64.com)**: منصة ويب تستخدم مجلس ذكاء اصطناعي متعدد الوكلاء (Multi-Agent Council) لتصميم معمارية المشروع وتوليد ملف القوانين.
2.  **The Cloud Kernel (MCP API)**: خادم سحابي يتصل بـ Cursor/Claude مباشرة لتطبيق القوانين التي تم تصميمها في الخطوة الأولى.

---

## 2. الوحدة الأولى: منصة التصميم (The Web Studio)
**المسؤولية**: تحويل "الفكرة" إلى "مخطط هندسي".

### أ. مجلس الذكاء الاصطناعي (The Council Architecture)
بدلاً من شات بوت واحد، نستخدم 3 وكلاء (Agents) يتناقشون أمام المستخدم:

*   **👷 The Builder (المنشئ)**:
    *   **Prompt Role**: Senior Software Architect.
    *   **Goal**: اقتراح الحلول التقنية الأسرع والأحدث.
    *   **Model**: Claude 3.5 Sonnet.
*   **🛡️ The Skeptic (المشكك/الحارس)**:
    *   **Prompt Role**: Security & Scalability Lead.
    *   **Goal**: نقد اقتراحات المنشئ، البحث عن الثغرات، فرض معايير صارمة.
    *   **Model**: GPT-4o.
*   **⚖️ The Moderator (الحكم)**:
    *   **Prompt Role**: Technical Project Manager.
    *   **Goal**: تلخيص النقاش، استخراج القرارات النهائية، وتحويلها لـ JSON.
    *   **Model**: Claude 3 Haiku (للسرعة).

### ب. المخرج (Output)
عند انتهاء الجلسة، يتم تخزين ملف `logic64.json` في قاعدة البيانات (Supabase) وربطه بـ `Project_ID` و `User_API_Key`.

---

## 3. الوحدة الثانية: النواة السحابية (The Cloud MCP Kernel)
**المسؤولية**: تنفيذ الحوكمة في الوقت الفعلي (Runtime Enforcement).
**البروتوكول**: MCP over SSE (Server-Sent Events).
**لا يوجد تثبيت محلي**. المستخدم يضيف رابط السيرفر فقط في Cursor.

### أ. الأدوات السحابية (Exposed Tools)
السيرفر يعرض أداتين فقط لـ Claude:

#### 1. `consult_architect`
*   **الوصف**: تستخدم عندما يريد Claude فهم "كيف" يبني ميزة معينة.
*   **المدخلات (Input)**: `{ intent: string, context: string }`
*   **العملية**:
    1.  استلام النية (مثلاً: "Auth").
    2.  البحث في `logic64.json` الخاص بالمستخدم.
    3.  إرجاع القواعد (مثلاً: "Use Supabase Auth, No Custom JWT").

#### 2. `verify_compliance`
*   **الوصف**: تستخدم لمراجعة الكود قبل عرضه للمستخدم.
*   **المدخلات (Input)**: `{ code_snippet: string, target_file: string }`
*   **العملية**:
    1.  تحليل الكود (Regex/AST parsing خفيف).
    2.  مقارنته بالقواعد.
    3.  إرجاع `Approved` أو `Rejected` مع السبب.

---

## 4. هيكلية البيانات (Database Schema)
نحتاج لقاعدة بيانات علائقية (PostgreSQL via Supabase).

### جدول المشاريع (projects)

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | معرف المشروع الفريد. |
| `user_id` | UUID | مالك المشروع. |
| `name` | String | اسم المشروع (e.g., Uber Clone). |
| `architecture_rules` | JSONB | ملف القوانين الكامل (ناتج المجلس). |
| `api_key` | String | المفتاح المستخدم للربط بـ Cursor. |

### هيكل ملف القوانين (`architecture_rules` JSONB)
```json
{
  "stack": ["Next.js", "Supabase", "Tailwind"],
  "concepts": [
    {
      "domain": "Database",
      "triggers": ["save", "fetch", "query", "sql"],
      "rules": [
        "MUST use Supabase JS Client.",
        "FORBIDDEN to use raw SQL inside components."
      ]
    },
    {
      "domain": "UI Components",
      "triggers": ["button", "view", "page"],
      "rules": [
        "MUST be functional components.",
        "Use Tailwind for styling, NO CSS modules."
      ]
    }
  ]
}
```

---

## 5. تدفق البيانات (Data Flow Sequence)
**السيناريو**: المستخدم يكتب `@logic64 أريد صفحة تسجيل دخول`.

1.  **Cursor**: يرى الـ Mention `@logic64`.
2.  **Cursor**: يفتح اتصال SSE مع `api.logic64.com`.
3.  **Claude**: يرسل طلب أداة: `consult_architect({ intent: "login page" })`.
4.  **Logic64 Server**:
    *   يفحص الـ API Key.
    *   يجلب قوانين المشروع من Supabase.
    *   يجد قسم Auth.
    *   يرد: *"Instructions: Create a form using React Hook Form + Zod. Use Supabase signInWithPassword. Do not use local storage directly."*
5.  **Claude**: يولد الكود بناءً على التعليمات.
6.  **Claude (Optional)**: يرسل الكود لـ `verify_compliance`.
7.  **Logic64 Server**: يوافق ✅.
8.  **Cursor**: يعرض الكود للمستخدم.

---

## 6. المكدس التقني للتطوير (The Tech Stack)

### Frontend (Web Studio)
*   **Framework**: Next.js 14 (App Router).
*   **UI Library**: Shadcn/UI + TailwindCSS.
*   **AI SDK**: Vercel AI SDK (Core).
*   **Diagrams**: ReactFlow (لعرض المعمارية بصرياً).

### Backend (Cloud Kernel)
*   **Runtime**: Node.js (Deployed on Vercel or Railway).
*   **Framework**: Hono (لأنه يدعم Edge و SSE بشكل ممتاز وخفيف جداً).
*   **MCP Protocol**: `@modelcontextprotocol/sdk`.
*   **Database**: Supabase.

---

## 7. خارطة طريق البناء (Implementation Phases)

### المرحلة 1: بناء "المجلس" (Weeks 1-2)
*   إنشاء واجهة الشات المتعدد (Builder vs Skeptic).
*   هندسة الـ Prompts لاستخراج JSON دقيق.
*   تخزين الـ JSON في Supabase.

### المرحلة 2: بناء النواة السحابية (Weeks 2-3)
*   إعداد Hono Server.
*   تنفيذ MCP SSE Endpoint.
*   ربط الـ Endpoint بـ Supabase لقراءة القوانين.

### المرحلة 3: الربط والإطلاق (Week 4)
*   تجربة الربط مع Cursor فعلياً.
*   إطلاق الصفحة الرئيسية (Landing Page).
*   النشر للمجتمع (Vibecoders).

---

## 8. ملاحظات هامة للفريق
*   **Stateless**: السيرفر السحابي يجب أن يكون عديم الحالة (Stateless). كل طلب يحمل الـ API Key الخاص به.
*   **Latency**: سرعة الاستجابة حيوية. استخدام Hono + Edge Functions سيضمن استجابة في أقل من 100ms.
*   **Prompt Engineering**: جودة المنتج تعتمد 90% على جودة الـ System Prompts الخاصة بـ "المجلس". يجب قضاء وقت طويل في تحسينها.
