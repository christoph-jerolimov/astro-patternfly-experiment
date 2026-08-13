import {
  Card,
  CardBody,
  CardTitle,
  Content,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Icon,
  Label,
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';

type Status = 'succeeded' | 'degraded' | 'failed';

const events: { id: string; title: string; detail: string; when: string; status: Status }[] = [
  {
    id: 'deploy-214',
    title: 'Deploy #214',
    detail: 'astro-patternfly-experiment to production',
    when: '4 minutes ago',
    status: 'succeeded',
  },
  {
    id: 'scale-api',
    title: 'Autoscaled api-gateway',
    detail: '3 replicas to 5 replicas',
    when: '22 minutes ago',
    status: 'succeeded',
  },
  {
    id: 'probe-worker',
    title: 'Readiness probe flapping',
    detail: 'worker-7c9f recovered after 2 restarts',
    when: '1 hour ago',
    status: 'degraded',
  },
  {
    id: 'job-nightly',
    title: 'Nightly export failed',
    detail: 'timed out talking to the reporting database',
    when: '6 hours ago',
    status: 'failed',
  },
];

const statusMeta = {
  succeeded: { color: 'green', icon: CheckCircleIcon, label: 'Succeeded' },
  degraded: { color: 'orange', icon: ExclamationTriangleIcon, label: 'Degraded' },
  failed: { color: 'red', icon: ExclamationCircleIcon, label: 'Failed' },
} as const;

export default function DashboardActivity() {
  return (
    <Card id="activity-card" isFullHeight>
      <CardTitle>Recent activity</CardTitle>
      <CardBody>
        <DataList aria-label="Recent activity" isCompact>
          {events.map((event) => {
            const meta = statusMeta[event.status];
            const StatusIcon = meta.icon;

            return (
              <DataListItem key={event.id}>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="summary">
                        <Content component="p">{event.title}</Content>
                        <Content component="small">{event.detail}</Content>
                      </DataListCell>,
                      <DataListCell key="when" isFilled={false}>
                        <Content component="small">{event.when}</Content>
                      </DataListCell>,
                      <DataListCell key="status" isFilled={false} alignRight>
                        <Label
                          isCompact
                          color={meta.color}
                          icon={
                            <Icon>
                              <StatusIcon />
                            </Icon>
                          }
                        >
                          {meta.label}
                        </Label>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            );
          })}
        </DataList>
      </CardBody>
    </Card>
  );
}
