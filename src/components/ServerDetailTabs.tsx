import { useState } from 'react';
import {
  Card,
  CardBody,
  CodeBlock,
  CodeBlockCode,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Label,
  Progress,
  Stack,
  StackItem,
  Tab,
  Tabs,
  TabTitleText,
  Timestamp,
} from '@patternfly/react-core';

import { statusMeta, type Server } from '../data/servers';

const logLines = `2026-08-13T18:42:11Z  INFO  readiness probe failed (attempt 1/3)
2026-08-13T18:42:14Z  WARN  restarting container after failed probe
2026-08-13T18:42:31Z  INFO  container started, pid 1
2026-08-13T18:43:02Z  INFO  readiness probe succeeded
2026-08-13T18:51:47Z  WARN  memory usage above 90% of limit`;

export interface ServerDetailTabsProps {
  server: Server;
}

/**
 * The tabbed half of the detail view.
 *
 * Only this part is an island: the breadcrumb and page header above it never
 * change, so they stay static HTML.
 */
export default function ServerDetailTabs({ server }: ServerDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<string | number>('overview');

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(_event, key) => setActiveTab(key)}
      aria-label="Server detail"
      role="region"
    >
      <Tab eventKey="overview" title={<TabTitleText>Overview</TabTitleText>}>
        <Card isPlain>
          <CardBody>
            <DescriptionList isHorizontal columnModifier={{ lg: '2Col' }}>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>{server.name}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>
                  <Label isCompact color={statusMeta[server.status].color}>
                    {statusMeta[server.status].label}
                  </Label>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Region</DescriptionListTerm>
                <DescriptionListDescription>{server.region}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Image</DescriptionListTerm>
                <DescriptionListDescription>
                  ghcr.io/example/{server.name}:1.8.3
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Created</DescriptionListTerm>
                <DescriptionListDescription>
                  {/* A fixed date keeps the committed screenshots stable. */}
                  <Timestamp date={new Date('2026-06-02T09:14:00Z')} />
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Last updated</DescriptionListTerm>
                <DescriptionListDescription>{server.updated}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </Tab>

      <Tab eventKey="metrics" title={<TabTitleText>Metrics</TabTitleText>}>
        <Card isPlain>
          <CardBody>
            <Grid hasGutter>
              <GridItem lg={6}>
                <Stack hasGutter>
                  <StackItem>
                    <Progress
                      value={server.cpu}
                      title="CPU"
                      variant={
                        server.cpu >= 90 ? 'danger' : server.cpu >= 75 ? 'warning' : undefined
                      }
                      aria-label="CPU utilization"
                    />
                  </StackItem>
                  <StackItem>
                    <Progress
                      value={server.memory}
                      title="Memory"
                      variant={
                        server.memory >= 90 ? 'danger' : server.memory >= 75 ? 'warning' : undefined
                      }
                      aria-label="Memory utilization"
                    />
                  </StackItem>
                </Stack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </Tab>

      <Tab eventKey="logs" title={<TabTitleText>Logs</TabTitleText>}>
        <Card isPlain>
          <CardBody>
            <CodeBlock>
              <CodeBlockCode>{logLines}</CodeBlockCode>
            </CodeBlock>
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  );
}
