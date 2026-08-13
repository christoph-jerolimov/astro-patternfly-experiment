import type { ComponentType } from 'react';
import { Card, CardBody, CardTitle, Flex, Gallery, Icon } from '@patternfly/react-core';
import BoltIcon from '@patternfly/react-icons/dist/esm/icons/bolt-icon';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import PaletteIcon from '@patternfly/react-icons/dist/esm/icons/palette-icon';
import PuzzlePieceIcon from '@patternfly/react-icons/dist/esm/icons/puzzle-piece-icon';

interface Feature {
  id: string;
  icon: ComponentType;
  title: string;
  body: string;
}

const features: Feature[] = [
  {
    id: 'components',
    icon: CubeIcon,
    title: 'PatternFly components',
    body: 'Cards, toolbars, navigation and the rest of @patternfly/react-core are available as regular React components.',
  },
  {
    id: 'islands',
    icon: BoltIcon,
    title: 'Islands architecture',
    body: 'Only the app shell is hydrated with client:load. Everything else is rendered to plain HTML at build time.',
  },
  {
    id: 'tokens',
    icon: PaletteIcon,
    title: 'Design tokens',
    body: 'The PatternFly base stylesheet is imported once in the layout, so its tokens and CSS reset apply everywhere.',
  },
  {
    id: 'integration',
    icon: PuzzlePieceIcon,
    title: '@astrojs/react',
    body: 'The React integration renders PatternFly on the server and hydrates only the parts that need interactivity.',
  },
];

/**
 * Static card gallery. There is no client directive on this component, so Astro
 * renders it to HTML at build time and ships no JavaScript for it.
 */
export default function FeatureCards() {
  return (
    <Gallery hasGutter minWidths={{ default: '260px' }}>
      {features.map(({ id, icon: FeatureIcon, title, body }) => (
        <Card key={id} id={id} isCompact>
          <CardTitle>
            <Flex
              gap={{ default: 'gapSm' }}
              alignItems={{ default: 'alignItemsCenter' }}
              flexWrap={{ default: 'nowrap' }}
            >
              <Icon size="lg">
                <FeatureIcon />
              </Icon>
              {title}
            </Flex>
          </CardTitle>
          <CardBody>{body}</CardBody>
        </Card>
      ))}
    </Gallery>
  );
}
