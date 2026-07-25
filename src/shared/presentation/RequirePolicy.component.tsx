import { route } from 'preact-router'
import { useEffect } from 'preact/hooks'
import type { ComponentType } from 'preact'
import type { PolicyName } from '../policies/domain/value-objects/PolicyName.valueObject'
import type { RouteProps } from './RouteProps'
import { useAuthState } from './useAuthState.hook'
import { usePolicy } from './usePolicy.hook'

interface RequirePolicyProps extends RouteProps {
  policy: PolicyName
  component: ComponentType<RouteProps>
}

export function RequirePolicy({ policy, component: Component, ...routeProps }: RequirePolicyProps) {
  const { auth } = useAuthState()
  const allowed = usePolicy(policy)

  useEffect(() => {
    if (auth.status !== 'loading' && !allowed) {
      route('/login', true)
    }
  }, [auth.status, allowed])

  if (auth.status === 'loading' || !allowed) {
    return null
  }

  return <Component {...routeProps} />
}
