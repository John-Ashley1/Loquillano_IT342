# API Data Contract — Activity 1

Base URL (default): `http://localhost:8080`
Frontend origin (default): `http://localhost:5173`

All endpoints below are implemented in `UserController` and consumed by the
React frontend's `src/api/authApi.js`.

---

## 1. POST `/api/register`

**Purpose:** Create a new user account.

**Request headers:**
| Header | Value |
|---|---|
| Content-Type | `application/json` |

**Request body:**
| Field | Type | Required | Notes |
|---|---|---|---|
| `username` | string | yes | Must be unique |
| `password` | string | yes | Stored as plain text by the current backend implementation |

**Sample request:**
```json
POST /api/register
Content-Type: application/json

{
  "username": "jdoe",
  "password": "mypassword123"
}
```

**Success response — `200 OK`:**
Returns the saved user object, including generated `id`.
```json
{
  "id": 4,
  "username": "jdoe",
  "password": "mypassword123"
}
```
> Note: the frontend strips the `password` field from this response before
> storing or displaying anything — it is never persisted or shown to the user.

**Error response — `400 Bad Request`:**
Returned as a plain text body (not JSON) when the username is already taken.
```
Username already exists
```

**Other possible errors:**
| Status | Cause |
|---|---|
| `0` / network error | Backend not running, or CORS not enabled for `http://localhost:5173` |
| `500 Internal Server Error` | Unexpected server/database error |

---

## 2. POST `/api/login`

**Purpose:** Authenticate an existing user.

**Request headers:**
| Header | Value |
|---|---|
| Content-Type | `application/json` |

**Request body:**
| Field | Type | Required | Notes |
|---|---|---|---|
| `username` | string | yes | |
| `password` | string | yes | Compared as plain text against the stored value |

**Sample request:**
```json
POST /api/login
Content-Type: application/json

{
  "username": "jdoe",
  "password": "mypassword123"
}
```

**Success response — `200 OK`:**
Returns the matched user object.
```json
{
  "id": 4,
  "username": "jdoe",
  "password": "mypassword123"
}
```
> As with registration, the frontend discards the `password` field
> immediately and only keeps `{ id, username }` in `sessionStorage` to
> represent the logged-in session.

**Error response — `401 Unauthorized`:**
Plain text body, returned for both "user not found" and "wrong password"
(the backend intentionally doesn't distinguish the two, to avoid leaking
which usernames exist).
```
Invalid username or password
```

**Other possible errors:**
| Status | Cause |
|---|---|
| `0` / network error | Backend not running, or CORS not enabled |
| `500 Internal Server Error` | Unexpected server/database error |

---

## 3. GET `/api/user/{id}`

**Purpose:** Fetch a single user by ID. (Not called directly by the current
UI flow, but available and wired up in `authApi.js` via `getUserById` for
future use, e.g. a "refresh profile" feature.)

**Request headers:** none required.

**Path parameter:**
| Param | Type | Required |
|---|---|---|
| `id` | number | yes |

**Sample request:**
```
GET /api/user/4
```

**Success response — `200 OK`:**
```json
{
  "id": 4,
  "username": "jdoe",
  "password": "mypassword123"
}
```

**Error response — `404 Not Found`:**
Empty body, status code only.

---

## Frontend → Backend request flow summary

| User action | Frontend page | API call | On success | On failure |
|---|---|---|---|---|
| Submit registration form | `Register.jsx` | `POST /api/register` | Shows success alert, redirects to `/login` after 1.5s | Shows red alert with backend's plain-text error message |
| Submit login form | `Login.jsx` | `POST /api/login` | Saves `{id, username}` to `sessionStorage`, redirects to `/dashboard` | Shows red alert with backend's plain-text error message |
| Visit `/dashboard` without a session | `Dashboard.jsx` | — | — | Redirected to `/login` |
| Click "Log out" | `Navbar.jsx` | — | Clears session, redirects to `/login` | — |

## Client-side validation (before any request is sent)

**Registration:**
- Username required, minimum 3 characters
- Password required, minimum 6 characters
- Confirm-password must match password

**Login:**
- Username required
- Password required

These are enforced in React state before `authApi.js` is called, so invalid
submissions never reach the network.
