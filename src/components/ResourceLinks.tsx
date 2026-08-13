import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Content,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';

const resources = [
  { label: 'Astro docs', href: 'https://docs.astro.build' },
  { label: 'PatternFly docs', href: 'https://www.patternfly.org' },
  { label: 'PatternFly React', href: 'https://github.com/patternfly/patternfly-react' },
];

/**
 * Closing section with links to the docs of both projects. Static — no client
 * directive needed.
 */
export default function ResourceLinks() {
  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size="lg">
          Resources
        </Title>
      </StackItem>
      <StackItem>
        <Content component="p">Where to go next.</Content>
      </StackItem>
      <StackItem>
        <Card isCompact>
          <CardBody>
            <Content component="p">
              Start the dev server with <code>npm run dev</code> and edit{' '}
              <code>src/pages/index.astro</code> to change this page.
            </Content>
          </CardBody>
          <CardFooter>
            {resources.map((resource) => (
              <Button
                key={resource.href}
                variant="link"
                component="a"
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                icon={<ExternalLinkAltIcon />}
                iconPosition="end"
              >
                {resource.label}
              </Button>
            ))}
          </CardFooter>
        </Card>
      </StackItem>
    </Stack>
  );
}
