import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Content,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  Gallery,
} from '@patternfly/react-core';
import BanIcon from '@patternfly/react-icons/dist/esm/icons/ban-icon';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import LockIcon from '@patternfly/react-icons/dist/esm/icons/lock-icon';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';

interface Example {
  id: string;
  /** What the reader has actually hit. */
  when: string;
  title: string;
  body: string;
  icon: React.ComponentType;
  status?: 'danger' | 'warning' | 'info';
  primary?: string;
  secondary?: string;
}

const examples: Example[] = [
  {
    id: 'no-data',
    when: 'Nothing created yet',
    title: 'No servers yet',
    body: 'Create a server to see it listed here. Nothing has been provisioned in this project.',
    icon: PlusCircleIcon,
    primary: 'Create server',
    secondary: 'Import from a template',
  },
  {
    id: 'no-results',
    when: 'Filters match nothing',
    title: 'No results found',
    body: 'No server matches the current search and filters. Clearing them shows all servers again.',
    icon: SearchIcon,
    secondary: 'Clear all filters',
  },
  {
    id: 'no-permission',
    when: 'Not allowed to look',
    title: 'You do not have access',
    body: 'Viewing servers in this project needs the Operator role. Ask an administrator to grant it.',
    icon: LockIcon,
    status: 'warning',
    secondary: 'Request access',
  },
  {
    id: 'error',
    when: 'The request failed',
    title: 'Unable to load servers',
    body: 'The request to the API timed out. This is usually temporary and retrying often works.',
    icon: ExclamationCircleIcon,
    status: 'danger',
    primary: 'Retry',
  },
  {
    id: 'disabled',
    when: 'Feature is off',
    title: 'Servers are disabled',
    body: 'This project was created without compute. Enabling it adds servers to the navigation.',
    icon: BanIcon,
    primary: 'Enable compute',
  },
  {
    id: 'loading-done',
    when: 'Everything is cleared',
    title: 'Nothing needs attention',
    body: 'No alerts, no failed jobs and no pending approvals. This is the state you want to be in.',
    icon: CubesIcon,
    status: 'info',
  },
];

/**
 * The states a list can be in when it has nothing to show.
 *
 * They are worth distinguishing: "no results" is the reader's filters, "no
 * data" is an empty account, and "no access" is neither. Showing the same
 * message for all three sends people looking for the wrong problem.
 */
export default function EmptyStateGallery() {
  return (
    <Gallery hasGutter minWidths={{ default: '340px' }}>
      {examples.map((example) => (
        <Card key={example.id} id={example.id} isFullHeight>
          <CardTitle>
            <Content component="small">{example.when}</Content>
          </CardTitle>
          <CardBody>
            <EmptyState
              headingLevel="h3"
              icon={example.icon}
              titleText={example.title}
              status={example.status}
              variant="sm"
            >
              <EmptyStateBody>{example.body}</EmptyStateBody>
              {(example.primary || example.secondary) && (
                <EmptyStateFooter>
                  {example.primary && (
                    <EmptyStateActions>
                      <Button variant="primary">{example.primary}</Button>
                    </EmptyStateActions>
                  )}
                  {example.secondary && (
                    <EmptyStateActions>
                      <Button variant="link">{example.secondary}</Button>
                    </EmptyStateActions>
                  )}
                </EmptyStateFooter>
              )}
            </EmptyState>
          </CardBody>
        </Card>
      ))}
    </Gallery>
  );
}
