import { Link as RouterLink } from 'preact-router/match';
import type { FunctionalComponent, JSX } from 'preact';

export const Link = RouterLink as unknown as FunctionalComponent<
  JSX.IntrinsicElements['a'] & { activeClassName?: string }
>;
