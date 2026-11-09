/* eslint-disable react-refresh/only-export-components */

import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

import { RouteLoadingFallback } from "@/components/common/RouteLoadingFallback";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { UserLayout } from "@/components/layouts/UserLayout";
import { useAuthStore } from "@/stores/auth.store";
import { RootLayout } from "@/routes/__root";

const ProductsPage = lazy(() =>
  import("@/features/products/pages/ProductsPage").then((module) => ({
    default: module.ProductsPage,
  })),
);
const ProductDetailPage = lazy(() =>
  import("@/features/products/pages/ProductDetailPage").then((module) => ({
    default: module.ProductDetailPage,
  })),
);
const CartPage = lazy(() =>
  import("@/features/cart/pages/CartPage").then((module) => ({
    default: module.CartPage,
  })),
);
const CheckoutPage = lazy(() =>
  import("@/features/checkout/pages/CheckoutPage").then((module) => ({
    default: module.CheckoutPage,
  })),
);
const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);
const VerifyOtpPage = lazy(() =>
  import("@/features/auth/pages/VerifyOtpPage").then((module) => ({
    default: module.VerifyOtpPage,
  })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage").then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import("@/features/auth/pages/ResetPasswordPage").then((module) => ({
    default: module.ResetPasswordPage,
  })),
);
const ChangePasswordPage = lazy(() =>
  import("@/features/auth/pages/ChangePasswordPage").then((module) => ({
    default: module.ChangePasswordPage,
  })),
);
const ProfilePage = lazy(() =>
  import("@/routes/_authenticated/profile").then((module) => ({
    default: module.ProfilePage,
  })),
);
const OrdersPage = lazy(() =>
  import("@/features/orders/pages/OrdersPage").then((module) => ({
    default: module.OrdersPage,
  })),
);
const PaymentsPage = lazy(() =>
  import("@/features/payments/pages/PaymentsPage").then((module) => ({
    default: module.PaymentsPage,
  })),
);
const AdminDashboardPage = lazy(() =>
  import("@/features/admin/pages/AdminDashboardPage").then((module) => ({
    default: module.AdminDashboardPage,
  })),
);
const AdminProductsPage = lazy(() =>
  import("@/features/admin/pages/AdminProductsPage").then((module) => ({
    default: module.AdminProductsPage,
  })),
);
const AdminOrdersPage = lazy(() =>
  import("@/features/admin/pages/AdminOrdersPage").then((module) => ({
    default: module.AdminOrdersPage,
  })),
);
const AdminPaymentsPage = lazy(() =>
  import("@/features/admin/pages/AdminPaymentsPage").then((module) => ({
    default: module.AdminPaymentsPage,
  })),
);
const AdminUsersPage = lazy(() =>
  import("@/features/admin/pages/AdminUsersPage").then((module) => ({
    default: module.AdminUsersPage,
  })),
);

function renderLazy(Component: React.LazyExoticComponent<ComponentType>) {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Component />
    </Suspense>
  );
}

function GuestOnly({ children }: { children: ReactNode }) {
  const { user, accessToken, refreshToken } = useAuthStore();
  return user && accessToken && refreshToken ? (
    <Navigate to="/" replace />
  ) : (
    children
  );
}

function RequireOtpContext({
  children,
  requireVerified = false,
}: {
  children: ReactNode;
  requireVerified?: boolean;
}) {
  const { otpEmail, verifiedOtp } = useAuthStore();

  if (!otpEmail || (requireVerified && !verifiedOtp)) {
    return (
      <Navigate to={requireVerified ? "/forgot-password" : "/login"} replace />
    );
  }

  return children;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, accessToken, refreshToken } = useAuthStore();
  const location = useLocation();

  if (!user || !accessToken || !refreshToken) {
    const redirectTo = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
        replace
      />
    );
  }

  return children;
}

function RequireAdmin() {
  const { user, accessToken, refreshToken } = useAuthStore();
  if (!user || !accessToken || !refreshToken) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <AdminLayout />;
}

function ProductDetailRoute() {
  const { productId = "" } = useParams();
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <ProductDetailPage productId={productId} />
    </Suspense>
  );
}

function OrderDetailPage() {
  const { orderId } = useParams();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
      <p className="mt-2 text-gray-600">Order ID: {orderId}</p>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: renderLazy(ProductsPage) },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <GuestOnly>{renderLazy(LoginPage)}</GuestOnly>,
          },
          {
            path: "register",
            element: <GuestOnly>{renderLazy(RegisterPage)}</GuestOnly>,
          },
          {
            path: "verify-otp",
            element: (
              <GuestOnly>
                <RequireOtpContext>
                  {renderLazy(VerifyOtpPage)}
                </RequireOtpContext>
              </GuestOnly>
            ),
          },
          {
            path: "forgot-password",
            element: <GuestOnly>{renderLazy(ForgotPasswordPage)}</GuestOnly>,
          },
          {
            path: "reset-password",
            element: (
              <GuestOnly>
                <RequireOtpContext requireVerified>
                  {renderLazy(ResetPasswordPage)}
                </RequireOtpContext>
              </GuestOnly>
            ),
          },
          {
            path: "change-password",
            element: (
              <RequireAuth>{renderLazy(ChangePasswordPage)}</RequireAuth>
            ),
          },
        ],
      },
      { path: "products", element: renderLazy(ProductsPage) },
      { path: "products/:productId", element: <ProductDetailRoute /> },
      { path: "cart", element: renderLazy(CartPage) },
      {
        path: "checkout",
        element: <RequireAuth>{renderLazy(CheckoutPage)}</RequireAuth>,
      },
      {
        element: (
          <RequireAuth>
            <UserLayout />
          </RequireAuth>
        ),
        children: [
          { path: "profile", element: renderLazy(ProfilePage) },
          { path: "orders", element: renderLazy(OrdersPage) },
          { path: "orders/:orderId", element: <OrderDetailPage /> },
          { path: "payments", element: renderLazy(PaymentsPage) },
        ],
      },
      {
        path: "admin",
        element: <RequireAdmin />,
        children: [
          { index: true, element: renderLazy(AdminDashboardPage) },
          { path: "products", element: renderLazy(AdminProductsPage) },
          { path: "orders", element: renderLazy(AdminOrdersPage) },
          { path: "payments", element: renderLazy(AdminPaymentsPage) },
          { path: "users", element: renderLazy(AdminUsersPage) },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
