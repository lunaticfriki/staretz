import type { JSX } from 'preact';
import { Suspense } from 'preact/compat';

interface LazyLoadProps {
  component: JSX.Element;
  fallback?: JSX.Element;
}

export function LazyLoad({
  component,
  fallback = <div>Loading...</div>,
}: LazyLoadProps): JSX.Element {
  return <Suspense fallback={fallback}>{component}</Suspense>;
}
