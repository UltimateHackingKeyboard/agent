# Agent — project conventions

Angular/NgRx desktop agent. Application packages live under `packages/` (`uhk-common`, `uhk-web`, `uhk-agent`, `uhk-usb`, `uhk-smart-macro`, …).

## Branch from master for PRs

When implementing a pull request, always create a new branch from `master` first. Do not start PR work on `master` or reuse an unrelated feature branch.

1. Check out and update `master`:

   ```bash
   git checkout master
   git pull --ff-only origin master
   ```

2. Create a new branch for the PR:

   ```bash
   git checkout -b <branch-name>
   ```

3. Implement changes, commit, push, and open the PR from that branch.

If you are already on a branch that is not based on current `master`, create a fresh branch from updated `master` instead of continuing on the stale branch.

## Initialize variables and NgRx state

Initialize primitives and objects at declaration whenever a sensible default exists. The goal is typed, predictable values — not defensive `?.` and `??` scattered through selectors, templates, and components.

Treat widespread optional chaining (`?.`) and nullish coalescing (`??`) as a code smell: they often hide missing initialization or the wrong selector. Prefer concrete defaults and explicit control flow (`if` / early return) so optionality is intentional, not lazy.

### General TypeScript

- Give local variables an initial value when one is known at declaration time.
- Prefer empty-but-valid defaults (`''`, `0`, `[]`, `{}`) over `undefined`.
- Mark fields optional (`?`) only when they are genuinely absent until a specific event (e.g. async load, user action).

### NgRx state

- Define a complete `initialState` that sets every non-optional field on the `State` interface.
- Reuse existing factory helpers or constants for defaults when the codebase already provides them.
- Reserve optional properties for values that truly start unknown; do not make a field optional just to skip initializing it.

```typescript
// ✅ GOOD — complete initialState; optional only where value is truly unknown
export interface State {
    loading: boolean;
    items: Item[];
    selectedId?: string;
}

export const initialState: State = {
    loading: false,
    items: [],
};

// ❌ BAD — optional everywhere forces nullish handling downstream
export interface State {
    loading?: boolean;
    items?: Item[];
}

export const initialState: State = {};
```

## Function parameters

Functions and methods with more than three parameters are hard to maintain. Prefer an options/payload object once the call needs four or more values.

```typescript
// ❌ BAD
createKeymapWithMacroAssignment(abbr, name, layerId, moduleId, keyId, macroId)

// ✅ GOOD
createKeymapWithMacroAssignment({ abbreviation, name, layerId, moduleId, keyId, macroId })
```

Three-or-fewer scalar params are fine when the meaning stays obvious at the call site.

## Prefer existing styles

Do not add custom CSS when Bootstrap utilities or existing shared styles already cover spacing, typography, and layout.

Prefer:

- Bootstrap utilities: `my-2`, `mb-3`, `me-1`, `small`, `text-nowrap`, `float-end`, …
- Patterns already used nearby (e.g. `back-to` uses `class="my-2"`)

Avoid:

- New BEM blocks for one-off spacing/font-size/weight that utilities already express
- Growing component SCSS with unexplained overrides that later confuse deletions

```html
<!-- ❌ BAD -->
<div class="macro__assignments">…</div>
<!-- plus .macro__assignments { font-size: 0.875rem; padding-top: 1.25em; } -->

<!-- ✅ GOOD -->
<div class="my-2 small">…</div>
```

Only add custom CSS when no existing utility/shared rule fits, and keep it minimal.

## Smart / dumb components

Follow the smart/dumb (container/presentational) pattern already used in this codebase.

Responsibilities:

- **Store / selectors / smart parents**: derive view models, sort/filter/map domain data, combine streams.
- **Leaf components**: receive `@Input()`s, render them, emit `@Output()`s / dispatch obvious user intents. Avoid reading the store just to compute display data.

```typescript
// ❌ BAD — deep leaf component selects and calculates
class MacroHeaderComponent {
  constructor(store: Store) {
    store.select(getKeymaps).subscribe(keymaps => this.assignments = map(keymaps));
  }
}

// ✅ GOOD — smart parent selects; leaf renders
// macro-edit (smart)
assignments$ = this.store.select(getSelectedMacroKeyAssignments);

// template
<macro-header [macro]="macro" [assignments]="assignments$ | async"></macro-header>

// macro-header (dumb regarding this data)
@Input() assignments: MacroKeyAssignmentViewModel[] = [];
```

Existing leaf components that already inject `Store` only to `dispatch` actions are acceptable when inherited; do not expand them with new selectors or calculation logic.

## Refactor before commit or PR

Before committing or opening a pull request, review the diff for refactoring opportunities in the code you touched.

Iterative changes — especially from agent-assisted edits — often leave redundant helpers, duplicated logic, dead code, or overly narrow abstractions. Clean these up when the refactor is clearly worthwhile and stays within the scope of the change.

- Prefer consolidating duplication and removing unused code over adding new layers.
- Do not expand scope into unrelated files or drive-by refactors.
- If a refactor would be large or risky, note it in the PR instead of blocking the commit.
