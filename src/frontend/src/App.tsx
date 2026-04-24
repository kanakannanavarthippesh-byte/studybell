import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Outlet,
  RouterProvider,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

interface RouterContext {
  isAuthenticated: boolean;
}
import { Layout } from "./components/Layout";
import { SilentModeProvider } from "./context/SilentModeContext";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RemindersPageComponent from "./pages/RemindersPage";

// ---------------------------------------------------------------------------
// Placeholder pages (replaced by page tasks)
// ---------------------------------------------------------------------------
function RemindersPage() {
  return <RemindersPageComponent />;
}

// ---------------------------------------------------------------------------
// Auth-aware wrapper for protected routes
// ---------------------------------------------------------------------------
function ProtectedLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayout,
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/dashboard",
  component: DashboardPage,
});

const remindersRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/reminders",
  component: RemindersPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedLayout.addChildren([dashboardRoute, remindersRoute]),
]);

// ---------------------------------------------------------------------------
// App with auth context passed to router
// ---------------------------------------------------------------------------
export default function App() {
  const { isAuthenticated } = useInternetIdentity();

  const router = createRouter({
    routeTree,
    context: { isAuthenticated },
  });

  return (
    <SilentModeProvider>
      <RouterProvider router={router} context={{ isAuthenticated }} />
    </SilentModeProvider>
  );
}
