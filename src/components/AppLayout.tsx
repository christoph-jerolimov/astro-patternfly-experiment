import { useState, type ReactNode } from 'react';
import {
  Brand,
  Button,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon';
import CogIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon';
import GithubIcon from '@patternfly/react-icons/dist/esm/icons/github-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';

const navItems = [
  { id: 'overview', label: 'Overview', href: '/' },
  { id: 'components', label: 'Components', href: '#components' },
  { id: 'islands', label: 'Islands', href: '#islands' },
  { id: 'resources', label: 'Resources', href: '#resources' },
];

export interface AppLayoutProps {
  /** Page body, usually a set of <PageSection /> elements. */
  children?: ReactNode;
  /** Id of the nav item to mark as active. */
  activeItem?: string;
}

/**
 * The application chrome: masthead, collapsible side navigation and the main
 * content area. This is the interactive part of the page, so it is hydrated as
 * an Astro island.
 */
export default function AppLayout({ children, activeItem = 'overview' }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState(activeItem);

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            variant="plain"
            aria-label="Global navigation"
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
          >
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo href="/">
            <Brand src="/logo.svg" alt="Astro + PatternFly" heights={{ default: '36px' }} />
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar isFullHeight isStatic>
          <ToolbarContent>
            <ToolbarGroup
              variant="action-group-plain"
              align={{ default: 'alignEnd' }}
              gap={{ default: 'gapNone', md: 'gapMd' }}
            >
              <ToolbarItem>
                <Button variant="plain" aria-label="Notifications" icon={<BellIcon />} />
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="plain" aria-label="Settings" icon={<CogIcon />} />
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="plain" aria-label="Help" icon={<QuestionCircleIcon />} />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant="plain"
                  aria-label="Source on GitHub"
                  icon={<GithubIcon />}
                  component="a"
                  href="https://github.com/christoph-jerolimov/astro-patternfly-experiment"
                  target="_blank"
                  rel="noreferrer"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );

  const sidebar = (
    <PageSidebar isSidebarOpen={isSidebarOpen}>
      <PageSidebarBody>
        <Nav aria-label="Main navigation">
          <NavList>
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                itemId={item.id}
                to={item.href}
                isActive={selectedItem === item.id}
                onClick={() => setSelectedItem(item.id)}
              >
                {item.label}
              </NavItem>
            ))}
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page masthead={masthead} sidebar={sidebar} mainContainerId="main-content" isContentFilled>
      {children}
    </Page>
  );
}
