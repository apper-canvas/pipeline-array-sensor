import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import Layout from "@/components/organisms/Layout"

// Lazy load all page components
const Dashboard = lazy(() => import("@/components/pages/Dashboard"))
const Contacts = lazy(() => import("@/components/pages/Contacts"))
const ContactForm = lazy(() => import("@/components/pages/ContactForm"))
const Pipeline = lazy(() => import("@/components/pages/Pipeline"))
const DealForm = lazy(() => import("@/components/pages/DealForm"))
const Activities = lazy(() => import("@/components/pages/Activities"))
const ActivityForm = lazy(() => import("@/components/pages/ActivityForm"))
const Tasks = lazy(() => import("@/components/pages/Tasks"))
const TaskForm = lazy(() => import("@/components/pages/TaskForm"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "contacts",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Contacts />
      </Suspense>
    ),
  },
  {
    path: "contacts/new",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <ContactForm />
      </Suspense>
    ),
  },
  {
    path: "contacts/:id/edit",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <ContactForm />
      </Suspense>
    ),
  },
{
path: "pipeline",
element: <Suspense fallback={<div>Loading.....</div>}><Pipeline /></Suspense>
},
{
path: "deals/new",
element: <Suspense fallback={<div>Loading.....</div>}><DealForm /></Suspense>
},
{
path: "deals/edit/:id",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Pipeline />
      </Suspense>
    ),
  },
{
    path: "activities",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Activities />
      </Suspense>
    ),
  },
  {
    path: "activities/new",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <ActivityForm />
      </Suspense>
    ),
  },
{
    path: "tasks",
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>}>
        <Tasks />
      </Suspense>
    ),
  },
  {
    path: "tasks/new",
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>}>
        <TaskForm />
      </Suspense>
    ),
  },
  {
    path: "tasks/edit/:id",
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>}>
        <TaskForm />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    ),
  },
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes],
  },
]

export const router = createBrowserRouter(routes)