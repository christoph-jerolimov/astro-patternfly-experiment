import { Card, CardBody, CardTitle, Progress, Stack, StackItem } from '@patternfly/react-core';

const resources = [
  { id: 'cpu', label: 'CPU', value: 62 },
  { id: 'memory', label: 'Memory', value: 78 },
  { id: 'storage', label: 'Storage', value: 91 },
  { id: 'network', label: 'Network', value: 34 },
];

/** Thresholds that turn a bar amber and then red. */
function variantFor(value: number) {
  if (value >= 90) return 'danger' as const;
  if (value >= 75) return 'warning' as const;
  return undefined;
}

export default function DashboardUtilization() {
  return (
    <Card id="utilization-card" isFullHeight>
      <CardTitle>Cluster utilization</CardTitle>
      <CardBody>
        <Stack hasGutter>
          {resources.map((resource) => (
            <StackItem key={resource.id}>
              <Progress
                value={resource.value}
                title={resource.label}
                variant={variantFor(resource.value)}
                aria-label={`${resource.label} utilization`}
              />
            </StackItem>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}
