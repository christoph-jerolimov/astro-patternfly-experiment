import { Button, Card, CardBody, CardTitle, Content, Flex, FlexItem } from '@patternfly/react-core';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';

const variants = [
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'warning',
  'link',
  'plain',
] as const;

const rows = [
  { id: 'default', label: 'Default', props: {} },
  { id: 'disabled', label: 'Disabled', props: { isDisabled: true } },
  { id: 'small', label: 'Small', props: { size: 'sm' as const } },
];

export default function ButtonSpecimens() {
  return (
    <Card isFullHeight>
      <CardTitle>Buttons</CardTitle>
      <CardBody>
        <Flex direction={{ default: 'column' }} gap={{ default: 'gapLg' }}>
          {rows.map((row) => (
            <FlexItem key={row.id}>
              <Content component="small">{row.label}</Content>
              <Flex gap={{ default: 'gapSm' }} style={{ marginBlockStart: '0.5rem' }}>
                {variants.map((variant) => (
                  <FlexItem key={variant}>
                    <Button
                      variant={variant}
                      {...row.props}
                      {...(variant === 'plain' ? { 'aria-label': `Plain ${row.label}` } : {})}
                    >
                      {variant === 'plain' ? <PlusCircleIcon /> : variant}
                    </Button>
                  </FlexItem>
                ))}
              </Flex>
            </FlexItem>
          ))}

          <FlexItem>
            <Content component="small">With an icon, and as a link</Content>
            <Flex gap={{ default: 'gapSm' }} style={{ marginBlockStart: '0.5rem' }}>
              <FlexItem>
                <Button variant="primary" icon={<PlusCircleIcon />}>
                  Create
                </Button>
              </FlexItem>
              <FlexItem>
                <Button variant="secondary" icon={<PlusCircleIcon />} iconPosition="end">
                  Create
                </Button>
              </FlexItem>
              <FlexItem>
                {/* component="a" keeps it a real link, so it opens in a new tab
                    and shows a URL on hover like readers expect. */}
                <Button variant="link" component="a" href="#buttons">
                  An anchor styled as a button
                </Button>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
}
