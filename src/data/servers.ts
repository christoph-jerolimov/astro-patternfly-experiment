/** Sample fleet shared by the list view and the detail view. */
export interface Server {
  id: string;
  name: string;
  status: 'running' | 'degraded' | 'stopped';
  region: string;
  cpu: number;
  memory: number;
  updated: string;
}

export const servers: Server[] = [
  {
    id: 'api-gateway',
    name: 'api-gateway',
    status: 'running',
    region: 'eu-central-1',
    cpu: 41,
    memory: 63,
    updated: '4 minutes ago',
  },
  {
    id: 'auth-service',
    name: 'auth-service',
    status: 'running',
    region: 'eu-central-1',
    cpu: 22,
    memory: 48,
    updated: '11 minutes ago',
  },
  {
    id: 'worker-7c9f',
    name: 'worker-7c9f',
    status: 'degraded',
    region: 'us-east-1',
    cpu: 88,
    memory: 91,
    updated: '1 hour ago',
  },
  {
    id: 'reporting-db',
    name: 'reporting-db',
    status: 'degraded',
    region: 'us-east-1',
    cpu: 74,
    memory: 82,
    updated: '6 hours ago',
  },
  {
    id: 'batch-runner',
    name: 'batch-runner',
    status: 'stopped',
    region: 'ap-south-1',
    cpu: 0,
    memory: 0,
    updated: '2 days ago',
  },
  {
    id: 'edge-cache',
    name: 'edge-cache',
    status: 'running',
    region: 'ap-south-1',
    cpu: 35,
    memory: 40,
    updated: '18 minutes ago',
  },
  {
    id: 'search-index',
    name: 'search-index',
    status: 'running',
    region: 'eu-west-2',
    cpu: 57,
    memory: 66,
    updated: '32 minutes ago',
  },
  {
    id: 'media-encoder',
    name: 'media-encoder',
    status: 'stopped',
    region: 'eu-west-2',
    cpu: 0,
    memory: 0,
    updated: '5 days ago',
  },
];

export const statusMeta = {
  running: { label: 'Running', color: 'green' },
  degraded: { label: 'Degraded', color: 'orange' },
  stopped: { label: 'Stopped', color: 'grey' },
} as const;
