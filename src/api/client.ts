// Every call to the API lives in this one file.
import type {
  Course,
  ApiSubmission,
  NewSubmission,
  AuthReply,
  ApiUser,
} from "../types/index";
import useAuthStore from "../store/authStore";

// Vite replaces this at BUILD time, so the value in .env when
// `npm run build` ran is baked into the bundle. Changing it on Vercel
// needs a new deploy before it means anything.
export const API_URL = import.meta.env.VITE_API_URL;

// A sentence now beats every call going to "undefined/api/courses".
if (!API_URL) {
  throw new Error(
    "VITE_API_URL is missing. Copy .env.example to .env, fill it in, " +
      "and restart npm run dev.",
  );
}

// Every call goes through here: the host, the JSON header, the token
// when there is one, and the API's own message when it refuses.
async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  // getState(), not the hook -- this is not a component, and it only
  // needs whatever the token is at the moment of the call.
  const token = useAuthStore.getState().token;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // The header requireAuth reads: Bearer, one space, then the token.
      // No token means no header at all, which the public routes want.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    // Every refusal from the API has a message field. The catch is for a
    // reply with no JSON body at all, like a 502 while Vercel is starting.
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return res.json();
}

// ---- courses: public. No token is sent, and none is needed.

export function fetchCourses(): Promise<Course[]> {
  return request<Course[]>("/api/courses");
}

// The API has a route for one course, so there is no array to unwrap.
// A bad code answers 404 and request() throws the API's own message.
export function fetchCourseByCode(code: string): Promise<Course> {
  return request<Course>(`/api/courses/${code}`);
}

// ---- submissions: private. request() adds the token automatically.

export function fetchSubmissions(): Promise<ApiSubmission[]> {
  return request<ApiSubmission[]>("/api/submissions");
}

export function createSubmission(
  newSubmission: NewSubmission,
): Promise<ApiSubmission> {
  return request<ApiSubmission>("/api/submissions", {
    method: "POST",
    body: JSON.stringify(newSubmission),
  });
}

// ---- auth: the two routes that make a session exist

export function registerUser(body: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiUser> {
  return request<ApiUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginUser(body: {
  email: string;
  password: string;
}): Promise<AuthReply> {
  return request<AuthReply>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
