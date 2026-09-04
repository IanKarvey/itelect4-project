# ITELECT4 · Session 8

_Forms + Complete Frontend · Aug 22, 2026_

Converted from the interactive lecture console. 52 steps.

## Contents

1. Before you start
2. What today covers
3. Recap: Session 7
4. The form we shipped
5. What it cannot do
6. React Hook Form
7. What is React Hook Form?
8. One keystroke
9. Install
10. useForm
11. register()
12. Zod
13. What is Zod?
14. .refine()
15. z.infer
16. One schema, two jobs
17. The schema file
18. Wiring them together
19. What is a resolver?
20. What happens on click
21. handleSubmit()
22. formState.errors
23. mode & defaultValues
24. Shadcn UI
25. What is Shadcn UI?
26. Installed vs owned
27. The "@/" alias
28. Two doc traps
29. shadcn init
30. What init wrote
31. index.css after init
32. Adding the components
33. Inside button.tsx
34. cva variants
35. The form, in Shadcn
36. Shadcn and AI
37. The finished page
38. Three pairings
39. What did NOT change
40. Login and Courses
41. text-foreground
42. Your new file tree
43. What you should see
44. Traps to remember
45. Closing GT3
46. GT3 Part 3
47. Branch, PR, tag
48. All three parts
49. Homework + MA1
50. Module 3 complete
51. Before next session
52. End

---

## Step 1 — Forms + Complete Frontend

_React Hook Form · Zod · Shadcn UI · GT3 Part 3 · tag gt3_

`ITELECT4 | AY 2026-2027 | Saturday, August 22, 2026`

> **Before we start**
> 1. Open your **itelect4-project** in VS Code.
> 2. Terminal 1: `npm run api` — leave it running all session.
> 3. Terminal 2: `npm run dev`, then open `http://localhost:5173`.
> 4. Log in with any name, so `/submissions` is reachable.
> 5. Keep `db.json` open in a tab — you will watch rows appear in it.
> 6. Everything today is built on the app you already have. Nothing is thrown away.

> **Good to know**
> - Last session of Module 3. Two libraries and one component set, then GT3 is tagged and submitted. The REST API homework and MA1 are both assigned at the end — do not leave before that.

---

## Step 2 — Session 8: Forms + Complete Frontend

_The form we shipped last week accepts anything you type. Today it stops._

1. **React Hook Form**the form, without useState
2. **Zod**the rules, written once
3. **The Resolver**the wire between the two
4. **Shadcn UI**components you own, not install
5. **Closing GT3**tag gt3, then homework

> **GT3 - Part 3 of 3**
> Graded Task -- tagged and SUBMITTED today
> - React Hook Form on at least one form in your app
> - A Zod schema with at least 3 rules, one of them a .refine()
> - The TypeScript type derived with z.infer -- not hand-written
> - Error messages visible on screen, one per field
> - Shadcn UI installed, with Button, Input and Label in use
> - Branch gt3-part3, pull request, then tag gt3 and submit

> **Good to know**
> - Topics 1 to 3 are one feature built in three parts: the values, the rules, and the wire between them. Topic 4 is independent — Shadcn works with or without React Hook Form.

---

## Step 3 — Quick Recap: Session 7

_Real data, a real POST -- and a form that trusts anything you type_

- **The API is real.** db.json is served by json-server on port 3001. Two terminals: npm run api and npm run dev. Both still needed today.
- **useQuery reads.** CoursesPage, CourseDetailPage and SubmissionsPage each call it, and the cache is shared across all three.
- **useMutation writes.** SubmissionsPage POSTs a new submission, then invalidateQueries({ queryKey: ["submissions"] }) marks that cached list out of date. A mounted component is watching that key, so TanStack Query refetches it straight away -- which is why the new card appears with no reload. None of that changes today.
- **The form is the weak spot.** One input, one useState, and the only rule anywhere is a disabled button when the box is empty.

> Today: the mutation stays exactly as it is. Only what feeds it changes.

> **Good to know**
> - The mutation you wrote last week is untouched all day. Today changes what reaches mutate(), not the write path itself.

---

## Step 4 — The Form We Shipped Last Week

_Session 7's version. Two things in it are the reason today exists._

**File:** `src/pages/SubmissionsPage.tsx` — the first SESSION 7 block, commented out

```tsx
// src/pages/SubmissionsPage.tsx -- the Session 7 version

const [repoUrl, setRepoUrl] = useState<string>("");

const handleAdd = (): void => {
  addSubmission.mutate({
    studentId:   1,
    courseCode:  "ITELECT4",
    repoUrl:     repoUrl,
    submittedAt: new Date().toISOString(),
  });
};

<input value={repoUrl}
  onChange={(e) => setRepoUrl(e.target.value)}
  placeholder="github.com/you/your-repo"
  className="w-full rounded border border-gray-300 p-2" />

<button onClick={handleAdd}
  disabled={repoUrl === ""}
  >
  {addSubmission.isPending ? "Saving..." : "Add"}
</button>
```

**Notes on the marked lines**

- **[1] line 8 — The course is never chosen** — courseCode is the literal string "ITELECT4", written inside handleAdd. Every row this form saves claims to be for the same course, whatever you actually picked.
- **[2] line 20 — The entire rule set, line by line** — disabled is a real HTML attribute -- a disabled button cannot be clicked. The braces mean "run this JavaScript and use whatever it returns". Inside them, repoUrl === "" is a comparison: it evaluates to true or false, and it is true only when repoUrl holds exactly the empty string. repoUrl is the useState variable a few lines up, so it holds whatever is typed in the box right now. Put together: the button is locked while the box is empty and unlocks the moment it holds ANY character. One space unlocks it. So do "anything" and "http://". That is the only check in the whole file.

**Try it**

1. **Terminal 1: npm run api — leave it running.**
2. **Terminal 2: npm run dev, then open the link below.**
3. **You land on /login, not /submissions. Type any name and click Log In.**
   - _The page is behind the guard from Session 6 — nothing to fix, that is Session 6 working._
4. **In Repository URL, type a SINGLE SPACE and nothing else.**
5. **Click Add submission.**
   - _Nothing saves. Red text: "That is not a valid URL — include https://"._

**What to notice**

That was TODAY's code answering. Last week the same single space was accepted and written to db.json, because the only check was the one on screen here — is the box empty. The gap between those two behaviours is the whole session.

