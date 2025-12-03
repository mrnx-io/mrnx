# Tasks: mrnx Dashboard

Repetitive workflows documented for consistency.

---

## Add React Component

**Files:** `components/`, `app/`
**Steps:**
1. Decide: Server Component or Client Component?
2. Create component file with TypeScript types
3. Export from appropriate index if needed
4. Add to page/layout that uses it
5. Run `/dev-check` to validate
6. Run `/commit` to persist

**Notes:**
- Prefer Server Components unless you need interactivity
- Use 'use client' directive only when necessary
- Keep components small and focused

---

## Add Page Route

**Files:** `app/(routes)/`
**Steps:**
1. Create folder: `app/(routes)/[route-name]/`
2. Add `page.tsx` with default export
3. Add `loading.tsx` if async data fetching
4. Add `error.tsx` for error boundaries
5. Update navigation if needed
6. Run `/dev-check`
7. Run `/commit`

---

## Add API Route

**Files:** `app/api/`
**Steps:**
1. Create folder: `app/api/[endpoint]/`
2. Add `route.ts` with HTTP method handlers
3. Add request/response types
4. Handle errors appropriately
5. Test with curl or Postman
6. Run `/dev-check`
7. Run `/commit`

---

## Debug Frontend Issue

**Files:** Varies
**Steps:**
1. Reproduce in browser
2. Check browser DevTools console
3. Check Network tab for API issues
4. Add console.log or React DevTools
5. Implement fix
6. Test across breakpoints (mobile, tablet, desktop)
7. Run `/dev-check`
8. Run `/commit`

---

## Update Memory Bank

**Trigger:** After significant changes
**Steps:**
1. Review `context.md` - update current focus and recent changes
2. If architecture changed → update `architecture.md`
3. If tech stack changed → update `tech.md`
4. If scope changed → suggest updates to `brief.md`
5. If new repetitive workflow → add to `tasks.md`

---

<!-- Add new documented tasks above this line -->
