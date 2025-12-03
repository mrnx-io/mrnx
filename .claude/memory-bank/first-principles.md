# The First Principles Protocol

## 0. The Directive

**Goal:** Maximize **Throughput** (Truth/Utility) | Minimize **Inventory** (Complexity/Noise)

**Mantra:** The only rules are the laws of physics. Everything else is a recommendation.

---

## I. The Epistemic Engine (TRUTH)

*How to think before you solve.*

1. **Question the Question**
   - Assume the initial requirements are "dumb" (even if you wrote them)
   - They are almost certainly wrong or incomplete
   - Ask: "What problem are we *actually* solving?"

2. **Boil Down to Axioms**
   - Deconstruct the problem to its fundamental physical truths
   - What is *actually* possible vs. what is assumed?
   - Identify hidden assumptions

3. **Reason Up (0→1)**
   - Do NOT reason by analogy ("best practices", "industry standard")
   - Reason from the axioms to build a novel solution
   - Novel > Derivative

---

## II. The Algorithm (SOLVE)

*The 5-Step Process for solving ANY challenge.*

### Step 1: Make Requirements Less Dumb
Your constraints are wrong. Fix them first.
- Who added this requirement? Why?
- What happens if we remove it entirely?
- Is this a real constraint or an assumed one?

### Step 2: Delete the Part or Process
If you aren't forced to add things back in 10% of the time, you aren't deleting enough.
- Can we remove this component entirely?
- What's the cost of NOT having it?
- Delete before optimizing

### Step 3: Simplify & Optimize
Do NOT optimize a thing that shouldn't exist. (See Step 2)
- What's the minimal viable solution?
- Remove all "nice to haves"
- Simplify interfaces and dependencies

### Step 4: Accelerate Cycle Time
Go faster. But ONLY after you have deleted and simplified.
- Reduce iteration time
- Parallelize where possible
- Remove bottlenecks

### Step 5: Automate
Only automate the process after it is perfect.
- Automation locks in the current process
- Automate bad processes = faster bad results
- Manual first, automate last

---

## III. Application to mrnx Frontend

### UI Design
| Step | Application |
|------|-------------|
| 1. Requirements | Do we need this feature? → Question every UI element |
| 2. Delete | Can we remove this component? → Minimal UI |
| 3. Simplify | Single-purpose components → No god components |
| 4. Accelerate | Server Components first → Faster initial load |
| 5. Automate | ESLint + TypeScript → Auto-catch errors |

### Component Architecture
| Step | Question |
|------|----------|
| 1. Requirements | Is this component actually needed? |
| 2. Delete | Can we use a simpler native element? |
| 3. Simplify | Is this the simplest implementation? |
| 4. Accelerate | Can we use Server Component? |
| 5. Automate | Should this be in a component library? |

---

## IV. Common Anti-Patterns

| Anti-Pattern | First Principles Fix |
|--------------|---------------------|
| "Best practice says..." | What are the actual constraints? |
| "We've always done it this way" | Why? Does the reason still apply? |
| "This library is popular" | Does it solve OUR problem minimally? |
| "Let's add this feature just in case" | DELETE - add back when proven needed |
| "Let's add a loading spinner" | Is the operation even slow? |
| "Let's add error handling everywhere" | Where can errors actually occur? |

---

## V. The Test

Before any major decision, ask:

1. Am I reasoning from first principles or by analogy?
2. Have I tried to delete this requirement/component?
3. Is this the simplest possible solution?
4. Am I optimizing something that shouldn't exist?
5. Am I automating too early?

If any answer is uncertain, revisit the algorithm.
