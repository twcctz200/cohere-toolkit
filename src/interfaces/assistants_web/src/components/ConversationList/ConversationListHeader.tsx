'use client';

import { IconButton } from '@/components/IconButton';
import { Checkbox, Icon, Text } from '@/components/Shared';
import { useSettingsStore } from '@/stores';
import { cn } from '@/utils';

type Props = {
  isBulkActionMode: boolean;
  isSelectAllChecked: boolean;
  onSelectAllToggle: (checked: boolean) => void;
  onBulkDeleteClick: VoidFunction;
  onSearchClick: VoidFunction;
};

export const ConversationListHeader: React.FC<Props> = ({
  isBulkActionMode,
  isSelectAllChecked,
  onSelectAllToggle,
  onBulkDeleteClick,
  onSearchClick,
}) => {
  const { setIsConvListPanelOpen } = useSettingsStore();

  return (
    <header
      className={cn(
        'flex h-header w-full items-center justify-between border-b px-3 py-5',
        'border-marble-950',
        'overflow-hidden'
      )}
    >
      {isBulkActionMode ? (
        <div className="flex items-center gap-x-2">
          <Checkbox
            checked={isSelectAllChecked}
            indeterminate={!isSelectAllChecked}
            onChange={onSelectAllToggle}
            theme="evolved-green"
            className="mx-2"
          />
          <IconButton iconName="trash" onClick={onBulkDeleteClick} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-x-2">
            <IconButton
              iconName="chevron-left"
              className="lg:hidden"
              onClick={() => setIsConvListPanelOpen(false)}
            />
            <IconButton
              iconName="close-drawer"
              className="hidden lg:flex"
              tooltip={{ label: 'Toggle chat list', placement: 'bottom-start', size: 'md' }}
              onClick={() => setIsConvListPanelOpen(false)}
            />
            <span className="flex items-center gap-x-1">
              <Icon
                name="close-drawer"
                className="flex h-8 w-8 items-center justify-center fill-coral-700 lg:hidden"
                size="inherit"
                kind="outline"
              />
              <Text styleAs="p-lg">Chats</Text>
            </span>
          </div>
          <div className="flex items-center gap-x-3">
            <IconButton
              iconName="search"
              onClick={onSearchClick}
              tooltip={{ label: 'Search', placement: 'bottom-start', size: 'md' }}
            />
          </div>
        </>
      )}
    </header>
  );
};
