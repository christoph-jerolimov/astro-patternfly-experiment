import {
  Card,
  CardBody,
  CardTitle,
  Content,
  Flex,
  FlexItem,
  Gallery,
  Icon,
  Label,
  Title,
} from '@patternfly/react-core';
import ArrowDownIcon from '@patternfly/react-icons/dist/esm/icons/arrow-down-icon';
import ArrowUpIcon from '@patternfly/react-icons/dist/esm/icons/arrow-up-icon';

const stats = [
  { id: 'requests', label: 'Requests', value: '48.2k', change: 12.4, period: 'vs last week' },
  { id: 'latency', label: 'p95 latency', value: '184 ms', change: -8.1, period: 'vs last week' },
  { id: 'errors', label: 'Error rate', value: '0.42%', change: 0.8, period: 'vs last week' },
  { id: 'builds', label: 'Builds today', value: '37', change: 5.0, period: 'vs yesterday' },
];

/**
 * The row of headline numbers at the top of the dashboard.
 *
 * A falling error rate or latency is an improvement, so the arrow follows the
 * direction of the number while the colour follows whether that direction is
 * good. Tying the colour to the sign alone would paint every drop red.
 */
export default function DashboardStats() {
  return (
    <Gallery hasGutter minWidths={{ default: '200px' }}>
      {stats.map((stat) => {
        const isDown = stat.change < 0;
        const isGood = stat.id === 'latency' || stat.id === 'errors' ? isDown : !isDown;
        const TrendIcon = isDown ? ArrowDownIcon : ArrowUpIcon;

        return (
          <Card key={stat.id} id={stat.id} isCompact>
            <CardTitle>{stat.label}</CardTitle>
            <CardBody>
              <Flex
                direction={{ default: 'column' }}
                gap={{ default: 'gapSm' }}
                alignItems={{ default: 'alignItemsFlexStart' }}
              >
                <FlexItem>
                  <Title headingLevel="h3" size="2xl">
                    {stat.value}
                  </Title>
                </FlexItem>
                <FlexItem>
                  <Flex
                    gap={{ default: 'gapSm' }}
                    alignItems={{ default: 'alignItemsCenter' }}
                    flexWrap={{ default: 'nowrap' }}
                  >
                    <FlexItem>
                      <Label
                        isCompact
                        color={isGood ? 'green' : 'red'}
                        icon={
                          <Icon>
                            <TrendIcon />
                          </Icon>
                        }
                      >
                        {Math.abs(stat.change).toFixed(1)}%
                      </Label>
                    </FlexItem>
                    <FlexItem>
                      <Content component="small">{stat.period}</Content>
                    </FlexItem>
                  </Flex>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        );
      })}
    </Gallery>
  );
}
