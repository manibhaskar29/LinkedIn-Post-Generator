I implemented JWT-based authentication using FastAPI. Passwords are hashed with bcrypt, tokens are generated using python-jose, and protected routes use dependency injection to validate access tokens.


The backend is built using FastAPI with a modular structure.
Authentication is handled using JWT tokens.
MongoDB Atlas is used as the database, accessed asynchronously using Motor.
Passwords are hashed using bcrypt.
Routes are separated by responsibility, such as auth, posts, and users.

The biggest challenge was stabilizing MongoDB Atlas connectivity and authentication libraries across Python versions. I learned how driver compatibility and TLS affect production systems


I implemented a background job system using FastAPI and APScheduler.
Scheduled posts are stored in MongoDB with explicit job states.
A background worker periodically polls the database, executes due jobs, updates their lifecycle state, and handles failures with retries.
Since state is persisted, the system safely recovers after server restarts.

I used MongoDB aggregation pipelines to compute analytics like most-used tone and average sentiment directly at the database level to avoid unnecessary backend processing.

## I used MongoDB aggregation pipelines to compute analytics like most-used tone and average sentiment directly at the database level to avoid unnecessary backend processing.

I implemented a secure analytics dashboard using MongoDB aggregation pipelines, scoped per user, to provide meaningful insights like engagement and content trends.

Initially I passed inputs as query params, but I refactored the API to use Pydantic request bodies. This improved validation, security, and scalability.

## Errors That Were Fixed: 
JWT Authentication Error (KeyError: 'sub')
Changed payload["sub"] to payload["email"] in auth/dependencies.py to match the token creation logic
ObjectId Serialization Error (ValueError: 'ObjectId' object is not iterable)
Converted MongoDB's ObjectId to string before returning in the response
Converted datetime to ISO format string for proper JSON serialization


# How did you build analytics?

I used MongoDB aggregation pipelines to compute user-specific metrics like post count, average engagement, and most-used tone without loading all data into the backend.

# Why aggregation instead of Python loops?

Aggregation runs inside MongoDB, which is faster and scalable, especially for large datasets.

Tier 1 Frontend Fixes - Technical Explanation for Interviews
Overview
This document explains all the fixes applied to make your LinkedIn Post Generator production-ready. Each section includes:

What was broken and why
How we fixed it
Key concepts you should understand
Interview talking points
Fix #1: Import Errors in App.jsx
What Was Broken
// BEFORE - Line 9 in App.jsx
import ProtectedRoute from ''  // ❌ Empty import path
The ProtectedRoute component was being used in the JSX but had an incomplete import statement.

How We Fixed It
// AFTER
import ProtectedRoute from './components/ProtectedRoute';
import ScheduledPosts from './pages/ScheduledPosts';
import Posts from './pages/Posts';
Why It Matters
ES6 Modules: JavaScript uses import/export to organize code into modules
Relative Paths: ./ means "current directory", ../ means "go up one level"
Build Errors: Missing imports cause compile-time errors that prevent the app from running
Interview Talking Points
"I fixed critical import errors that were preventing the application from compiling. The ProtectedRoute component had an empty import path, which would cause a build failure. This demonstrates understanding of ES6 module system and proper component organization in React."

Common Interview Question: "How does JavaScript module system work?"

Answer: "JavaScript uses ES6 modules with import and export statements. Components are exported from one file and imported into another using relative or absolute paths. React requires all dependencies to be explicitly imported before use."
Fix #2: Implemented ProtectedRoute for All Pages
What Was Broken
The Dashboard page wasn't wrapped with ProtectedRoute, meaning unauthorized users could access it directly.

