/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from 'react-router'
import { createElement, lazy, Suspense } from 'react'
import App from '../app/App.jsx'
import LoadingPage from '../common/LoadingPage.jsx'
import ErrorPage from '../common/ErrorPage.jsx'

const HomePage = lazy(() => import('../features/home/HomePage.jsx'))
const SignInPage = lazy(() => import('../features/auth/pages/SignInPage.jsx'))
const SignUpPage = lazy(() => import('../features/auth/pages/SignUpPage.jsx'))
const SignOutPage = lazy(() => import('../features/auth/pages/SignOutPage.jsx'))
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage.jsx'))
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage.jsx'))
const VerifyEmailPage = lazy(() => import('../features/auth/pages/VerifyEmailPage.jsx'))

const withSuspense = (LazyComponent) => (
  <Suspense fallback={<LoadingPage />}>
    {createElement(LazyComponent)}
  </Suspense>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <LoadingPage />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'auth/sign-in', element: withSuspense(SignInPage) },
      { path: 'auth/sign-up', element: withSuspense(SignUpPage) },
      { path: 'auth/sign-out', element: withSuspense(SignOutPage) },
      { path: 'auth/forgot-password', element: withSuspense(ForgotPasswordPage) },
      { path: 'auth/reset-password', element: withSuspense(ResetPasswordPage) },
      { path: 'auth/verify-email', element: withSuspense(VerifyEmailPage) },
      { path: 'app', element: <div>Dashboard Content Coming Soon...</div> },
    ],
  },
])

export default router
