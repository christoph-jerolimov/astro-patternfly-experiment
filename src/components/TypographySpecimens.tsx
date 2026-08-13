import {
  Card,
  CardBody,
  CardTitle,
  Content,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';

const headings = [
  { size: '4xl', level: 'h1', label: 'Title 4xl' },
  { size: '3xl', level: 'h2', label: 'Title 3xl' },
  { size: '2xl', level: 'h3', label: 'Title 2xl' },
  { size: 'xl', level: 'h4', label: 'Title xl' },
  { size: 'lg', level: 'h5', label: 'Title lg' },
  { size: 'md', level: 'h6', label: 'Title md' },
] as const;

export default function TypographySpecimens() {
  return (
    <Grid hasGutter>
      <GridItem lg={6}>
        <Card isFullHeight>
          <CardTitle>Headings</CardTitle>
          <CardBody>
            <Stack hasGutter>
              {headings.map((heading) => (
                <StackItem key={heading.size}>
                  <Title headingLevel={heading.level} size={heading.size}>
                    {heading.label}
                  </Title>
                  <Content component="small">
                    size="{heading.size}" on &lt;{heading.level}&gt;
                  </Content>
                </StackItem>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </GridItem>

      <GridItem lg={6}>
        <Card isFullHeight>
          <CardTitle>Body copy</CardTitle>
          <CardBody>
            <Content>
              <p>
                A paragraph of body copy, with <a href="#body">a link</a>, some{' '}
                <strong>bold text</strong>, some <em>emphasis</em> and a bit of{' '}
                <code>inline code</code> to sit against it.
              </p>
              <small>Small print, for the things that qualify rather than state.</small>
              <blockquote>
                A blockquote, set apart from the paragraphs around it so that a quotation does not
                read as the author's own words.
              </blockquote>
              <ul>
                <li>An unordered list item</li>
                <li>
                  A second one, long enough to wrap onto another line so the leading between list
                  items is visible rather than assumed
                </li>
              </ul>
              <ol>
                <li>An ordered list item</li>
                <li>A second one</li>
              </ol>
              <pre>{'const preformatted = "keeps its own whitespace";'}</pre>
            </Content>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
}