How We Fixed It
// BEFORE
<Route path="/dashboard" element={<Dashboard />} />
// AFTER
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
Why It Matters
Security: Prevents unauthorized access to protected pages
Higher-Order Components (HOC): ProtectedRoute is a component that wraps other components
Conditional Rendering: Checks authentication state before rendering children
How ProtectedRoute Works
export default function ProtectedRoute({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
}
Logic Flow:

ProtectedRoute receives children (the wrapped component)
Uses 
useAuth()
 hook to check if user has a valid token
If token exists → render children (Dashboard, etc.)
If no token → redirect to /login
Interview Talking Points
"I implemented route-level authentication using a ProtectedRoute component. This is a common pattern in React applications for securing routes. It uses the concept of Higher-Order Components to wrap protected pages and check authentication state before rendering."

Common Interview Question: "How do you secure routes in React?"

Answer: "I use a ProtectedRoute component that checks authentication state (JWT token in our case) and conditionally renders the protected component or redirects to login. This implements security at the routing level using React Router's Navigate component."
Fix #3: Implemented Loader Component
What Was Broken
Loader.jsx
 was completely empty, but being imported by other components.

How We Fixed It
export default function Loader({ size = "md", message = "Loading..." }) {
    const sizeClasses = {
        sm: "w-6 h-6 border-2",
        md: "w-12 h-12 border-4",
        lg: "w-16 h-16 border-4",
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <div
                className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
            ></div>
            {message && (
                <p className="text-gray-600 text-sm font-medium">{message}</p>
            )}
        </div>
    );
}
Key Concepts
1. Props with Default Values
{ size = "md", message = "Loading..." }
ES6 destructuring with default parameters
If no props passed, defaults to "md" and "Loading..."
2. Dynamic Styling with Tailwind
className={`${sizeClasses[size]} ...`}
Template literals for dynamic class names
Object lookup for different sizes
3. CSS Animation
animate-spin
Uses Tailwind's built-in CSS animation
Creates rotating spinner effect
Interview Talking Points
"I created a reusable Loader component with customizable props for size and message. This demonstrates component reusability and proper API design. The component uses Tailwind CSS for styling and supports different sizes through a props-based configuration object."

Common Interview Question: "How do you create reusable components?"

Answer: "I design components with a clear API using props, provide sensible defaults, and make them flexible enough to handle different use cases. For example, my Loader component accepts size and message props, allowing it to be used across different parts of the application while maintaining consistency."
Fix #4: Implemented Posts.jsx (Post History Page)
What Was Broken
The file was completely empty - no component implementation.

How We Fixed It
Created a full-featured page with:

Data Fetching: Uses useEffect to fetch posts on mount
Loading States: Shows Loader while fetching
Error Handling: Displays error messages
Empty States: Shows helpful UI when no posts exist
Post Display: Beautiful card layout with metadata
Key Concepts
1. useEffect for Data Fetching
useEffect(() => {
    async function fetchPosts() {
        try {
            const data = await apiRequest("/posts/all", "GET", null, token);
            setPosts(data);
        } catch (err) {
            setError(err.message || "Failed to load posts");
        } finally {
            setLoading(false);
        }
    }
    fetchPosts();
}, [token]);
Why this pattern?

useEffect runs after component mounts
async/await for cleaner asynchronous code
try/catch/finally for proper error handling
Dependency array [token] - re-runs if token changes
2. Conditional Rendering
if (loading) return <Loader />;
if (error) return <ErrorDisplay />;
if (posts.length === 0) return <EmptyState />;
return <PostsList />;
Pattern: Early returns for different states

3. State Management
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
Three separate state variables for:

Data (posts)
Loading state
Error state
Interview Talking Points
"I built a complete Posts history page with proper data fetching, loading states, error handling, and empty states. This demonstrates understanding of React component lifecycle, async data fetching with useEffect, and comprehensive UX design. The page handles all edge cases - loading, errors, and empty states."

Common Interview Question: "How do you handle side effects in React?"

Answer: "I use the useEffect hook for side effects like data fetching. The effect runs after component mount, fetches data asynchronously, and updates state based on the result. I always include proper error handling with try/catch and loading states for better UX."
Fix #5: Fixed API Endpoint Mismatch
What Was Broken
Frontend called: /posts/scheduled
Backend had: /ai/scheduled

This mismatch caused 404 errors.

How We Fixed It
Frontend Change (
ScheduledPosts.jsx
):

// BEFORE
const data = await apiRequest("/posts/scheduled", "GET", null, token);
// AFTER
const data = await apiRequest("/ai/scheduled", "GET", null, token);
Backend Fix (
ai/routes.py
):

# BEFORE
@router.get("scheduled")  # ❌ Missing forward slash
# AFTER
@router.get("/scheduled")  # ✅ Correct
Plus added missing import:

from db.mongodb import db
Why It Matters
API Contract: Frontend and backend must agree on endpoints
FastAPI Routing: Routes need forward slash
Debugging Skills: Finding and fixing endpoint mismatches is common
Interview Talking Points
"I debugged and fixed an API endpoint mismatch between frontend and backend. The frontend was calling /posts/scheduled while the backend had /ai/scheduled. I also fixed a missing database import and incorrect route definition in FastAPI. This demonstrates full-stack debugging skills and understanding of REST API conventions."

Common Interview Question: "How do you debug API issues?"

Answer: "I check browser DevTools Network tab to see the actual request/response, verify endpoint paths match between frontend and backend, check HTTP status codes, and examine error messages. In this case, I found a 404 error indicating the endpoint didn't exist, traced it to both a path mismatch and a routing bug in FastAPI."
Fix #6: Added Missing Backend Endpoint (/posts/all)
What Was Missing
Frontend needed to fetch all posts, but backend had no endpoint for it.

How We Fixed It
@router.get("/all")
async def get_all_posts(user: str = Depends(get_current_user)):
    posts = await database.posts.find(
        {"user_email": user}
    ).sort("created_at", -1).to list(100)
    
    for post in posts:
        post["_id"] = str(post["_id"])
        post["created_at"] = post["created_at"].isoformat()
    
    return posts
Key Backend Concepts
1. FastAPI Dependency Injection
user: str = Depends(get_current_user)
Depends() injects the current user's email
Gets extracted from JWT token
Automatic authentication
2. MongoDB Async Operations
await database.posts.find({...}).sort(...).to_list(100)
find() - query documents
sort("created_at", -1) - newest first
to_list(100) - limit to 100 results
await - asynchronous operation
3. Data Serialization
post["_id"] = str(post["_id"])
post["created_at"] = post["created_at"].isoformat()
MongoDB _id is ObjectId - convert to string for JSON
datetime objects → ISO format strings
Interview Talking Points
"I implemented a new REST API endpoint GET /posts/all to fetch user posts. It uses FastAPI's dependency injection for authentication, MongoDB's async operations for data retrieval, and proper data serialization to convert MongoDB-specific types to JSON-compatible formats. The endpoint is secured, paginated (100 limit), and sorted by creation date."

Common Interview Question: "How do you design RESTful APIs?"

Answer: "I follow REST conventions: GET for fetching, POST for creating, PUT for updating, DELETE for removing. I use proper HTTP status codes, implement authentication via JWT tokens with dependency injection, and ensure responses are properly serialized to JSON. I also consider pagination, sorting, and filtering from the start."
Fix #7: Fixed JSX Structure in ScheduledPosts.jsx
What Was Broken
During edits, the JSX structure got corrupted with misplaced closing tags.

How We Fixed It
Properly structured the component with:

Correct nesting of divs
StatusBadge moved outside main component
Proper indentation
Key React Concepts
Component Composition
// Main component
export default function ScheduledPosts() {
    return (
        <div>
            <Navbar />
            <StatusBadge status={post.status} />
        </div>
    );
}
// Helper component in same file
function StatusBadge({ status }) {
    return <span>{status}</span>;
}
Interview Talking Points
"I debugged and fixed corrupted JSX structure with mismatched tags. This demonstrates attention to detail and understanding of JSX's strict XML-like syntax where every opening tag must have a matching closing tag."

Summary: What You Learned
Technical Skills Demonstrated
✅ React Fundamentals: Components, props, state, hooks
✅ React Router: Routing, navigation, protected routes
✅ Async Operations: useEffect, data fetching, error handling
✅ State Management: useState, useContext (AuthContext)
✅ Backend Development: FastAPI, MongoDB, REST APIs
✅ Full-Stack Debugging: Finding and fixing frontend-backend mismatches
✅ Security: JWT authentication, route protection
✅ UX Design: Loading states, error states, empty states
Interview Story Template
"In this project, I fixed multiple critical issues in a LinkedIn Post Generator application. I implemented secure routing with ProtectedRoute components, created reusable UI components like a Loader, built a complete post history page with proper data fetching and error handling, and debugged API endpoint mismatches between frontend and backend. I also added missing backend endpoints with proper authentication and data serialization. This demonstrates my full-stack capabilities and attention to UX."

Common Interview Questions & Answers
Q1: "Walk me through how authentication works in your app"
Answer: "We use JWT token-based authentication. When a user logs in, the backend validates credentials and returns a JWT token containing the user's email. The frontend stores this in localStorage and includes it in the Authorization header for all API requests. We have an AuthContext that manages the token state globally, and a ProtectedRoute component that checks if a valid token exists before rendering protected pages. If no token, users are redirected to login."

Q2: "How do you handle errors in your React app?"
Answer: "I use a multi-layered approach:

Try/catch blocks for async operations
Error state in components to display error messages
Finally blocks to ensure loading states are always turned off
Conditional rendering to show user-friendly error messages
On the backend, FastAPI provides automatic HTTP error responses
For example, in my Posts component, if the fetch fails, I catch the error, store it in state, and display a red error banner to the user."

Q3: "Explain your approach to code reusability"
Answer: "I create small, focused components with clear props APIs. For example, my Loader component accepts size and message props with sensible defaults, making it reusable across the app. I also use composition - the ProtectedRoute component wraps other components, demonstrating the HOC pattern. On the backend, I use dependency injection for authentication, avoiding code duplication across endpoints."

Q4: "How would you optimize this application?"
Answer: "Several approaches:

Code splitting: Lazy load pages with React.lazy()
Caching: Implement React Query for automatic cache management
Pagination: Instead of loading 100 posts, implement infinite scroll or pagination
Database indexing: Add indexes on user_email and created_at fields
CDN: Serve static assets from CDN
Memoization: Use useMemo/useCallback for expensive computations
Image optimization: If posts have images, use next/image or similar"
Next Steps - What to Study
To deepen your understanding for interviews:

React Hooks Deep Dive

useEffect cleanup functions
useCallback and useMemo
Custom hooks
Authentication Flows

OAuth 2.0
Refresh tokens
Session management
API Design

REST vs GraphQL
API versioning
Rate limiting
Database Optimization

Indexing strategies
Query optimization
Aggregation pipelines
Testing

Unit tests with Jest
Integration tests with pytest
E2E tests with Playwright
Good luck with your interviews! 🚀