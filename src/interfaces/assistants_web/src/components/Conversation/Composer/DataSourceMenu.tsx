'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import React from 'react';

import { Agent, ManagedTool } from '@/cohere-client';
import { Icon, Switch, Text } from '@/components/Shared';
import { TOOL_FALLBACK_ICON, TOOL_ID_TO_DISPLAY_INFO } from '@/constants';
import { useAvailableTools } from '@/hooks/tools';
import { useParamsStore } from '@/stores';
import { cn } from '@/utils';
import { getCohereColor } from '@/utils/getCohereColor';

export type Props = {
  agent?: Agent;
  tools?: ManagedTool[];
};

/**
 * @description Displays a list of available tools and data sources that the user can select from.
 */
export const DataSourceMenu: React.FC<Props> = ({ agent, tools }) => {
  const {
    params: { tools: paramsTools },
  } = useParamsStore();
  const { availableTools, handleToggle } = useAvailableTools({
    agent,
    managedTools: tools,
  });

  return (
    <Popover className="relative">
      <PopoverButton
        as="button"
        className={({ open }) =>
          cn(
            'flex items-center justify-center rounded border px-1.5 py-1 outline-none transition-colors',
            getCohereColor(agent?.id, {
              text: true,
              contrastText: open,
              border: true,
              background: open,
            })
          )
        }
      >
        <Text styleAs="label" as="span" className="font-medium">
          Tools: {paramsTools?.length ?? 0}
        </Text>
      </PopoverButton>
      <PopoverPanel
        className="flex origin-top -translate-y-2 flex-col transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        anchor="top start"
        transition
      >
        <div
          className={cn(
            'z-tag-suggestions flex flex-col',
            'w-full rounded-md p-2 focus:outline-none',
            'bg-mushroom-950 dark:bg-volcanic-150'
          )}
        >
          <Text styleAs="label" className="mb-2 text-mushroom-300 dark:text-marble-800">
            Avaiable tools
          </Text>
          {availableTools.map((tool, i) => (
            <div
              key={tool.name}
              className={cn(
                'flex w-full items-start justify-between gap-x-2 px-1.5 py-3',
                'focus:outline focus:outline-volcanic-300',
                {
                  'border-b border-mushroom-800 md:w-[300px] dark:border-volcanic-300':
                    i !== availableTools.length - 1,
                }
              )}
            >
              <div className="flex flex-1 justify-between gap-x-2">
                <div className="flex gap-x-2">
                  <div className="relative flex items-center justify-center rounded bg-mushroom-800 p-1 dark:bg-volcanic-200">
                    <Icon
                      name={TOOL_ID_TO_DISPLAY_INFO[tool.name ?? '']?.icon ?? TOOL_FALLBACK_ICON}
                      kind="outline"
                      size="sm"
                      className="flex items-center"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5  size-2 rounded-full bg-success-300" />
                  </div>
                  <div className="flex flex-col text-left">
                    <Text as="span">{tool.display_name}</Text>
                  </div>
                </div>
                {!agent && (
                  <Switch
                    theme="evolved-green"
                    checked={!!paramsTools?.find((t) => t.name === tool.name)}
                    onChange={(checked) => handleToggle(tool.name!, checked)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  );
};
