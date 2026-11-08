import { useState, type ReactNode } from 'react';
import {
  Brand,
  Button,
  Content,
  Flex,
  FlexItem,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavGroup,
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

import { withBase } from '../site';
import ThemeMenu from './ThemeMenu';

/** The site's pages, in sidebar order. */
const pages = [
  { id: 'overview', label: 'Overview', href: withBase('/') },
  { id: 'dashboard', label: 'Dashboard', href: withBase('/dashboard/') },
  { id: 'servers', label: 'Servers', href: withBase('/servers/') },
  { id: 'empty-states', label: 'Empty states', href: withBase('/empty-states/') },
  { id: 'settings', label: 'Settings', href: withBase('/settings/') },
];

/** Pages showing the theme itself rather than an application screen. */
const themePages = [
  { id: 'foundations', label: 'Foundations', href: withBase('/foundations/') },
  { id: 'controls', label: 'Controls', href: withBase('/controls/') },
  { id: 'feedback', label: 'Feedback', href: withBase('/feedback/') },
];

/**
 * Error pages. They keep the chrome — losing the navigation is the last thing
 * someone who is already lost needs — but they are not destinations, so they
 * sit apart from the app's own pages.
 */
const errorPages = [
  // Astro reserves 404 and 500: they build to /404.html and /500.html rather
  // than to directories, so they are not linked with a trailing slash.
  { id: '404', label: '404 Not found', href: withBase('/404.html') },
  { id: '403', label: '403 Forbidden', href: withBase('/403/') },
  { id: '500', label: '500 Server error', href: withBase('/500.html') },
];

/**
 * Pages that render without the masthead and sidebar, so they can never be the
 * active item here. Listed separately rather than mixed in with the app's own
 * pages, which would imply the chrome stays.
 */
const standalonePages = [{ id: 'login', label: 'Log in', href: withBase('/login/') }];

export interface Section {
  /** Id of the element the link scrolls to. */
  id: string;
  label: string;
}

export interface AppLayoutProps {
  /** Page body, usually a set of <PageSection /> elements. */
  children?: ReactNode;
  /** Id of the page to mark as active in the sidebar. */
  activeItem?: string;
  /** Anchors to the current page's sections, listed below the page links. */
  sections?: Section[];
}

/**
 * The application chrome: masthead, collapsible side navigation and the main
 * content area. This is the interactive part of the page, so it is hydrated as
 * an Astro island.
 */
export default function AppLayout({
  children,
  activeItem = 'overview',
  sections = [],
}: AppLayoutProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          {/*
            No isSidebarOpen or onSidebarToggle: Page's isManagedSidebar keeps
            the state. A single boolean of our own meant one thing on desktop
            and another at mobile widths, where the toggle flipped between two
            states that were both off-screen.
          */}
          <PageToggleButton variant="plain" aria-label="Global navigation">
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo href={withBase('/')} component="a">
            <Flex
              alignItems={{ default: 'alignItemsCenter' }}
              gap={{ default: 'gapSm' }}
              flexWrap={{ default: 'nowrap' }}
            >
              <FlexItem>
                <Brand src={withBase('/logo.svg')} alt="" heights={{ default: '36px' }} />
              </FlexItem>
              <FlexItem>
                {/*
                  Real text rather than part of logo.svg, so it takes its
                  colour from the theme. Below PatternFly's md breakpoint the
                  masthead stacks the brand above the toggle and the action
                  icons, so this still fits on a phone.
                */}
                <Content component="p">Astro + PatternFly</Content>
              </FlexItem>
            </Flex>
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
                <ThemeMenu />
              </ToolbarItem>
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
    <PageSidebar>
      <PageSidebarBody>
        <Nav aria-label="Main navigation">
          <NavList>
            {pages.map((page) => (
              <NavItem
                key={page.id}
                itemId={page.id}
                to={page.href}
                isActive={page.id === activeItem}
              >
                {page.label}
              </NavItem>
            ))}
          </NavList>
          {sections.length > 0 && (
            <NavGroup title="On this page">
              {sections.map((section) => (
                <NavItem
                  key={section.id}
                  itemId={section.id}
                  to={`#${section.id}`}
                  isActive={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </NavItem>
              ))}
            </NavGroup>
          )}
          <NavGroup title="Theme">
            {themePages.map((page) => (
              <NavItem
                key={page.id}
                itemId={page.id}
                to={page.href}
                isActive={page.id === activeItem}
              >
                {page.label}
              </NavItem>
            ))}
          </NavGroup>
          <NavGroup title="Error pages">
            {errorPages.map((page) => (
              <NavItem
                key={page.id}
                itemId={page.id}
                to={page.href}
                isActive={page.id === activeItem}
              >
                {page.label}
              </NavItem>
            ))}
          </NavGroup>
          <NavGroup title="Standalone">
            {standalonePages.map((page) => (
              <NavItem key={page.id} itemId={page.id} to={page.href}>
                {page.label}
              </NavItem>
            ))}
          </NavGroup>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page
      masthead={masthead}
      sidebar={sidebar}
      mainContainerId="main-content"
      isContentFilled
      isManagedSidebar
    >
      {children}
    </Page>
  );
}
