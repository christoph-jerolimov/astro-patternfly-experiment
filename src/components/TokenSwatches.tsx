import {
  Card,
  CardBody,
  CardTitle,
  Content,
  Gallery,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import * as tokens from '@patternfly/react-tokens';

interface TokenGroup {
  id: string;
  title: string;
  note: string;
  tokens: { token: { name: string; var: string }; label: string }[];
}

const groups: TokenGroup[] = [
  {
    id: 'brand',
    title: 'Brand',
    note: 'The accent the product is recognised by.',
    tokens: [
      { token: tokens.t_global_color_brand_default, label: 'brand / default' },
      { token: tokens.t_global_color_brand_hover, label: 'brand / hover' },
      { token: tokens.t_global_color_brand_clicked, label: 'brand / clicked' },
    ],
  },
  {
    id: 'status',
    title: 'Status',
    note: 'Danger, warning, success and info, used by alerts, labels and progress bars alike.',
    tokens: [
      { token: tokens.t_global_icon_color_status_danger_default, label: 'status / danger' },
      { token: tokens.t_global_icon_color_status_warning_default, label: 'status / warning' },
      { token: tokens.t_global_icon_color_status_success_default, label: 'status / success' },
      { token: tokens.t_global_icon_color_status_info_default, label: 'status / info' },
    ],
  },
  {
    id: 'surface',
    title: 'Surfaces',
    note: 'The backgrounds pages and cards sit on. These are what invert in dark mode.',
    tokens: [
      { token: tokens.t_global_background_color_primary_default, label: 'background / primary' },
      {
        token: tokens.t_global_background_color_secondary_default,
        label: 'background / secondary',
      },
      { token: tokens.t_global_border_color_default, label: 'border / default' },
    ],
  },
  {
    id: 'text',
    title: 'Text',
    note: 'Regular, subtle and the colour used on top of the brand accent.',
    tokens: [
      { token: tokens.t_global_text_color_regular, label: 'text / regular' },
      { token: tokens.t_global_text_color_subtle, label: 'text / subtle' },
      { token: tokens.t_global_text_color_on_brand_default, label: 'text / on-brand' },
    ],
  },
];

/**
 * Colour tokens, drawn as live swatches.
 *
 * Each swatch is painted with the token's CSS variable rather than the value
 * baked into `@patternfly/react-tokens`. That value is the light theme's, so
 * printing it would be wrong the moment the page is viewed in dark mode —
 * whereas a swatch painted with `var()` simply recolours along with the theme.
 */
export default function TokenSwatches() {
  return (
    <Gallery hasGutter minWidths={{ default: '320px' }}>
      {groups.map((group) => (
        <Card key={group.id} id={group.id} isFullHeight>
          <CardTitle>{group.title}</CardTitle>
          <CardBody>
            <Content component="small">{group.note}</Content>
            <Stack hasGutter style={{ marginBlockStart: '1rem' }}>
              {group.tokens.map(({ token, label }) => (
                <StackItem key={token.name}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        background: token.var,
                        border: `1px solid ${tokens.t_global_border_color_default.var}`,
                        borderRadius: '4px',
                        flex: '0 0 auto',
                        height: '2.25rem',
                        width: '2.25rem',
                      }}
                    />
                    <span style={{ minWidth: 0 }}>
                      <Content component="p">{label}</Content>
                      <Content component="small" style={{ wordBreak: 'break-all' }}>
                        {token.name}
                      </Content>
                    </span>
                  </div>
                </StackItem>
              ))}
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Gallery>
  );
}
