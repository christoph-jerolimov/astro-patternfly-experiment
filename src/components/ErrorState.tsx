import {
  Button,
  Content,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import LockIcon from '@patternfly/react-icons/dist/esm/icons/lock-icon';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';

import { withBase } from '../site';

export type ErrorCode = '404' | '403' | '500';

const errors = {
  '404': {
    icon: SearchIcon,
    status: undefined,
    title: 'Page not found',
    body: 'The address is wrong, or the page has moved. Nothing was broken by asking for it.',
    primary: 'Back to the overview',
  },
  '403': {
    icon: LockIcon,
    status: 'warning' as const,
    title: 'You do not have access',
    body: 'This page needs a role your account does not have. An administrator can grant it.',
    primary: 'Back to the overview',
  },
  '500': {
    icon: ExclamationCircleIcon,
    status: 'danger' as const,
    title: 'Something went wrong',
    body: 'The server failed to handle the request. The problem has been logged, and retrying often works.',
    primary: 'Back to the overview',
  },
};

export interface ErrorStateProps {
  code: ErrorCode;
}

/**
 * The shared body of the error pages.
 *
 * The code is shown as well as the sentence, because "page not found" alone
 * leaves people guessing whether they typed the address wrong or the server is
 * broken.
 */
export default function ErrorState({ code }: ErrorStateProps) {
  const error = errors[code];

  return (
    <EmptyState
      headingLevel="h1"
      icon={error.icon}
      titleText={error.title}
      status={error.status}
      variant="lg"
    >
      <EmptyStateBody>
        <Content component="p">{error.body}</Content>
        <Content component="small">Error {code}</Content>
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="primary" component="a" href={withBase('/')}>
            {error.primary}
          </Button>
        </EmptyStateActions>
        <EmptyStateActions>
          <Button variant="link" component="a" href={withBase('/servers/')}>
            Go to servers
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
}
