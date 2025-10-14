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