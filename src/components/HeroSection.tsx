import { Content, Label, LabelGroup, Stack, StackItem, Title } from '@patternfly/react-core';
import RocketIcon from '@patternfly/react-icons/dist/esm/icons/rocket-icon';

/**
 * Intro block of the default page. Static — no client directive needed.
 */
export default function HeroSection() {
  return (
    <Stack hasGutter>
      <StackItem>
        <LabelGroup>
          <Label color="blue" icon={<RocketIcon />}>
            Astro
          </Label>
          <Label color="purple">PatternFly 6</Label>
          <Label color="green">React 19</Label>
        </LabelGroup>
      </StackItem>
      <StackItem>
        <Title headingLevel="h1" size="2xl">
          Astro, with PatternFly React
        </Title>
      </StackItem>
      <StackItem>
        <Content component="p">
          This page is rendered by Astro and built entirely from PatternFly React components. The
          masthead and side navigation are hydrated on the client; everything below ships as static
          HTML.
        </Content>
      </StackItem>
    </Stack>
  );
}
