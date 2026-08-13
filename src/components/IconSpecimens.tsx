import { Card, CardBody, CardTitle, Content, Flex, FlexItem, Icon } from '@patternfly/react-core';
import BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import CloudUploadAltIcon from '@patternfly/react-icons/dist/esm/icons/cloud-upload-alt-icon';
import CodeBranchIcon from '@patternfly/react-icons/dist/esm/icons/code-branch-icon';
import CogIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import ServerIcon from '@patternfly/react-icons/dist/esm/icons/server-icon';

const sizes = ['sm', 'md', 'lg', 'xl'] as const;

const statuses = [
  { status: 'success' as const, icon: CheckCircleIcon, label: 'success' },
  { status: 'warning' as const, icon: ExclamationTriangleIcon, label: 'warning' },
  { status: 'danger' as const, icon: ExclamationCircleIcon, label: 'danger' },
  { status: 'info' as const, icon: InfoCircleIcon, label: 'info' },
];

const catalogue = [
  { icon: ServerIcon, name: 'server' },
  { icon: CubeIcon, name: 'cube' },
  { icon: CodeBranchIcon, name: 'code-branch' },
  { icon: CloudUploadAltIcon, name: 'cloud-upload-alt' },
  { icon: CogIcon, name: 'cog' },
  { icon: BellIcon, name: 'bell' },
];

export default function IconSpecimens() {
  return (
    <Card isFullHeight>
      <CardTitle>Icons</CardTitle>
      <CardBody>
        <Flex direction={{ default: 'column' }} gap={{ default: 'gapLg' }}>
          <FlexItem>
            <Content component="small">Sizes</Content>
            <Flex
              gap={{ default: 'gapMd' }}
              alignItems={{ default: 'alignItemsCenter' }}
              style={{ marginBlockStart: '0.5rem' }}
            >
              {sizes.map((size) => (
                <FlexItem key={size}>
                  <Icon size={size}>
                    <CubeIcon />
                  </Icon>
                </FlexItem>
              ))}
            </Flex>
          </FlexItem>

          <FlexItem>
            <Content component="small">Status colours</Content>
            <Flex
              gap={{ default: 'gapMd' }}
              alignItems={{ default: 'alignItemsCenter' }}
              style={{ marginBlockStart: '0.5rem' }}
            >
              {statuses.map(({ status, icon: StatusIcon, label }) => (
                <FlexItem key={status}>
                  <Icon status={status} size="lg" aria-label={label}>
                    <StatusIcon />
                  </Icon>
                </FlexItem>
              ))}
            </Flex>
          </FlexItem>

          <FlexItem>
            <Content component="small">
              A handful of the set. Icons are imported one file at a time, so only the ones a page
              uses reach the bundle.
            </Content>
            <Flex gap={{ default: 'gapLg' }} style={{ marginBlockStart: '0.5rem' }}>
              {catalogue.map(({ icon: CatalogueIcon, name }) => (
                <FlexItem key={name}>
                  <Flex
                    direction={{ default: 'column' }}
                    alignItems={{ default: 'alignItemsCenter' }}
                    gap={{ default: 'gapXs' }}
                  >
                    <FlexItem>
                      <Icon size="lg">
                        <CatalogueIcon />
                      </Icon>
                    </FlexItem>
                    <FlexItem>
                      <Content component="small">{name}</Content>
                    </FlexItem>
                  </Flex>
                </FlexItem>
              ))}
            </Flex>
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
}
