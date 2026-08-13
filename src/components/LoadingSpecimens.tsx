import {
  Card,
  CardBody,
  CardTitle,
  Content,
  Progress,
  ProgressStep,
  ProgressStepper,
  Skeleton,
  Spinner,
  Stack,
  StackItem,
} from '@patternfly/react-core';

/**
 * What the page shows while it is waiting.
 *
 * A skeleton keeps the layout from jumping once content arrives, which a bare
 * spinner in the middle of an empty page does not.
 */
export default function LoadingSpecimens() {
  return (
    <Card isFullHeight>
      <CardTitle>Loading</CardTitle>
      <CardBody>
        <Stack hasGutter>
          <StackItem>
            <Content component="small">Spinners, at three sizes</Content>
            <Stack hasGutter style={{ marginBlockStart: '0.5rem' }}>
              <StackItem>
                <Spinner size="sm" aria-label="Loading, small" />{' '}
                <Spinner size="md" aria-label="Loading, medium" />{' '}
                <Spinner size="lg" aria-label="Loading, large" />
              </StackItem>
            </Stack>
          </StackItem>

          <StackItem>
            <Content component="small">
              A skeleton, which holds the shape of the content so the layout does not jump when it
              arrives
            </Content>
            <Stack hasGutter style={{ marginBlockStart: '0.5rem' }}>
              <StackItem>
                <Skeleton width="45%" screenreaderText="Loading the heading" />
              </StackItem>
              <StackItem>
                <Skeleton width="100%" />
              </StackItem>
              <StackItem>
                <Skeleton width="85%" />
              </StackItem>
              <StackItem>
                <Skeleton width="65%" />
              </StackItem>
            </Stack>
          </StackItem>

          <StackItem>
            <Content component="small">Determinate progress</Content>
            <Progress value={68} title="Uploading" aria-label="Upload progress" />
          </StackItem>

          <StackItem>
            <Content component="small">A multi-step process</Content>
            <ProgressStepper
              aria-label="Deployment progress"
              style={{ marginBlockStart: '0.5rem' }}
            >
              <ProgressStep
                variant="success"
                id="build"
                titleId="build-title"
                aria-label="Build succeeded"
              >
                Build
              </ProgressStep>
              <ProgressStep
                variant="success"
                id="test"
                titleId="test-title"
                aria-label="Tests passed"
              >
                Test
              </ProgressStep>
              <ProgressStep
                variant="info"
                isCurrent
                id="deploy"
                titleId="deploy-title"
                aria-label="Deploying"
              >
                Deploy
              </ProgressStep>
              <ProgressStep
                variant="pending"
                id="verify"
                titleId="verify-title"
                aria-label="Not started"
              >
                Verify
              </ProgressStep>
            </ProgressStepper>
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
}
