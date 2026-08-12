# Antigravity Agent Efficiency Guide

This document outlines strict rules for AI agents (and human workflows) operating in this repository to minimize token/context usage, prevent repetitive work, and optimize speed.

## 1. Context Minimization Rules
- **Do not read massive files entirely:** Use `grep_search` to find specific functions, variables, or API routes instead of using `view_file` on 500+ line files.
- **Do not use `list_dir` on large directories recursively:** Avoid exploring `node_modules`, `.next`, `venv`, or large dumped reference folders (like `shopify-main-extracted`) unless looking for a highly specific file.
- **Avoid pasting massive text blocks in chat:** Store reference documentation, API docs, or feature lists (like the Shopify feature list) in Markdown files in a `/docs` folder. Ask the agent to read them only when strictly necessary.

## 2. Code Editing Rules
- **Never rewrite entire files for small changes:** Always use `multi_replace_file_content` or `replace_file_content` to surgically replace only the 10-20 lines that are changing. Do not use `write_to_file` unless creating a brand new file.
- **Stop repetitive verification:** If a backend endpoint is verified to work, do not re-read its code when building the frontend unless an error is explicitly thrown. Rely on the contract/API signature.

## 3. Project Architecture (Do Not Rediscover)
Agents must read this section instead of manually exploring the repo:
- **Frontend:** Next.js 14 App Router, Tailwind CSS, Zustand, Framer Motion, TanStack Query. Located in `/frontend`.
- **Backend:** Django REST Framework, PostgreSQL, SimpleJWT. Located in `/backend`.
- **API Strategy:** All frontend API calls use the custom wrapper `apiFetch` in `frontend/src/lib/api.ts` (handles JWT rotation automatically).
- **Admin Routing:** Frontend `/admin/*`, Backend `permissions.IsAdminUser`.

## 4. Task Decomposition
- Break large feature requests (e.g., "build an entire Shopify clone") into isolated vertical slices (e.g., "Build the backend Order Tracking API", then "Build the frontend Order Tracking UI").
- Process one slice completely before moving to the next. Do not open or modify files for Phase 2 while working on Phase 1.

## 5. Scripts Over Reasoning
- If generating mock data, use Python/Node scripts rather than having the LLM type out massive JSON arrays.
- Rely on standard Django commands (`python manage.py makemigrations`) and Next.js commands (`npm run lint`) to catch structural errors deterministically, rather than asking the LLM to "check if the code is correct".
