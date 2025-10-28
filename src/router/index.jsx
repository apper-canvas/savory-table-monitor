import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

const Home = lazy(() => import("@/components/pages/Home"));
const Menu = lazy(() => import("@/components/pages/Menu"));
const Reservations = lazy(() => import("@/components/pages/Reservations"));
const Reviews = lazy(() => import("@/components/pages/Reviews"));
const Contact = lazy(() => import("@/components/pages/Contact"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Home />
      </Suspense>
    )
  },
  {
    path: "menu",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Menu />
      </Suspense>
    )
  },
  {
    path: "reservations",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Reservations />
      </Suspense>
    )
  },
  {
    path: "reviews",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Reviews />
      </Suspense>
    )
  },
  {
    path: "contact",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Contact />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);