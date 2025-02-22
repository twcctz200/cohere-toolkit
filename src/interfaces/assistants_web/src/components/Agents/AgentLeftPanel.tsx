'use client';

import { Transition } from '@headlessui/react';
import Link from 'next/link';
import React from 'react';

import { Button, ButtonTheme, Icon, IconName, Logo, Text, Tooltip } from '@/components/Shared';
import { Shortcut } from '@/components/Shortcut';
import { env } from '@/env.mjs';
import { useIsDesktop } from '@/hooks/breakpoint';
import { useNavigateToNewChat } from '@/hooks/chatRoutes';
import { useAgentsStore, useSettingsStore } from '@/stores';
import { cn } from '@/utils';

/**
 * @description This component renders the agents side panel.
 * It contains the logo and a button to expand or collapse the panel.
 * It also renders the children components that are passed to it.
 */
export const AgentLeftPanel: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  className = '',
  children,
}) => {
  const {
    agents: { isAgentsLeftPanelOpen },
  } = useAgentsStore();
  const isDesktop = useIsDesktop();
  const isMobile = !isDesktop;

  const navigateToNewChat = useNavigateToNewChat();

  return (
    <Transition
      show={isAgentsLeftPanelOpen || isDesktop}
      as="div"
      className={cn(
        'absolute bottom-0 left-0 top-0 z-30 lg:static',
        'h-full bg-marble-1000 dark:bg-volcanic-60',
        'rounded-lg border border-marble-950 dark:border-volcanic-60',
        'dark:text-mushroom-950',
        {
          'right-1/4 md:right-auto': isAgentsLeftPanelOpen,
        },
        className
      )}
      enter="transition-all transform ease-in-out duration-500"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition-all transform ease-in-out duration-500"
      leaveFrom="translate-x-0 opacity-100"
      leaveTo="-translate-x-full opacity-0"
    >
      <div
        className={cn(
          'flex h-full flex-grow flex-col gap-y-8 px-4 py-6',
          'md:transition-[min-width,max-width]',
          {
            'gap-y-8 md:min-w-agents-panel-collapsed md:max-w-agents-panel-collapsed':
              !isAgentsLeftPanelOpen,
            'md:min-w-agents-panel-expanded md:max-w-agents-panel-expanded lg:min-w-agents-panel-expanded-lg lg:max-w-agents-panel-expanded-lg':
              isAgentsLeftPanelOpen,
          }
        )}
      >
        <div
          className={cn('flex flex-shrink-0 items-center', {
            'justify-center': !isAgentsLeftPanelOpen,
            'justify-between gap-x-3': isMobile && isAgentsLeftPanelOpen,
          })}
        >
          <button onClick={() => navigateToNewChat()}>
            <Logo
              hasCustomLogo={env.NEXT_PUBLIC_HAS_CUSTOM_LOGO}
              includeBrandName={isAgentsLeftPanelOpen}
            />
          </button>

          <div className="flex md:hidden">
            <ToggleSettingsSidePanelButton />
          </div>
        </div>

        <div
          className={cn('flex flex-shrink-0 flex-col gap-y-4', {
            'items-center': !isAgentsLeftPanelOpen,
          })}
        >
          <AgentsSidePanelButton
            label={
              <div className="group flex items-center justify-between">
                <Text className="dark:text-evolved-green-700">New chat</Text>
                <Shortcut sequence={['⌘', '↑', 'N']} className="hidden group-hover:flex" />
              </div>
            }
            iconName="add"
            iconClassName="dark:fill-evolved-green-700"
            onClick={() => navigateToNewChat()}
            stretch
          />

          <AgentsSidePanelButton label="See all assistants" href="/discover" iconName="compass" />
        </div>

        {children}

        <footer className={cn('flex flex-col gap-4', { 'items-center': !isAgentsLeftPanelOpen })}>
          <AgentsSidePanelButton label="Settings" href="/settings" iconName="settings" />
          <section className="flex items-center justify-between">
            <div
              className={cn('flex items-center gap-2', {
                hidden: !isAgentsLeftPanelOpen,
              })}
            >
              <Text styleAs="label" className="dark:text-mushroom-800">
                POWERED BY
              </Text>
              <Logo hasCustomLogo={env.NEXT_PUBLIC_HAS_CUSTOM_LOGO} includeBrandName={false} />
            </div>
            <ToggleSettingsSidePanelButton className="hidden md:flex" />
          </section>
        </footer>
      </div>
    </Transition>
  );
};

const ToggleSettingsSidePanelButton: React.FC<{ className?: string }> = ({ className }) => {
  const {
    agents: { isAgentsLeftPanelOpen },
    setAgentsLeftSidePanelOpen,
  } = useAgentsStore();
  const { setSettings, setIsConvListPanelOpen } = useSettingsStore();

  const handleToggleAgentsLeftPanel = () => {
    setIsConvListPanelOpen(false);
    setSettings({ isConfigDrawerOpen: false });
    setAgentsLeftSidePanelOpen(!isAgentsLeftPanelOpen);
  };

  return (
    <Tooltip hover label="Toggle agents side panel" size="sm">
      <AgentsSidePanelButton
        iconName="close-drawer"
        iconClassName={cn(
          'transform transition delay-100 duration-200 ease-in-out dark:fill-marble-950',
          className,
          {
            'rotate-180 ': isAgentsLeftPanelOpen,
          }
        )}
        onClick={handleToggleAgentsLeftPanel}
      />
    </Tooltip>
  );
};

const AgentsSidePanelButton: React.FC<{
  label?: React.ReactNode;
  href?: string;
  iconName: IconName;
  onClick?: VoidFunction;
  theme?: ButtonTheme;
  iconClassName?: string;
  stretch?: boolean;
}> = ({ label, iconName, iconClassName, href, theme, stretch, onClick }) => {
  const {
    agents: { isAgentsLeftPanelOpen },
  } = useAgentsStore();

  if (!isAgentsLeftPanelOpen) {
    if (href) {
      return (
        <Tooltip hover label={label} size="sm">
          <Link href={href}>
            <Icon name={iconName} kind="outline" className={iconClassName} />
          </Link>
        </Tooltip>
      );
    }

    return (
      <Tooltip hover label={label} size="sm">
        <button onClick={onClick}>
          <Icon name={iconName} kind="outline" className={iconClassName} />
        </button>
      </Tooltip>
    );
  }

  return (
    <Button
      kind="secondary"
      label={label}
      href={href}
      icon={iconName}
      iconOptions={{ className: iconClassName }}
      onClick={onClick}
      theme={theme}
      stretch={stretch}
    />
  );
};
