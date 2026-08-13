import { useState } from 'react';
import {
  Alert,
  AlertActionCloseButton,
  AlertActionLink,
  Banner,
  Card,
  CardBody,
  CardTitle,
  Button,
  Content,
  Stack,
  StackItem,
} from '@patternfly/react-core';

const variants = ['danger', 'warning', 'success', 'info', 'custom'] as const;

export default function AlertSpecimens() {
  // PatternFly does not remove a dismissed alert for you; without this the
  // close button would render and then do nothing.
  const [isDismissed, setIsDismissed] = useState(false);

  return (
    <Card isFullHeight>
      <CardTitle>Alerts and banners</CardTitle>
      <CardBody>
        <Stack hasGutter>
          {variants.map((variant) => (
            <StackItem key={variant}>
              <Alert
                variant={variant}
                isInline
                title={`An inline ${variant} alert`}
                actionLinks={
                  <AlertActionLink component="a" href="#alerts">
                    View details
                  </AlertActionLink>
                }
              >
                Inline alerts sit in the flow of the page, next to whatever they are about.
              </Alert>
            </StackItem>
          ))}

          <StackItem>
            {isDismissed ? (
              <Button variant="link" isInline onClick={() => setIsDismissed(false)}>
                Bring the dismissed alert back
              </Button>
            ) : (
              <Alert
                variant="warning"
                title="A dismissible alert"
                actionClose={
                  <AlertActionCloseButton
                    aria-label="Close alert"
                    onClose={() => setIsDismissed(true)}
                  />
                }
              >
                Without <code>isInline</code> an alert is a raised toast rather than part of the
                page.
              </Alert>
            )}
          </StackItem>

          <StackItem>
            <Content component="small">
              Banners span the full width of whatever contains them.
            </Content>
          </StackItem>
          <StackItem>
            <Banner color="blue">A blue banner, for something worth reading but not urgent.</Banner>
          </StackItem>
          <StackItem>
            <Banner color="red">A red banner, for something that is going wrong right now.</Banner>
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
}