Link: [http://localhost:5173/login](http://localhost:5173/login)

---

## Step 5 — What That Form Cannot Do

_Five gaps. None of them are Session 7's fault -- validation was not the topic yet._

**File:** `src/pages/SubmissionsPage.tsx` — the same code as the last step, with the five gaps marked

```tsx
// src/pages/SubmissionsPage.tsx -- the Session 7 version

const [repoUrl, setRepoUrl] = useState<string>("");

const handleAdd = (): void => {
  addSubmission.mutate({
    studentId:   1,
    courseCode:  "ITELECT4",
    repoUrl:     repoUrl,
    submittedAt: new Date().toISOString(),
  });
};

<input value={repoUrl}
  onChange={(e) => setRepoUrl(e.target.value)}
  placeholder="github.com/you/your-repo"
  className="w-full rounded border border-gray-300 p-2" />

<button onClick={handleAdd}
  disabled={repoUrl === ""}
  >
  {addSubmission.isPending ? "Saving..." : "Add"}
</button>
```

**Notes on the marked lines**

- **[1] line 3 — Each field costs a useState, a setter, and one more condition.** — repoUrl is one pair. A second field is a second pair and a longer disabled expression. A fifth is unreadable.
- **[2] line 8 — The student never picks a course.** — courseCode is the literal string "ITELECT4", written inside handleAdd. Every row saved claims to be for the same course.
- **[3] line 15 — Every keystroke re-runs the page.** — setRepoUrl fires on each letter typed, so the whole SubmissionsPage function runs again on each letter typed.
- **[4] line 20 — It cannot reject anything.** — The one rule in the whole file is disabled={repoUrl === ""} -- true only while the box is exactly empty, so the button unlocks on the first character typed. A single space unlocks it. So do "anything" and "http://".

> **Good to know**
> - **There is nowhere to put a message.** No element on the page is reserved for one, because nothing ever decides that a value is wrong.
> - Re-rendering on every keystroke costs nothing on one field and a lot on twenty. React Hook Form's headline claim is that a keystroke touches the DOM node only, and never re-runs the component.

---

## Step 6 — React Hook Form

_What the next four steps add_

- What React Hook Form is, and what an uncontrolled input means
- npm install react-hook-form zod @hookform/resolvers
- useForm() -- and the four things it hands back
- register("repoUrl") -- how one input connects to the form
- handleSubmit(onSubmit) -- the gate that runs the rules first

> File: src/pages/SubmissionsPage.tsx

---

## Step 7 — What Is React Hook Form?

_A hook that keeps one form's values outside React state_

**Context:** — Example only — this is not a file in the project. The real call is two steps ahead.

```text
// one hook, one form:
const form = useForm();

// put an input in it:
<input {...form.register("repoUrl")} />

// guard the submit:
<form onSubmit={form.handleSubmit(save)}>
```

**Notes on the marked lines**

- **[1] line 2 — It is one hook, called once inside a component.** — useForm() returns an object. That object holds every field's current value, every field's error message, and the functions that connect them to your inputs.
- **[2] line 5 — The values are not in React state.** — Each <input> keeps its own value, the way a plain HTML form does. React Hook Form keeps a reference to the element and reads .value off it when it needs to. React is never told, so React never re-renders.
- **[3] line 8 — handleSubmit wraps your submit function.** — form.handleSubmit(save) does not call save -- it returns a NEW function, and that is what goes on the form. The new one runs the rules first and calls save only if they all passed. Step 21 is entirely about it.

> **Good to know**
> - **An input that works that way is called uncontrolled.** Controlled means the value lives in React state -- that is useState, and it is what every input since Session 4 has been. Uncontrolled means the value lives in the DOM node.
> - **useState could not do this job.** It re-renders on every keystroke, it has no idea what a valid value is, and it needs one state and one setter per field.
> - **The trap:** there is no repoUrl variable any more, so you cannot console.log it. The values arrive as the argument to your submit function.
> - Uncontrolled is the older HTML model, not a workaround. React popularised controlled inputs; React Hook Form went back to letting the browser hold the value, which is why a keystroke costs nothing.

---

## Step 8 — One Keystroke, Two Designs

_What actually happens when you type a single character into the URL box_

| One keystroke | useState -- Session 7 | React Hook Form -- Session 8 |
| --- | --- | --- |
| Where the character is stored | React state | the DOM node itself |
| What runs | setRepoUrl, then the whole SubmissionsPage function again | nothing |
| What repaints | both useQuery hooks re-read the cache; the card grid re-renders | nothing |
| When the value is read | on every render | once, when the form is submitted |
| What it costs per extra field | one more useState, one more setter, one more condition | one more register("name") |

> Both end up with the same letter on screen. Only one of them re-rendered a page to get there.

> **Good to know**
> - On one field the difference is invisible. On a form with a cached list behind it, the re-render per keystroke is what makes typing feel laggy.

---

## Step 9 — Installing the Three Packages

_Terminal 2 -- stop npm run dev first, then start it again after_

**File:** `package.json` — Terminal 2, in the project root (the folder with `package.json`)

```bash
npm install react-hook-form zod @hookform/resolvers
```

```json
> npm install react-hook-form zod @hookform/resolvers

added 3 packages in 4s

# react-hook-form      7.85.0  -- holds the values
# zod                   4.4.3  -- holds the rules
# @hookform/resolvers   5.9.1  -- the wire between them

# Terminal 1 keeps running the whole time:
> npm run api          # json-server, port 3001

# then restart Terminal 2:
> npm run dev          # Vite, port 5173
```

**Notes on the marked lines**

- **[1] line 1 — It is an adapter between a form library and a validation library.** — React Hook Form has no idea what Zod is, and Zod has never heard of React. Neither one can call the other.

> **Good to know**
> - Three separate packages on purpose. React Hook Form works with no schema at all, and Zod has never heard of React. The resolver package is the only one that knows about both.

---

## Step 10 — useForm: the Call and What Comes Back

_One call. Everything about the form comes back in the object it returns._

**File:** `src/pages/SubmissionsPage.tsx` — the second SESSION 8 block. The three options it also passes come in steps 19 and 23.

```tsx
// The smallest useForm call there is.
const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<SubmissionFormValues>();

// Three options get added to this same call later today.
```

**Notes on the marked lines**

- **[1] line 2 — Calling it creates one form.** — useForm() runs once per component, like useState. Values, errors, and which fields have been touched all live in the object it returns.
- **[2] line 3 — register** — is a function you call once per field, passing that field's name: register("repoUrl"). Whatever it returns gets attached to the input, and that attachment is what makes the form aware of the field. The next slide is entirely about how.
- **[3] line 4 — handleSubmit** — takes your function and returns a different one. The returned one goes on <form onSubmit={...}>. It validates first, and calls yours only if every rule passed.
- **[4] line 5 — reset** — clears every field at once. Session 7 called setRepoUrl("") by hand; five fields would have been five setters.
- **[5] line 6 — formState** — describes the form rather than the data -- and errors inside it holds one message per broken field.
- **[6] line 7 — The generic is load-bearing -- and it names a type that does not exist yet.** — useForm<SubmissionFormValues>() is what makes register("repoUlr") a compile error instead of a silent no-op. You write SubmissionFormValues in the next section, and it is generated from the Zod schema rather than typed out.

> **Good to know**
> - formState: { errors } is destructuring, from Session 4. It pulls errors out of formState in the same line that pulls formState out of the useForm result.

---

## Step 11 — register("repoUrl")

_How one input joins the form_

**File:** `src/pages/SubmissionsPage.tsx` — Example only — what register() hands back. The real call is in `src/pages/SubmissionsPage.tsx`.

```tsx
// register(name) returns four props, already wired:
{
  name:     "repoUrl",
  onChange: fn,
  onBlur:   fn,
  ref:      fn,
}

// so spreading it:
<input {...register("repoUrl")} />

// is the same as writing all four by hand:
<input name="repoUrl" onChange={fn} onBlur={fn} ref={fn} />
```

**Notes on the marked lines**

- **[1] line 3 — It returns props, not a value.** — A prop is one of the attributes you write on a JSX element -- name=, onChange=, placeholder=. register("repoUrl") does not hand you what the user typed; it hands you an object holding four of those attributes: name, onChange, onBlur and ref.
- **[2] line 6 — ref is the one that matters.** — It gives React Hook Form the actual DOM node, which is how it reads the value later without any state.
- **[3] line 10 — The string is the field name, and it has to match a key in the schema.** — Type register("repoUlr") and TypeScript stops you -- but only because the generic on useForm told it which names exist.
- **[4] line 13 — The three dots are spread syntax, from Session 2.** — ... in front of an object means "write out every key in it, right here". So {...register("repoUrl")} expands into exactly the four attributes below it -- you could type those by hand on every field, and the spread saves you doing it.

> **Good to know**
> - **It works on any form element.** <input>, <select> and <textarea> all take the same spread.
> - register also works on a plain <select>. The course dropdown on the finished page is a native <select> with the same spread on it — no special component needed.

---

## Step 12 — Zod

_What the next five steps add_

- What Zod is, and how a schema differs from a TypeScript type
- z.string().min(1, "...") and z.url("...") -- two built-in rules
- .refine() -- a rule Zod does not ship, written as a function
- z.infer -- the TypeScript type, generated from the schema
- src/schemas/submissionSchema.ts -- all of it, assembled

> File: src/schemas/submissionSchema.ts

---

## Step 13 — What Is Zod?

_A library for checking data at runtime, with a schema you build in code_

**File:** `src/schemas/submissionSchema.ts` — Example only — a two-field sketch. The project's real schema is `src/schemas/submissionSchema.ts`, four steps ahead.

```ts
// a type: erased before the code runs
interface Submission {
  repoUrl: string;
}

// a schema: a value that still exists at runtime
const s = z.object({
  courseCode: z.string().min(1),
  repoUrl: z.url(),
});

s.safeParse({ repoUrl: "anything" });
// -> { success: false, error: ... }
```

**Notes on the marked lines**

- **[1] line 2 — A TypeScript interface cannot do this.** — Interfaces are erased before the code runs -- Session 1's point. At runtime there is nothing left to check anything against.
- **[2] line 7 — A schema is an ordinary value.** — It is an object sitting in a variable. You can export it, pass it to a function, and call methods on it, exactly like any other object.
- **[3] line 8 — Chaining adds one check per call.** — z.string() is a schema that accepts any string; .min(1) returns a NEW schema with one more check on it. The type check always runs first, so passing the number 5 reports "expected string, received number" and never reaches .min.
- **[4] line 9 — Not every check is a chain.** — z.url() is one call on its own -- in Zod 4 you do not put z.string() in front of it. Every tutorial written before 2025 says z.string().url(); that still runs, deprecated.
- **[5] line 12 — You build a schema object, then call .safeParse(value) on it.** — It returns { success: true, data } or { success: false, error }. It never throws, so you read the result instead of wrapping the call in try/catch. (.parse() is the throwing version; you will not need it today.)

> **Good to know**
> - **It knows nothing about React.** The same schema validates a login form, an API response, or an environment variable.
> - Compile time and runtime are two different moments. Compile time is while npm run build reads your files: nothing is running, there is no browser, no user and no data. Runtime is later, while the app is open and someone is typing into it. TypeScript exists only at compile time and is erased before runtime starts -- that is why it cannot check what a user types. Zod is an ordinary package that exists only at runtime, which is why it can.

---

## Step 14 — .refine(): Rules Zod Does Not Ship

_Any rule you can write as a boolean expression_

**File:** `src/schemas/submissionSchema.ts` — the repoUrl rule, exactly as it is in the file, plus three test values

```ts
// z.url() checks the whole shape of a URL, scheme included.
// .refine() adds any rule Zod does not ship: yours, as a function.
repoUrl: z
  .url("That is not a valid URL -- include https://")
  .refine((url) => url.includes("github.com"),
          "It has to be a GitHub URL."),

// "github.com/me/repo"        -> fails z.url()
// "https://gitlab.com/me/x"   -> passes z.url(), fails .refine()
// "https://github.com/me/x"   -> passes both
```

**Notes on the marked lines**

- **[1] line 4 — z.url() is a built-in rule.** — It answers one question: is this string shaped like a URL, scheme included? It has no opinion about which site.
- **[2] line 5 — .refine() takes a function you write.** — It receives the value and returns true to accept or false to reject. Anything you can express in JavaScript becomes a validation rule.
- **[3] line 6 — Its second argument is the message** — , shown when your function returns false -- the same position as the second argument to .min().
- **[4] line 8 — Both rules can fail on the same value.** — github.com/a/b fails z.url() because there is no scheme. https://gitlab.com/a passes z.url() and fails the refine. The field shows whichever failed first.

**Try it**

1. **Type github.com/me/repo and press Tab.**
   - _No scheme, so z.url() fails first: "That is not a valid URL — include https://". .refine() never runs._
2. **Change it to https://gitlab.com/me/repo and press Tab.**
   - _Now z.url() passes and .refine() is the one that fails, so the message CHANGES to "It has to be a GitHub URL."_
3. **Change it to https://github.com/me/repo and press Tab.**
   - _Both rules pass. The message disappears and the red border goes with it._

**What to notice**

Same box, three different answers. Both rules can fail on one value, and you fix them one at a time.

Link: [http://localhost:5173/submissions](http://localhost:5173/submissions)

> **Good to know**
> - **The trap:** .refine() runs your function on whatever the user typed, so a function that throws takes validation down with it. Keep it to one boolean expression.
> - A URL with no scheme fails z.url() before .refine() ever runs, so you see the URL message and not the GitHub one. Both rules can fail on the same value; you fix them one at a time.

---

## Step 15 — z.infer: the Type Comes From the Schema

_One source of truth for the rules and for the TypeScript type_

**File:** `src/schemas/submissionSchema.ts` — `src/schemas/submissionSchema.ts`, and the two lines of `src/pages/SubmissionsPage.tsx` that use what it generates (their bodies replaced with ...)

```ts
// src/schemas/submissionSchema.ts
export const submissionSchema = z.object({
  courseCode: z.string().min(1, "Choose a course."),
  repoUrl: z
    .url("That is not a valid URL -- include https://")
    .refine((url) => url.includes("github.com"),
            "It has to be a GitHub URL."),
});

// z.infer reads the schema and hands back the TypeScript type:
//   { courseCode: string; repoUrl: string }
export type SubmissionFormValues = z.infer<typeof submissionSchema>;

// src/pages/SubmissionsPage.tsx -- the two places it is used
} = useForm<SubmissionFormValues>({ ... });
const onSubmit = (values: SubmissionFormValues): void => { ... };
```

**Notes on the marked lines**

- **[1] line 2 — The schema is the source.** — Every rule this form has lives in this one object. Everything below it is derived from what is written here — nothing is typed out a second time.
- **[2] line 3 — Each key becomes a property of the generated type.** — z.string() is what makes courseCode come out as string. The .min(1) and its message are runtime rules and do NOT appear in the type, because "a string of at least one character" is not something TypeScript can express.
- **[3] line 6 — .refine() changes the rules, never the type.** — repoUrl is still plain string as far as TypeScript is concerned. The GitHub check runs at runtime against what the user actually typed; the compiler has no way to know what a string will contain.
- **[4] line 11 — What it actually produces.** — Exactly this: two keys, both string. Add score: z.number() to the schema and the type becomes three keys with score: number — same keystroke, no second file to edit.
- **[5] line 12 — This is the whole trick, in one line.** — z.infer<T> is a generic type that takes a schema's type and produces the shape that schema accepts. SubmissionFormValues is not written by you — TypeScript computes it from submissionSchema at compile time. Hover it in VS Code and you see the real object type, not the word infer.
- **[6] line 15 — Usage 1 — the form knows its own field names.** — With this generic on useForm, register("repoUrle") is a compile error. Without it, that typo is a field that silently never validates and never saves.
- **[7] line 16 — Usage 2 — the values arrive already typed.** — Inside onSubmit, values.courseCode autocompletes and values.coursecode is a compile error. You never wrote that type; the schema did.

**Try it**

1. **VS Code only — nothing to run, nothing to edit. Open src/schemas/submissionSchema.ts.**
2. **Hover the mouse over SubmissionFormValues on the last line.**
   - _The tooltip spells the type out: { courseCode: string; repoUrl: string }. Nobody typed that anywhere — z.infer read the schema and produced it._
3. **Open src/pages/SubmissionsPage.tsx and hover the word values inside onSubmit.**
   - _The same two fields, arriving in a different file._

**What to notice**

That is how a rule written once ends up type-checking code somewhere else.

> **Good to know**
> - **typeof here is the type-level typeof, not the JavaScript operator.** Inside a type expression, typeof x means "the type of the variable x". You need it because z.infer wants a TYPE and submissionSchema is a VALUE — z.infer<submissionSchema> on its own is an error.
> - **Written by hand, the type is a second thing to maintain.** Add a field to the schema, forget the interface, and TypeScript happily compiles a form that ignores the new field. Generated, the two cannot disagree.
> - **This is Session 2's generics doing real work.** z.infer<T> takes a type parameter exactly the way ApiResponse<T> did — except the argument here is produced by typeof rather than written out.
> - The rules check the user at runtime and the type checks your code at compile time, and both come out of the same fifteen lines. That is the argument for a schema over hand-written validation.

---

## Step 16 — One Schema, Two Jobs

_That one small file checks the user at runtime and checks you at compile time_

|  | Rules written by hand | Rules written as a schema |
| --- | --- | --- |
| Where the rules live | if-statements scattered through the component | submissionSchema, one file |
| Where the type lives | a hand-written interface, in a second place | z.infer<typeof submissionSchema> |
| Adding a field | edit both, or silently forget one | edit the schema; the type follows |
| Who checks the user's input | code you wrote and have to maintain | Zod, at runtime |
| Who checks your code | the interface -- if it is still accurate | the same schema, at compile time |

> Add a field to the schema and the type gains it in the same keystroke. There is no second file to remember.

> **Good to know**
> - This is the payoff for Sessions 1 and 2. typeof and generics were exercises then; here they are what stops a form's rules and a form's type from drifting apart.

---

## Step 17 — src/schemas/submissionSchema.ts

_Every piece of it has now been explained. This is all of it._

**File:** `src/schemas/submissionSchema.ts` — the real file, complete, nothing shortened

```ts
// One schema. The rules live here, and the TypeScript type is DERIVED
// from it -- so a rule and its type can never drift apart.
import { z } from "zod";

export const submissionSchema = z.object({
  // .min(1) is what "required" means for a string: not empty.
  courseCode: z.string().min(1, "Choose a course."),

  // z.url() checks the whole shape of a URL, scheme included.
  // .refine() adds any rule Zod does not ship: yours, as a function.
  repoUrl: z
    .url("That is not a valid URL -- include https://")
    .refine((url) => url.includes("github.com"),
            "It has to be a GitHub URL."),
});

// z.infer reads the schema and hands back the TypeScript type:
//   { courseCode: string; repoUrl: string }
// Written by hand, that type would be a second thing to keep in sync.
export type SubmissionFormValues = z.infer<typeof submissionSchema>;

```

**Notes on the marked lines**

- **[1] line 5 — z.object builds the schema** — submissionSchema is an ordinary value -- an object in a variable. Export it, pass it to a function, call methods on it.
- **[2] line 7 — .min(1) is what required means** — For a string, required means not empty. The second argument is the message the user sees.
- **[3] line 12 — z.url() checks the whole shape** — Scheme included. "github.com/me/repo" fails this, which catches most people out -- a bare domain is not a URL.
- **[4] line 13 — .refine() is your own rule** — A function that receives the value and returns true to accept or false to reject. Second argument is the message.
- **[5] line 20 — z.infer generates the type** — Derived from the schema, not typed out. Add a field to the schema and the type gains it in the same keystroke.

**Try it**

1. **Put this file and the running form side by side.**
2. **Leave the course dropdown on "Select a course...".**
3. **Type https://github.com/me/repo into Repository URL, so that field is valid.**
4. **Click Add submission.**
   - _The red text is "Choose a course." — word for word the second argument to .min(1) on the courseCode line of this file._

**What to notice**

Point at the line, then at the screen. Every message a student ever sees was typed into this one file; there is no message text anywhere in the page.

Link: [http://localhost:5173/submissions](http://localhost:5173/submissions)

> **Good to know**
> - The second argument to every rule is its message. Leave it out and Zod uses its own English — "Invalid URL" — which is correct and no help at all to someone staring at the form.

---

## Step 18 — Wiring Them Together

_What the next five steps add_

- What a resolver is, and why the two libraries need one
- zodResolver(submissionSchema) passed into useForm
- What actually happens between the click and the POST
- formState.errors -- one message per field, on screen
- mode -- choosing when the rules run

> File: src/pages/SubmissionsPage.tsx

---

## Step 19 — What Is a Resolver?

_The one function that lets React Hook Form and Zod talk to each other_

**File:** `src/pages/SubmissionsPage.tsx` — the import at the top, and the useForm call below it, both verbatim

```tsx
import { zodResolver } from "@hookform/resolvers/zod";

// the same useForm call as before, with one line added:
} = useForm<SubmissionFormValues>({
  resolver: zodResolver(submissionSchema),
});
```

**Notes on the marked lines**

- **[1] line 1 — zodResolver is the Zod one.** — The @hookform/resolvers package ships adapters for Yup, Joi and half a dozen others -- changing validator means changing this one line.
- **[2] line 4 — You never call it yourself.** — You pass it to useForm and React Hook Form calls it every time it decides to validate.
- **[3] line 5 — One function, one job:** — take the form's current values, run them through the schema, and hand back either clean values or a list of errors in the shape React Hook Form expects.

> **Good to know**
> - **It is an adapter between a form library and a validation library.** React Hook Form has no idea what Zod is, and Zod has never heard of React. Neither one can call the other.
> - **The import path ends in /zod.** @hookform/resolvers/zod. Importing from the package root gets you nothing useful, and the error message does not explain why.
> - Without a resolver, useForm accepts anything and the schema sits in a file doing nothing. One line is the whole connection.

---

## Step 20 — What Happens When You Click Add Submission

_One click, one schema run, and two possible endings_

1. You click Add submission
2. handleSubmit runs the resolver first
3. zodResolver feeds the values to the schema

**PASSES**

- Every rule passed
- onSubmit(values) is called
- addSubmission.mutate(...) POSTs
- onSuccess: invalidateQueries + reset()
- The new card appears, fields empty

**FAILS**

- At least one rule failed
- onSubmit is NEVER called
- formState.errors is filled in
- Each broken field renders its message
- No request leaves the browser

> You never write an if statement to decide. handleSubmit is the gate, and the schema is what it asks.

**Try it**

1. **Open DevTools (F12), go to the Network tab, and click the clear button.**
2. **Leave BOTH fields empty and click Add submission.**
   - _Two messages appear and the Network tab stays completely empty. Nothing left the browser._
3. **Now pick a course, type https://github.com/me/repo, and click Add submission again.**
   - _Exactly one POST appears — the first request of the whole exercise._

**What to notice**

The gate is real, not a convention. You can watch it in the Network tab rather than take it on trust.

Link: [http://localhost:5173/submissions](http://localhost:5173/submissions)

> **Good to know**
> - Submitting the empty form fires zero network requests and leaves db.json exactly as it was. The gate is real, not a convention — you can watch it in the Network tab.

---

## Step 21 — handleSubmit(onSubmit)

_The gate: it runs the schema first, and your function only if the schema passed_

**File:** `src/pages/SubmissionsPage.tsx` — onSubmit verbatim, and the <form> tag from further down the same file

```tsx
// handleSubmit only calls this after the schema passes.
const onSubmit = (values: SubmissionFormValues): void => {
  addSubmission.mutate({
    studentId:   1,
    courseCode:  values.courseCode,
    repoUrl:     values.repoUrl,
    submittedAt: new Date().toISOString(),
  });
};

<form onSubmit={handleSubmit(onSubmit)}>
```

**Notes on the marked lines**

- **[1] line 1 — Your function only runs if every rule passed** — , and it receives the values already validated and already typed. values.repoUrl is a string that cleared both rules.
- **[2] line 3 — This is where the Session 7 mutation gets called.** — addSubmission.mutate({...}) is the same call as last week, moved inside onSubmit.
- **[3] line 11 — handleSubmit takes your function and returns a different one.** — The returned function is what goes on the form's onSubmit -- not yours directly.

> **Good to know**
> - **It calls preventDefault() for you.** A plain HTML form reloads the page on submit; this is what stops that. You never write e.preventDefault() again.
> - **The trap:** onSubmit={onSubmit} without the wrapper compiles, reloads the page, and validates nothing. On screen it looks almost identical to the correct version.
> - mutate is still fire-and-forget, from Session 7. The result arrives in onSuccess, which is where reset() now lives — so the fields clear only after the row is actually saved.

---

## Step 22 — formState.errors

_One message per broken field, and the attribute that turns the box red_

**Context:** — Example only — a plain <input>. The project uses <Input>, with these exact two props on it.

```text
<input id="repoUrl" {...register("repoUrl")}
  aria-invalid={errors.repoUrl ? true : undefined}
  placeholder="https://github.com/you/your-repo" />

{errors.repoUrl && (
  <p className="text-sm text-red-600">{errors.repoUrl.message}</p>
)}
```

**Notes on the marked lines**

- **[1] line 2 — aria-invalid={errors.repoUrl ? true : undefined}.** — The ? : is a ternary -- one expression that picks between two values. If errors.repoUrl exists it yields true, otherwise undefined. undefined rather than false is deliberate: React DROPS an attribute set to undefined, so a valid field has no aria-invalid at all, while aria-invalid="false" would announce "this field is valid" to a screen reader on every field, forever.
- **[2] line 5 — errors is an object keyed by field name.** — errors.repoUrl exists only while that field is broken, and is undefined the rest of the time.
- **[3] line 6 — errors.repoUrl.message is the string you wrote in the schema.** — That is why every rule got a second argument.

**Try it**

1. **Open DevTools (F12) on the Elements tab.**
2. **Right-click the Repository URL box itself, choose Inspect, and leave that line selected in DevTools.**
3. **Type nope into the box and press Tab.**
   - _aria-invalid="true" appears out of nowhere on that element, and the border turns red._
4. **Fix it to https://github.com/me/repo and press Tab again.**
   - _The attribute VANISHES completely — not "false", gone — and the border goes back to grey._

**What to notice**

That disappearing act is the undefined branch of the ternary, and the border colour is input.tsx reading the same attribute.

Link: [http://localhost:5173/submissions](http://localhost:5173/submissions)

> **Good to know**
> - **{errors.repoUrl && (...)} renders the message only when the key is there.** && short-circuits: a falsy left side renders nothing at all.
> - **One message per field, not per rule.** repoUrl has two rules, so you see whichever failed first -- and fixing that one can reveal the next.
> - **aria-invalid isn't a styling attribute.** A screen reader reads it directly, on its own, with nothing to do with how the field looks. The finished page's <Input> also styles its red border off this same attribute, so one value drives both what a sighted user sees and what a screen reader hears -- the two can never disagree.
> - errors.repoUrl exists only while that field is broken. Reading .message off it directly would crash on a valid form, which is why every one of these is guarded with && first.

---

## Step 23 — mode and defaultValues

_The two remaining options on the useForm call_

**File:** `src/pages/SubmissionsPage.tsx` — the useForm options, verbatim. Of the two buttons only the second is in the project; the first is the trap.

```tsx
} = useForm<SubmissionFormValues>({
  resolver: zodResolver(submissionSchema),
  mode: "onBlur",
  defaultValues: { courseCode: "", repoUrl: "" },
});

// two-click trap -- the first click only blurs the field:
<Button type="submit" disabled={!isValid}>Add submission</Button>

// what the project actually does:
<Button type="submit" disabled={addSubmission.isPending}>
```

**Notes on the marked lines**

- **[1] line 3 — mode decides when validation runs.** — The default is "onSubmit" -- nothing is checked until the button is clicked.
- **[2] line 4 — defaultValues gives every field a starting value** — , and it is what reset() returns the form to. Leave it out and the fields start as undefined, and reset() has nothing to return them to.
- **[3] line 8 — Do NOT disable the button on !isValid.** — With mode "onBlur", isValid only updates after a field is blurred, so a user who types and clicks straight at the button hits a dead one -- the click blurs the field, which enables the button, and they have to click AGAIN. Worse, a disabled button cannot be clicked at all, and clicking is what makes the error messages appear.
- **[4] line 11 — Disable it only while saving:** — disabled={addSubmission.isPending}. Clicking the button is what makes the error messages appear.

**Try it**

1. **Click into Repository URL, type github.com/me/repo, and DO NOT click anything — just press Tab.**
   - _The message appears the moment you LEAVE the box. That is mode "onBlur", and it is why a student is told before reaching the button._
2. **Look at the Add submission button while the form is still broken.**
   - _Never greyed out. Clicking it is what reveals the messages, so disabling it would hide the very thing they need._
3. **Fix the URL to https://github.com/me/repo, pick a course, and click Add submission.**
   - _Both fields go back to empty. reset() returns them to defaultValues — the only reason there is something to return them TO._

Link: [http://localhost:5173/submissions](http://localhost:5173/submissions)

> **Good to know**
> - **"onBlur" checks a field when you leave it**, which is what this form uses. Type a bad URL, press Tab, and the message appears before you reach the button.
> - **"onChange" checks on every keystroke**, so the error appears while you are still typing the first character.
> - Every second React Hook Form tutorial disables the button on !isValid. With mode "onChange" that is harmless -- isValid updates as you type. With "onBlur" it needs two clicks: the first click only blurs the field, and the second one submits. Tested in Chrome; clicking a disabled button does still blur whatever had focus.

---

## Step 24 — Shadcn UI

_What the next twelve steps add_

- What Shadcn UI is -- and why it is not an npm dependency
- The "@/" path alias, in tsconfig.json AND in vite.config.ts
- npx shadcn@latest init -- and the two questions it asks
- npx shadcn@latest add button input label
- Then the finished SubmissionsPage, top to bottom

> Files: components.json, src/lib/utils.ts, src/components/ui/

---

## Step 25 — What Is Shadcn UI?

_A code generator that writes component files into your own src folder_

**Context:** — Example only — two import styles side by side.

```text
// a normal library -- lives in node_modules, you cannot edit it:
import { Button } from "some-ui-kit";

// shadcn -- lives in YOUR src/, git tracks it, you can edit it:
import { Button } from "@/components/ui/button";
```

**Notes on the marked lines**

- **[1] line 4 — Which is why you can edit them.** — Change one line in button.tsx and every button in the app changes. With a normal component library that is a fork, a wrapper, or a CSS override war.
- **[2] line 5 — There is no import from a package name.** — You import from @/components/ui/button -- a path inside your own src. package.json never mentions a Button component at all.

> **Good to know**
> - **A command writes real .tsx files into src/components/ui/.** From the moment it finishes, those are your files, in your repo, in your git history.
> - **They are Tailwind underneath.** Every style is the utility classes you have read since Session 5 -- nothing new to learn to read them.
> - **The trade:** you own the code, so you own the updating. There is no npm update that improves your Button.
> - Shadcn calls this a registry rather than a package. The CLI downloads source files from ui.shadcn.com and writes them to your disk; after that the site is not involved. You own the code, so you also own the updating — there is no npm update for it.

---

## Step 26 — Installed vs Owned

_Where a component's source code actually lives, under each model_

|  | A normal component library | Shadcn UI |
| --- | --- | --- |
| Where the source sits | node_modules/some-ui-kit/ | src/components/ui/button.tsx |
| Listed in package.json | yes, as a dependency | no -- only the packages it imports are |
| In your git history | no | yes: committed, reviewed, in your diffs |
| After npm install | deleted and re-downloaded | untouched -- it is your code |
| To change a style | override its CSS, wrap it, or fork the package | edit the line |

> The CLI is a one-time code generator, not a dependency. Once the files land you could uninstall it and nothing breaks.

> **Good to know**
> - The mental model is different from every library you have installed so far. npm gives you a dependency you cannot edit; shadcn gives you a file you can.

---

## Step 27 — First, "@/" Has to Mean Something

_Three files, the same idea. TypeScript and Vite each need telling separately._

**File:** `tsconfig.json, tsconfig.app.json and vite.config.ts` — all three in the project root

```ts
// tsconfig.json -- add compilerOptions
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}

// tsconfig.app.json -- the same two lines, inside compilerOptions
"paths": { "@/*": ["./src/*"] },

// vite.config.ts
import path from "path";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // import.meta.dirname, not __dirname: this file is an ES module.
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
```

**Notes on the marked lines**

- **[1] line 9 — TypeScript's half** — paths is what lets the editor and tsc resolve "@/lib/utils" back to src/lib/utils. This is tsconfig.json.
- **[2] line 14 — And again, one file over** — tsconfig.app.json is the config that actually compiles src/. Put paths only in tsconfig.json and the editor is happy while npm run build fails -- so it goes in both.
- **[3] line 23 — Vite's half** — resolve.alias is what lets the browser actually fetch the file. Vite reads it only at startup -- add it while npm run dev is running and you must restart.

**Try it**

1. **VS Code only, no running app needed. Open src/pages/SubmissionsPage.tsx.**
2. **Ctrl+click (Cmd+click on Mac) the text "@/components/ui/button" in the import near the top.**
   - _The editor jumps straight into src/components/ui/button.tsx._
3. **Come back, then Ctrl+click "../api/client" a few lines down.**
   - _Same jump, ordinary relative path, no alias involved._

**What to notice**

That first jump is paths in tsconfig doing its job — and it proves the file is yours, sitting in src/, not buried in node_modules. Both import styles work in one file.

> **Good to know**
> - Two tools, two settings, the same meaning. TypeScript reads paths to type-check the import; Vite reads resolve.alias to actually find the file when the browser asks for it. Neither one reads the other's.

---

## Step 28 — Two Traps in the Official Instructions

_Both come from the shadcn docs, and both fail at npm run build, not npm run dev_

**File:** `tsconfig.json` — what the official docs tell you to write, and what TypeScript 6 says back

```json
// The official shadcn Vite guide tells you to write both of these:
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }

// On TypeScript 6, npm run build then says:
//   error TS5101: Option 'baseUrl' is deprecated

// So write only the second line. paths has worked on its own
// on its own for years -- with no baseUrl it resolves relative to
// the tsconfig file itself, which is what you want anyway.
"paths": { "@/*": ["./src/*"] }
```

**Notes on the marked lines**

- **[1] line 2 — The shadcn Vite page tells you to add "baseUrl": ".".** — On TypeScript 6, which is what this project uses, that is a build error: error TS5101, Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0.
- **[2] line 6 — Leave baseUrl out entirely.** — With no baseUrl, paths resolves relative to the tsconfig file it is written in, which is what you wanted anyway.

> **Good to know**
> - **The same page uses path.resolve(__dirname, "./src").** Vite 8 warns that __dirname is unsupported by its config loader, because vite.config.ts is an ES module.
> - **Use import.meta.dirname instead.** Same value, no warning.
> - **Why this happens:** documentation for a fast-moving tool ages quietly. Neither instruction was wrong when it was written.
> - Both of these were hit while building this project. Because they fail at build and not at dev, you can work all afternoon before finding out.

---

## Step 29 — npx shadcn@latest init

_Terminal 2 -- it asks two questions. Press Enter for both._

**Context:** — Terminal 2, in the project root

```bash
npx shadcn@latest init
```

```bash
> npx shadcn@latest init

? Select a component library >
  > Base UI (Recommended)      <- Enter
    React Aria
    Radix UI

? Which preset would you like to use? >
  > Nova - Lucide / Geist      <- Enter
    Vega   Maia   Lyra   Mira   Luma   Sera   Rhea   Custom

Installing dependencies.
  shadcn  class-variance-authority  tw-animate-css
  @base-ui/react  lucide-react

Success! Project initialization completed.
```

**Notes on the marked lines**

- **[1] line 4 — Question 1 of 2** — The component library. Base UI is the default and what this project uses -- press Enter. The -y flag does NOT skip this.
- **[2] line 9 — Question 2 of 2** — The preset. Nova is the default -- press Enter again. If the terminal looks frozen at init, it is waiting on one of these.

> **Good to know**
> - The -y flag does NOT skip these two prompts — it only skips the confirmation after them. If the terminal looks frozen at init, it is waiting on one of these answers.

---

## Step 30 — What init Wrote

_Two new files and one rewritten one._

**File:** `components.json (project root) and src/lib/utils.ts` — both created by init

```ts
itelect4-project/
  components.json          <- NEW: records the answers you gave
  src/
    lib/
      utils.ts             <- NEW: the cn() helper
    index.css              <- REWRITTEN: shadcn's theme added

// src/lib/utils.ts -- a NEW file, all 5 lines of it
// (verbatim from the CLI -- shadcn's own style has no semicolons)
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// cn() joins class strings AND resolves conflicts. Given
// "p-2" and "p-4", plain string joining keeps both and the
// browser applies whichever comes LATER in the generated CSS,
// which is not the order you wrote them. twMerge keeps "p-4".
// That is what lets you pass a className to a component and
// have it win, instead of fighting the one already inside.
```

**Notes on the marked lines**

- **[1] line 2 — components.json** — Records the answers you gave init. Commit it -- without it the shadcn CLI cannot add anything else later.
- **[2] line 13 — cn()** — Joins class strings AND resolves conflicts. Given "p-2" and "p-4", plain joining keeps both and the browser picks one at random; twMerge keeps the last. That is what lets a className you pass to a component win.

> **Good to know**
> - cn is short for classNames. Every shadcn component runs its own classes and yours through it, which is why a className you pass in overrides rather than fights.

---

## Step 31 — src/index.css After init

_Two layers: the values, and the names Tailwind can use._

**File:** `src/index.css` — rewritten by init

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";   /* the theme, from node_modules */

@custom-variant dark (&:where(.dark, .dark *));  /* Session 5's line */

@theme inline {                  /* names Tailwind can use */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary:    var(--primary);
  --color-border:     var(--border);
  --color-input:      var(--input);
  /* ...and the rest */
}

:root {                          /* light mode values */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary:    oklch(0.205 0 0);
}

.dark {                          /* the SAME names, new values */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary:    oklch(0.922 0 0);
}
```

**Notes on the marked lines**

- **[1] line 3 — The theme comes from a package** — Not a giant pasted stylesheet -- it resolves to node_modules/shadcn/dist/tailwind.css.
- **[2] line 7 — Names Tailwind can use** — --color-border: var(--border) is what makes the CLASS border-border exist. Without this block the build dies with "Cannot apply unknown utility class border-border".
- **[3] line 16 — Light mode values live here** — :root is a CSS selector meaning the <html> element, so anything declared here applies to the whole page. --background and --foreground are CSS custom properties: names you invent, prefixed with two dashes, that any rule can read back with var(--foreground). These are the light-mode values.
- **[4] line 22 — The SAME names, new values** — This is why text-foreground needs no dark: partner -- the class stays the same and the variable underneath it flips.

> **Good to know**
> - Two layers. :root and .dark hold the colour values; @theme inline turns each one into a Tailwind name, so --color-border is what makes the class border-border exist at all.

---

## Step 32 — Adding the Three Components

_Terminal 2 -- one command, three files written into your repo_

**Context:** — Terminal 2, in the project root

```bash
npx shadcn@latest add button input label
```

```bash
> npx shadcn@latest add button input label

Checking registry.
Installing dependencies.
Created 3 files:
  - src/components/ui/button.tsx
  - src/components/ui/input.tsx
  - src/components/ui/label.tsx

# git status now shows three NEW files you own.
# Commit them. They are your source code, not a dependency.

> git status --short
?? src/components/ui/button.tsx
?? src/components/ui/input.tsx
?? src/components/ui/label.tsx
?? src/lib/utils.ts
?? components.json
```

**Notes on the marked lines**

- **[1] line 14 — git sees new files** — Three .tsx files you own. Commit them -- they are your source code, not a dependency. A marker who clones your repo without them cannot build it.

---

## Step 33 — Inside button.tsx

_Shortened -- the real file is 60 lines._

**File:** `src/components/ui/button.tsx` — the real file, shortened from 60 lines

```tsx
// src/components/ui/button.tsx -- written by the CLI, owned by you
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground ...",
        outline: "border-border bg-background hover:bg-muted ...",
        ghost:   "hover:bg-muted hover:text-foreground ...",
        link:    "text-primary underline-offset-4 hover:underline",
        // ... secondary and destructive too
      },
      size: { default: "h-8 px-2.5", sm: "h-7 px-2.5",
              lg: "h-9 px-2.5", icon: "size-8" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({ className, variant = "default",
                 size = "default", ...props }:
  ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button"
    className={cn(buttonVariants({ variant, size, className }))}
    {...props} />;
}
```

**Notes on the marked lines**

- **[1] line 6 — cva builds the class string** — It takes a base string plus named options, and returns a function that joins the right ones together.
- **[2] line 11 — One variant, one class set** — Every value is written out in full. Tailwind's scanner only sees complete literal strings -- that is Session 5's rule, and it is why none of these is built by concatenation.
- **[3] line 20 — The fallback when a prop is missing** — Write <Button>Save</Button> with no variant and no size, and cva substitutes these two before building the class string. The next step shows that call site.

**Try it**

1. **Open src/components/ui/button.tsx with the browser visible beside it.**
2. **Find rounded-lg in the base string of buttonVariants.**
3. **Change it to rounded-none and save.**
   - _Every button in the app squares off instantly — Add submission, Log In, the Dark Mode toggle, all at once, because all of them come from this file._
4. **Press Ctrl+Z and save again.**
   - _Everything is back._

**What to notice**

This is the one demo today that needs an edit, and it is the only way to show what "you own the file" actually means.

> **Good to know**
> - Every idea in this file is one you already have. cva is a function that returns another function, VariantProps is a generic from Session 2, and the & is Session 1's intersection type.

---

## Step 34 — cva: One Component, Six Looks

_How button.tsx turns a variant prop into a class string_

**File:** `button.tsx` — Example only — how `button.tsx`'s variants get used from a page.

```tsx
<Button>Save</Button>                        // default + default

<Button variant="outline">   <Button size="sm">
<Button variant="ghost">     <Button size="lg">
<Button variant="link">      <Button size="icon">

<Button variant="outline" size="sm">         // combine them freely

<Button size="huge">    // error: not assignable to "sm" | "lg" | "icon"
```

**Notes on the marked lines**

- **[1] line 1 — With no props at all, cva falls back to defaultVariants** — -- the block you saw inside button.tsx on the previous slide. That is why <Button>Save</Button> compiles and still looks like a button.
- **[2] line 3 — variant and size are names this file invented.** — buttonVariants({ variant: "outline", size: "sm" }) returns the base classes plus those two sets, as one string.
- **[3] line 9 — VariantProps<typeof buttonVariants> generates the prop types.** — It reads the variants object in button.tsx and turns each group's keys into a union: size becomes "sm" | "lg" | "icon". Same move as z.infer, applied to classes instead of rules -- which is why size="huge" will not compile.

> **Good to know**
> - **cva stands for class-variance-authority.** It is a function that takes a base class string plus a set of named options, and returns a function that joins the right ones together.
> - **This is Session 5's CourseCard variant prop, done properly.** That was a ternary between two hard-coded strings; this scales to six without nesting ternaries.
> - Tailwind's scanner still only sees complete literal strings, from Session 5. cva works because every variant value is written out in full in the file — none of them is built by joining pieces together.

---

## Step 35 — The Form, in Shadcn

_The same field, before and after._

**File:** `src/pages/SubmissionsPage.tsx` — the repoUrl field. Session 7's version above, Session 8's below.

```tsx
// Session 7 -- every style written by hand, every time
<input value={repoUrl}
  onChange={(e) => setRepoUrl(e.target.value)}
  placeholder="github.com/you/your-repo"
  className="w-full rounded border border-gray-300 p-2" />

<button onClick={handleAdd}
  disabled={repoUrl === "" || addSubmission.isPending}
  className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold
    text-white transition hover:bg-blue-700 disabled:bg-gray-400">
  {addSubmission.isPending ? "Saving..." : "Add"}
</button>

// Session 8 -- the styles live in the component
<Label htmlFor="repoUrl" className="text-foreground">
  Repository URL</Label>
<Input id="repoUrl" {...register("repoUrl")}
  aria-invalid={errors.repoUrl ? true : undefined}
  placeholder="https://github.com/you/your-repo" />

<Button type="submit"
  disabled={addSubmission.isPending}
  className="justify-self-start">
  {addSubmission.isPending ? "Saving..." : "Add submission"}
</Button>
```

**Notes on the marked lines**

- **[1] line 5 — Session 7: styles written by hand** — Every element carried its own appearance, retyped on every page that needed one.
- **[2] line 17 — Session 8: the styles live in the component** — <Input> carries no className at all. Its border, height, padding and focus ring are written once inside src/components/ui/input.tsx, and every page that imports it gets them. The only className left anywhere on this form is justify-self-start on the Button -- and that is layout, not appearance. Where a thing sits is still the page's business.

> **Good to know**
> - The one className left on the Button is layout, not appearance. justify-self-start stops it stretching across the grid column — where it sits is still the page's business.

---

## Step 36 — Why This Matters When You Use AI

_A component you can name is a component nobody has to invent._

**File:** `src/components/ui/button.tsx` — Example only -- Dialog is not one of the three components this project installed. The Button on it is the real one from `src/components/ui/button.tsx`.

```tsx
// Example only -- Dialog is NOT installed in this project.
// To use it you would first run:  npx shadcn@latest add dialog

import { Dialog, DialogTrigger, DialogContent, DialogHeader,
         DialogTitle, DialogDescription, DialogFooter }
  from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger>Delete</DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete this submission?</DialogTitle>
      <DialogDescription>
        This cannot be undone.
      </DialogDescription>
    </DialogHeader>

    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Notes on the marked lines**

- **[1] line 2 — The trap: the JSX arrives before the component does** — An AI will write all of the above for a component you never added, because the code is correct -- it is just importing a file that does not exist. npm run build then stops with error TS2307: Cannot find module "@/components/ui/dialog". Run npx shadcn@latest add dialog FIRST, then ask for the markup. npm run dev will not always catch it; the build will.
- **[2] line 4 — Name the component instead of describing it** — The request that produces this code is five words: "use the shadcn Dialog component". The alternative is describing what you want -- a panel over a dark overlay, a title, a close button, keyboard escape -- and hoping the answer matches what you pictured. Dialog, DialogTrigger, DialogContent and DialogHeader are names you and the AI already share, because they came out of the same public registry that wrote your button.tsx.
- **[3] line 9 — The parts have fixed names, so the shape is not invented** — DialogTrigger is whatever the user clicks to open it; DialogContent is the panel that appears. Nobody chose those names for this project -- every codebase that ran the add command has the identical file with the identical parts. That is what makes the structure predictable enough to ask for by name.
- **[4] line 21 — variant is read, not remembered** — This is the same Button and the same variant prop from button.tsx two steps back. An AI working inside your repo can open that file and read the list -- default, outline, secondary, ghost, destructive, link -- instead of recalling what some library's buttons support. The answer is a file on disk, and a wrong guess would be visible in the diff.

**Try it**

1. **VS Code only. Open src/components/ui/button.tsx.**
2. **Scroll to the variant block inside buttonVariants.**
   - _Six names in plain text: default, outline, secondary, ghost, destructive, link._

**What to notice**

That list is the whole answer to "what variants does this button have" — for you, and for anything else reading your repo. It cannot go out of date the way documentation can, because it IS the implementation.

> **Good to know**
> - This is the same fact as "installed vs owned", seen from the other side. A library you install lives in node_modules, so anything helping you write code has to work from memory of that library's API. Shadcn components are files in src/, so the actual button.tsx can be read instead. That cuts both ways: the same access that lets an AI answer correctly also lets it edit button.tsx and change every button in the app at once. Read the diff before you accept it.

---

## Step 37 — The finished SubmissionsPage

_The whole file. Nine things on it are worth a click._

**File:** `src/pages/SubmissionsPage.tsx` — the whole file, exactly as it ships

```tsx
// src/pages/SubmissionsPage.tsx -- the finished file
import { useQuery, useMutation, useQueryClient }
  from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiSubmission, Course } from "../types/index";
import { submissionSchema } from "../schemas/submissionSchema";
import type { SubmissionFormValues } from "../schemas/submissionSchema";
import SubmissionBadge from "../components/SubmissionBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchSubmissions, createSubmission, fetchCourses }
  from "../api/client";
// The useState import is GONE -- useForm holds the values now

function SubmissionsPage() {
  const queryClient = useQueryClient();

  // useForm holds the values, runs the schema, and stores the errors.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    mode: "onBlur",
    defaultValues: { courseCode: "", repoUrl: "" },
  });

  // Same queryKey as CoursesPage, so this list comes out of the cache.
  const courses = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const { data, isPending, isError } = useQuery<ApiSubmission[]>({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });

  const addSubmission = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      reset();               // clears every field at once
    },
  });

  // handleSubmit only calls this after the schema passes.
  const onSubmit = (values: SubmissionFormValues): void => {
    addSubmission.mutate({
      studentId:   1,
      courseCode:  values.courseCode,
      repoUrl:     values.repoUrl,
      submittedAt: new Date().toISOString(),
    });
  };

  if (isPending) {
    return <div className="animate-pulse p-6">Loading submissions...</div>;
  }
  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Could not load submissions.
      </div>
    );
  }
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900
        dark:text-white">My Submissions</h2>

      <form onSubmit={handleSubmit(onSubmit)}
        className="mb-6 grid gap-4 rounded-lg border border-gray-200 p-4
          dark:border-gray-700">
        <div className="grid gap-1.5">
          <Label htmlFor="courseCode" className="text-foreground">
            Course</Label>
          <select id="courseCode" {...register("courseCode")}
            className="h-8 rounded-lg border border-input bg-background
              px-2.5 text-sm text-foreground">
            <option value="">Select a course...</option>
            {courses.data?.map((c) => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
          {errors.courseCode && (
            <p className="text-sm text-red-600">
              {errors.courseCode.message}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="repoUrl" className="text-foreground">
            Repository URL</Label>
          <Input id="repoUrl" {...register("repoUrl")}
            aria-invalid={errors.repoUrl ? true : undefined}
            placeholder="https://github.com/you/your-repo" />
          {errors.repoUrl && (
            <p className="text-sm text-red-600">
              {errors.repoUrl.message}</p>
          )}
        </div>

        {/* Never disabled on "invalid": clicking it is what shows the
            error messages. Only a save in flight disables it. */}
        <Button type="submit"
          disabled={addSubmission.isPending}
          className="justify-self-start">
          {addSubmission.isPending ? "Saving..." : "Add submission"}
        </Button>
      </form>

      {addSubmission.isError && (
        <p className="mb-4 text-sm text-red-700">
          {addSubmission.error.message}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.map((s) => (
          <SubmissionBadge key={s.id} submission={s}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Course: {s.courseCode}</p>
          </SubmissionBadge>
        ))}
      </div>
    </div>
  );
}

export default SubmissionsPage;

```

**Notes on the marked lines**

- **[1] line 4 — The new imports** — useState is GONE from this file -- useForm holds the values now. import type is erased at compile time; the schema is a value, so it needs a plain import.
- **[2] line 27 — The resolver** — One line of glue. Without it useForm would accept anything and the schema would sit in a file doing nothing.
- **[3] line 28 — When the rules run** — A field is checked when you leave it, so the message appears before you reach the button.
- **[4] line 33 — A free query** — Same queryKey as CoursesPage, so the dropdown fills from the cache the instant the page paints. A background refetch still runs -- staleTime is 0 by default -- but nobody ever sees an empty dropdown.
- **[5] line 47 — reset lives in onSuccess** — Not in onSubmit. The fields clear once the server has actually saved the row, so a failed POST leaves the typing intact.
- **[6] line 52 — Only runs if the schema passed** — It receives the values already validated and already typed. Inside it is addSubmission.mutate -- the same call as Session 7.
- **[7] line 76 — The gate** — handleSubmit runs the schema first and calls onSubmit only if everything passed. It also calls preventDefault() for you.
- **[8] line 80 — htmlFor and id are a pair** — This is what makes clicking the word "Course" focus the dropdown, and what a screen reader announces. Mismatch it and nothing errors.
- **[9] line 100 — aria-invalid, and why undefined and not false** — ? : is a ternary: one expression that picks between two values. errors.repoUrl exists only while that field is broken, so this yields true when it is and undefined when it is not. React DROPS an attribute whose value is undefined, so a valid field carries no aria-invalid at all -- whereas false would announce "valid" to a screen reader on every field. input.tsx styles its red border off this same attribute, so what is seen and what is announced cannot disagree.
- **[10] line 111 — Never disabled on "invalid"** — Clicking the button is what makes the error messages appear, so a disabled button hides the very thing the user needs. disabled={!isValid} with mode onBlur also needs two clicks: the first only blurs the field.

**Try it**

1. **Count the cards under the form first.**
2. **Pick ITELECT4 from the dropdown.**
3. **Type https://github.com/you/your-repo.**
4. **Click Add submission — and do NOT refresh the page.**
   - _One new card appears among the others with no reload, and both fields empty themselves._
5. **Now refresh it.**
   - _The card is still there. It really is in db.json._

**What to notice**

Three separate lines on this screen did that: onSubmit fired only because the schema passed, invalidateQueries marked the list stale so the mounted query refetched it, and reset() ran in onSuccess — after the save, not before.

Link: [http://localhost:5173/submissions](http://localhost:5173/submissions)

---

## Step 38 — Three Pairings That Have to Match

_Everything on the finished form is one of these three connections_

**File:** `src/pages/SubmissionsPage.tsx` — the same whole file, marked for three connections instead

```tsx
// src/pages/SubmissionsPage.tsx -- the finished file
import { useQuery, useMutation, useQueryClient }
  from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiSubmission, Course } from "../types/index";
import { submissionSchema } from "../schemas/submissionSchema";
import type { SubmissionFormValues } from "../schemas/submissionSchema";
import SubmissionBadge from "../components/SubmissionBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchSubmissions, createSubmission, fetchCourses }
  from "../api/client";
// The useState import is GONE -- useForm holds the values now

function SubmissionsPage() {
  const queryClient = useQueryClient();

  // useForm holds the values, runs the schema, and stores the errors.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    mode: "onBlur",
    defaultValues: { courseCode: "", repoUrl: "" },
  });

  // Same queryKey as CoursesPage, so this list comes out of the cache.
  const courses = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const { data, isPending, isError } = useQuery<ApiSubmission[]>({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });

  const addSubmission = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      reset();               // clears every field at once
    },
  });

  // handleSubmit only calls this after the schema passes.
  const onSubmit = (values: SubmissionFormValues): void => {
    addSubmission.mutate({
      studentId:   1,
      courseCode:  values.courseCode,
      repoUrl:     values.repoUrl,
      submittedAt: new Date().toISOString(),
    });
  };

  if (isPending) {
    return <div className="animate-pulse p-6">Loading submissions...</div>;
  }
  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Could not load submissions.
      </div>
    );
  }
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900
        dark:text-white">My Submissions</h2>

      <form onSubmit={handleSubmit(onSubmit)}
        className="mb-6 grid gap-4 rounded-lg border border-gray-200 p-4
          dark:border-gray-700">
        <div className="grid gap-1.5">
          <Label htmlFor="courseCode" className="text-foreground">
            Course</Label>
          <select id="courseCode" {...register("courseCode")}
            className="h-8 rounded-lg border border-input bg-background
              px-2.5 text-sm text-foreground">
            <option value="">Select a course...</option>
            {courses.data?.map((c) => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
          {errors.courseCode && (
            <p className="text-sm text-red-600">
              {errors.courseCode.message}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="repoUrl" className="text-foreground">
            Repository URL</Label>
          <Input id="repoUrl" {...register("repoUrl")}
            aria-invalid={errors.repoUrl ? true : undefined}
            placeholder="https://github.com/you/your-repo" />
          {errors.repoUrl && (
            <p className="text-sm text-red-600">
              {errors.repoUrl.message}</p>
          )}
        </div>

        {/* Never disabled on "invalid": clicking it is what shows the
            error messages. Only a save in flight disables it. */}
        <Button type="submit"
          disabled={addSubmission.isPending}
          className="justify-self-start">
          {addSubmission.isPending ? "Saving..." : "Add submission"}
        </Button>
      </form>

      {addSubmission.isError && (
        <p className="mb-4 text-sm text-red-700">
          {addSubmission.error.message}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.map((s) => (
          <SubmissionBadge key={s.id} submission={s}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Course: {s.courseCode}</p>
          </SubmissionBadge>
        ))}
      </div>
    </div>
  );
}

export default SubmissionsPage;

```

**Notes on the marked lines**

- **[1] line 47 — reset() lives in onSuccess, not in onSubmit** — -- so the fields clear once the server has saved the row, and a failed POST leaves the typing intact.
- **[2] line 80 — htmlFor="courseCode" plus id="courseCode".** — That pair is what makes clicking the word "Course" focus the dropdown, and it is what a screen reader reads out. Mismatch it and nothing errors.
- **[3] line 82 — The <select> is a plain HTML element.** — register() spreads onto it exactly like an input. Shadcn has a Select component; this form deliberately does not use it.
- **[4] line 99 — register("repoUrl") plus errors.repoUrl plus the schema key.** — All three are the same string. TypeScript catches a mismatch, but only because of the generic on useForm.
- **[5] line 110 — type="submit" plus <form onSubmit>.** — There is no onClick anywhere. The browser fires the form's onSubmit, and handleSubmit takes it from there.

> **Good to know**
> - A mismatched htmlFor breaks click-to-focus silently, and a screen reader then reads the wrong label. A mistyped field name is the only one of the three that the compiler catches for you.

---

## Step 39 — What Session 8 Did NOT Have to Change

_Four files the form never touches, and the one line of data that had to move_

**File:** `db.json` — the only data edit today, and the list of files that changed by nothing

```json
// db.json -- the only data edit today, and it is two characters short
// of nothing: the seeded rows now pass the schema they are read by.
-   "repoUrl": "github.com/juan/itelect4-project"
+   "repoUrl": "https://github.com/juan/itelect4-project"

// Unchanged, all day:
//   src/api/client.ts          every fetch still goes through it
//   src/types/index.ts         the three interfaces from Session 1
//   src/store/authStore.ts     knows nothing about forms
//   src/store/uiStore.ts       knows nothing about forms
```

**Notes on the marked lines**

- **[1] line 4 — db.json** — -- one edit. The two seeded repoUrls gained their https://, because the app's own new rule would have rejected its own sample data.
- **[2] line 6 — Both stores** — -- untouched. authStore and uiStore know nothing about forms, which is the point of keeping form values out of a store.

**Try it**

1. **Open db.json in VS Code.**
2. **Scroll to the bottom of the submissions array — the row you added when you ran the finished page is the last one.**
   - _It has exactly the keys onSubmit sent: studentId, courseCode, repoUrl, submittedAt, plus an id json-server generated._

**What to notice**

Nothing about React Hook Form or Zod reached the data. That is this step's point — the form was rebuilt today and the thing it writes did not change shape at all.

> **Good to know**
> - **src/api/client.ts**-- untouched. createSubmission still takes a NewSubmission and POSTs it. The form's job ends at mutate().
> - **src/types/index.ts**-- untouched. ApiSubmission and NewSubmission are still derived from Submission with Omit, exactly as in Session 7.
> - **Seed data that fails your own validation is a real bug class.** The list renders values the form would refuse to create, and nobody notices until someone edits an existing row.
> - A change that touches one file is a change you can reason about. Session 7's layering — client.ts owning every fetch, the types derived in one place — is what made that possible.

---

## Step 40 — Login and Courses Get Them Too

_The same three components, with no schema behind them._

**File:** `src/pages/LoginPage.tsx` — the form part, verbatim

```tsx
// src/pages/LoginPage.tsx -- the same three components, no schema
const [name, setName] = useState<string>("");

<Label htmlFor="name" className="text-foreground">Your name</Label>
<Input id="name" value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Juan dela Cruz" />

<Button onClick={handleLogin} disabled={name === ""} className="mt-3">
  Log In
</Button>
```

**Notes on the marked lines**

- **[1] line 2 — LoginPage uses all three components and no schema at all.** — No useForm, no Zod, no resolver -- just useState from Session 4, with Label, Input and Button around it.
- **[2] line 4 — CoursesPage's search box became <Input>** — , still driven by a plain onChange writing to the uiStore. register() is not required to use an Input.
- **[3] line 5 — Three pages now share one definition of what an input looks like.** — Change input.tsx once and all three follow.

**Try it**

1. **Click Logout in the header — it drops you back on /login.**
2. **Look at the Log In button before typing anything.**
   - _Greyed out. That is disabled={name === ""}, the same shape you saw on page 4._
3. **Type one single character into the name box.**
   - _It lights up on the first character._

**What to notice**

This page has no schema, no useForm and no resolver, and it is still correct — one field with one rule does not need any of today's machinery.

Link: [http://localhost:5173/login](http://localhost:5173/login)

> **Good to know**
> - **That is the point of showing it:** the UI components and the form library are independent. Either one works without the other.
> - **Only these three files lost their hand-written classes.** The cards, the nav bar and the layout are all still styled the Session 5 way, and that is fine.
> - LoginPage keeps useState on purpose. One field with one rule does not need a schema, and knowing when to stop is part of the skill.

---

## Step 41 — text-foreground: One Class, Both Themes

_Why the Labels do not need a dark: variant_

**File:** `src/index.css` — Class names from the pages, and the variables they resolve to in `src/index.css`

```css
// Session 5's way -- one class for light, a dark: partner for dark:
className="text-gray-900 dark:text-white"

// Shadcn's way -- one class, both themes:
className="text-foreground"

// because src/index.css defines the same NAME twice:
:root { --foreground: oklch(0.145 0 0); }   /* near-black */
.dark { --foreground: oklch(0.985 0 0); }   /* near-white */
```

**Notes on the marked lines**

- **[1] line 2 — Since Session 5 you have written pairs:** — text-gray-900 for light and dark:text-white for dark. Two classes, one idea, on every element.
- **[2] line 5 — So text-foreground needs no dark: partner.** — The class stays the same; the variable underneath it is what flips.
- **[3] line 8 — That is why the Labels carry className="text-foreground".** — Without it they inherit the browser's near-black and become unreadable in dark mode -- which is exactly what happened while building this.
- **[4] line 9 — Shadcn's colours are CSS variables.** — --foreground is one name whose value changes when the .dark class appears on an ancestor.

**Try it**

1. **Open /submissions with the form on screen.**
2. **Click Dark Mode in the header.**
   - _The labels stay readable and the button inverts._

**What to notice**

Nothing in the JSX has a dark: class on it. One .dark class on a wrapper div is the entire mechanism, and both styling systems react to that same class.

Link: [http://localhost:5173/submissions](http://localhost:5173/submissions)

> **Good to know**
> - **The rest of the app still uses the pairs, and that is fine.** Both styles compile to CSS. There is no need to convert Session 5's work.
> - The dark-mode toggle has not changed since Session 7. It still adds and removes one .dark class on a wrapper div, and both styling systems react to that same class.

---

## Step 42 — Your New File Tree

_Five new files, three changed._

**Context:** — The whole project, after today

```text
itelect4-project/
  components.json              <- NEW  (shadcn init)
  db.json                            (2 repoUrls gained https://)
  tsconfig.json                      (paths: "@/*")
  tsconfig.app.json                  (paths: "@/*")
  vite.config.ts                     (resolve.alias)
  src/
    api/client.ts                    (unchanged)
    components/
      CourseCard.tsx                 (unchanged)
      Layout.tsx                     (unchanged)
      ProtectedRoute.tsx             (unchanged)
      SubmissionBadge.tsx            (unchanged)
      UserCard.tsx                   (unchanged)
      ui/
        button.tsx             <- NEW  (shadcn add)
        input.tsx              <- NEW  (shadcn add)
        label.tsx              <- NEW  (shadcn add)
    lib/utils.ts               <- NEW  (shadcn init)
    schemas/
      submissionSchema.ts      <- NEW  (you wrote this one)
    pages/
      CoursesPage.tsx                (search box -> Input)
      LoginPage.tsx                  (Label + Input + Button)
      SubmissionsPage.tsx            (the form)
    index.css                        (shadcn theme)
    store/, hooks/, types/, data/    (all unchanged)
```

**Notes on the marked lines**

- **[1] line 2 — Written by the CLI** — Commit it. Without it the CLI cannot add another component later.
- **[2] line 16 — Yours, not a dependency** — src/components/ui/ is in your repo and your git history. A marker who clones without it cannot build.
- **[3] line 21 — The only one you designed** — The other four were generated -- but they are still committed, reviewed and diffed like anything else in src.

> **Good to know**
> - Only one of the five new files is yours to design. The other four were generated — but they are still committed, reviewed and diffed like anything else in src.

---

## Step 43 — What You Should See

_Both terminals running: npm run api AND npm run dev._

1. Click Add submission on the empty form. TWO messages appear, one under each field, and NOTHING is sent.[open](http://localhost:5173/submissions)
2. Type github.com/me/repo and press Tab. "That is not a valid URL -- include https://". A bare domain is not a URL.
3. Type https://gitlab.com/me/repo and press Tab. The message changes to "It has to be a GitHub URL." -- that is .refine().
4. Fix it to https://github.com/me/repo. The message disappears and the red border goes with it.
5. The Course dropdown is already full when the page paints. Visit /courses first -- same queryKey, so it came from cache.
6. Choose a course, submit. The card appears with no reload, and BOTH fields empty themselves -- one reset(), not two setters.
7. Open db.json. The row is there, with an id json-server made.
8. Toggle Dark Mode. The button inverts and the labels stay readable -- that is text-foreground, not a dark: variant.

> **Good to know**
> - If something here does not happen, check these first, in this order: the API is not running; the @/ alias is missing from one of the two tsconfigs; a schema key does not match a register() name.

---

## Step 44 — Traps to Remember

_Six ways today goes wrong. Two of them fail only at npm run build._

**Context:** — Example only — five things that fail quietly. None of these is in the project; that is the point.

```text
// 1. Silent -- the page reloads and your data is gone:
<form onSubmit={onSubmit}>                  // wrong
<form onSubmit={handleSubmit(onSubmit)}>    // right

// 2. Silent -- needs two clicks, and hides the messages meanwhile:
disabled={!isValid}

// 3. Loud, but only at build time:
"baseUrl": ".",        // error TS5101 -- npm run dev never mentions it

// 4. Renders as text on the page instead of disappearing:
{/* a comment among JSX children -- // does not work here */}
```

**Notes on the marked lines**

- **[1] line 2 — onSubmit={onSubmit} without handleSubmit.** — The page reloads, nothing validates, and it looks almost right. The wrapper is what runs the rules and stops the reload.
- **[2] line 6 — disabled={!isValid} with mode: "onBlur".** — isValid only updates after a field is blurred, so the button needs TWO clicks: the first one lands on a disabled button, which does nothing except blur the field -- and that is what finally enables it. Worse, while it is disabled it cannot be clicked at all, and clicking is what makes the error messages appear.
- **[3] line 9 — "baseUrl": "." in tsconfig.** — error TS5101 on TypeScript 6. npm run dev never mentions it; npm run build refuses.
- **[4] line 12 — A // comment among JSX children.** — React renders it as text. Inside JSX it must be {/* like this */} -- the same trap as Session 6's <Route>.

> **Good to know**
> - **A register() name that is not a schema key.** TypeScript catches this only because you passed the generic to useForm. Leave <SubmissionFormValues> off and any string compiles.
> - **The @/ alias in only one of the two files.** Add it to tsconfig alone and the editor is happy while the browser 500s. Add it to Vite alone and the reverse.
> - Traps 1, 2 and 5 produce no error message at all. The first move for any of them is npm run build, which type-checks every file — npm run dev does not.

---

## Step 45 — Closing GT3

_What the last steps cover_

- GT3 Part 3 -- what to build in your own app today
- The branch and pull request, for the third and last time
- git tag gt3 -- the submission point for the whole module
- What all three parts add up to, in one checklist
- The backend homework, and the MA1 oral defense

> Submission: GitHub repo link + tag gt3, submitted today

---

## Step 46 — GT3 - Part 3 of 3

_Graded Task | Individual | Tagged and SUBMITTED Today_

> **What to do:**
> **DO THESE FIRST, in this order -- the form imports what they create:**
> - 1. npm install react-hook-form zod @hookform/resolvers
> - 2. Add the @/ alias to tsconfig.json, tsconfig.app.json AND vite.config.ts
> - 3. npx shadcn@latest init, then npx shadcn@latest add button input label
> **THEN build the form:**
> - 4. Create src/schemas/ and write a schema for ONE form in your app
> - 5. At least 3 rules across its fields, and at least one .refine()
> - 6. Derive the form's TypeScript type with z.infer -- do not hand-write it
> - 7. Replace that form's useState with a single useForm call and a resolver
> - 8. Every field renders its own error message from formState.errors
> - 9. Submitting an invalid form must send NO request -- check the Network tab
> - 10. The submit path still ends in the useMutation you wrote in Session 7
> - 11. Use Button, Input and Label on at least two different pages
> - 12. npm run build must finish with ZERO TypeScript errors, then tag gt3

> **Reminders**
> - YOUR form, YOUR entities. A lost-and-found app validates an item; an RSVP app validates a guest. Not a repoUrl.
> - A .refine() rule has to be about your data. "must contain github.com" makes no sense for a phone number.
> - COMMIT src/components/ui/ and src/lib/utils.ts. They are your source, not node_modules -- a marker who clones your repo needs them.
> - components.json too. Without it the shadcn CLI cannot add anything else later.
> - Run npx shadcn@latest add at home, not on school WiFi -- it downloads from ui.shadcn.com every single time.
> - This is the LAST part of GT3. Tag gt3 today -- Module 3 closes with this submission.
> - Be ready to explain any line if you are spot-checked. That is 10 of the 100 points.

> **Good to know**
> - The mark most often lost here is an uncommitted src/components/ui/. A .gitignore that ignores lib/ or ui/ from an old template will drop them silently, and the clone will not compile.

---

## Step 47 — Branch, Commit, Pull Request -- and Tag

_Third and last time. One new step at the end: the tag that submits GT3._

**Context:** — Terminal 2, in the project root

```bash
git checkout -b gt3-part3
```

```bash
git tag gt3
```

```bash
git push origin gt3
```

```bash
> git checkout -b gt3-part3
> npm run build
> git add .
> git status     # confirm src/components/ui/ is staged
> git commit -m "GT3 Part 3: React Hook Form, Zod, Shadcn UI"
> git push -u origin gt3-part3

// On github.com: Compare & pull request
//   base: main  <-  compare: gt3-part3   ...then Merge it yourself

> git checkout main      # ONLY after the pull request is merged
> git pull
> git tag gt3
> git push origin gt3
```

**Notes on the marked lines**

- **[1] line 4 — The mark most often lost** — An uncommitted src/components/ui/. Read what git status prints -- do not assume.
- **[2] line 11 — Order matters** — Tagging before the merge points gt3 at the branch's last commit instead of merged main. git tag -d gt3 and git push origin :gt3 undo a wrong tag.

> **Before you open the pull request, check:**
> 1. npm run build finishes with zero TypeScript errors -- npm run dev does not type-check
> 2. Submitting an invalid form sends nothing: open DevTools, Network tab, and confirm it stays empty
> 3. src/components/ui/, src/lib/utils.ts and components.json are all staged -- run git status and read it
> 4. You are on the gt3-part3 branch, not on main, before you commit
> 5. The pull request is MERGED before you tag. The tag has to point at main.

> **Good to know**
> - Tagging before the merge points gt3 at the branch's last commit instead of merged main. git tag -d gt3 and git push origin :gt3 remove a wrong tag, then tag again.

---

## Step 48 — GT3: All Three Parts, One Submission

_What the tag gt3 has to contain_

**Context:** — The GT3 mark sheet, and two commands for Terminal 2.

```text
// What gets marked, out of 100:
//   40   it works
//   25   types and structure
//   15   commits and pull requests
//   10   README
//   10   you can explain it

// Before you submit, clone your own repo into a NEW folder and run it
// there. It is the only way to catch a file you never committed.
> git clone <your-repo-url> check-gt3 && cd check-gt3
> npm install && npm run build
```

> **Good to know**
> - **Part 1, Session 6 -- routing.** At least 4 routes, a Layout with <Outlet />, typed useParams and useNavigate, and a ProtectedRoute reading a Zustand auth token.
> - **Part 2, Session 7 -- state and data.** persist on the auth store, a second UI store, db.json served by json-server, at least 2 typed useQuery calls and 1 useMutation that invalidates its query.
> - **Part 3, today -- forms and components.** A Zod schema with 3+ rules and a .refine(), z.infer for the type, React Hook Form with a resolver, visible error messages, and Shadcn on two pages.
> - **Three merged pull requests**, from branches gt3-part1, gt3-part2 and gt3-part3. Commit history is 15 of the 100 points.
> - **Submit: the repo link and the tag gt3.** Nothing else. The marker clones it, runs npm install, npm run api and npm run build.
> - Cloning your own repo into a different folder is the single most effective check you can run. It catches uncommitted files, which is the most common reason a working project scores zero for functionality.

---

## Step 49 — MA1 Oral Defense, and the Backend Homework

_Assigned Today | Individual | Two separate things, do not confuse them_

> **The REST API homework:**
> **Create a SECOND repo: itelect4-backend**
> **Node.js + Express + MongoDB + JWT, written in TypeScript**
> **Session 9 -- Aug 29, next Saturday -- is a crash course on exactly this stack**
> **At least one resource with full CRUD, and JWT-protected routes**
> **Deploy it to Vercel and confirm the live URL responds**
> **Due before Session 10 (Sep 12), so it is built AFTER the crash course**
> **Never commit .env -- the MongoDB string and JWT secret go in Vercel's environment variables**

> **MA1 -- oral defense, Sep 1-7**
> - MA1 is NOT the backend. It is a one-on-one online interview with me about itelect4-project.
> - You present your own work from Sessions 1 to 8, then I ask questions for 5 minutes.
> - Every question comes from YOUR repo -- your entities, your components, your types. There is no shared answer key.
> - Four things, 25 points each: the app runs and builds, you can find your own code, you can explain why it works, and you answer clearly.
> - Whatever is pushed to GitHub the night before is what we discuss.
> - Share your ENTIRE screen. Dev server running, app open, editor open, terminal ready, before you join.

> **Good to know**
> - These are two different things, and confusing them is the expensive mistake. MA1 is an interview about the frontend you already have -- itelect4-project, Sessions 1 to 8 -- and there is nothing new to build for it. itelect4-backend is separate homework, and Session 9 next Saturday teaches the whole stack before it is due.

---

## Step 50 — Module 3 Complete

_Three sessions, one frontend -- what changed since Aug 8_

- **Session 6 gave it pages.** One file with everything became six routed pages, a shared Layout, and a login gate reading a store.
- **Session 7 gave it real data.** The mock data written in Session 1 left the codebase. Every list now comes over HTTP, cached, and one form can write back.
- **Session 8 gave it rules and a look.** The write path can now refuse bad input and say why, and three pages share one definition of what a button is.
- **What has NOT changed since Session 1:** the User, Course and Submission interfaces in src/types/index.ts. Everything built since has been layered on those three shapes.
- **Next: the backend.** Module 4 stops adding to this repo and starts a second one -- and later in the module the two connect.

> GT3 is submitted today. Module 3 is closed.

> **Good to know**
> - The types written on the first Saturday are still the foundation eight sessions later. That is what type-first design buys you.

---

## Step 51 — Before Next Session

_Session 9 | Aug 29, 2026 | Node + Express + MongoDB + JWT, in TypeScript_

> **For next session, you need to:**
> - Tag gt3 and submit the repo link today -- Module 3 closes now
> - Create the itelect4-backend repo. Empty is fine -- Session 9 fills it
> - Install Node.js and Postman, and create a free MongoDB Atlas account
> - Book your MA1 slot as soon as the booking link is posted. One slot per student, Sep 1-7
> - Re-open your own src/types/index.ts from Session 1. MA1 starts there

> **Next session topics:**
> - Express in TypeScript -- typed request and response handlers
> - MongoDB Atlas, and schemas that match the interfaces you already wrote
> - JWT: signing a token, and middleware that protects a route
> - Full CRUD on one resource, tested in Postman
> - GT4 Part 1 -- on itelect4-backend, not this repo

> **Good to know**
> - The calendar changed, so check the two dates rather than trusting the habit. Aug 29 is NOT a break any more -- it is Session 9, next Saturday. Midterms moved to Sep 1 to 7, which is when the MA1 defenses run, so there is no class on Sep 5. Session 10 is Sep 12.

---

## Step 52 — Session 8 complete

_ITELECT4 | Session 8 End | Module 3 Complete_

> **Note**
> - GT3 is tagged and submitted today. Module 3 is closed.
> - Next: Session 9 — NEXT Saturday, Aug 29. Node, Express, MongoDB and JWT, in TypeScript.
> - MA1 is your oral defense, Sep 1–7. No class Sep 5.

---
