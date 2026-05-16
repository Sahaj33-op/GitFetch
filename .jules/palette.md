## 2026-05-16 - Fixed UI Truncation on Profile Languages Legend
**Learning:** Using strict grid columns (e.g. `grid-cols-2`) inside flexible layouts like flex containers frequently causes severe text truncation (like `TypeScript` becoming `T...`) when the layout shrinks below a certain threshold.
**Action:** When designing legends or tags next to fixed-width illustrations (like Pie Charts), prefer `flex-wrap` with intrinsic sizes or fluid width calculations over strict grid tracks, ensuring labels wrap gracefully and remain readable.
