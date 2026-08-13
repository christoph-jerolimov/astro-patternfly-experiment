import { useMemo, useState } from 'react';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  Label,
  MenuToggle,
  type MenuToggleElement,
  Pagination,
  Select,
  SelectList,
  SelectOption,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { ActionsColumn, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';

import { servers, statusMeta, type Server } from '../data/servers';

type SortableKey = 'name' | 'status' | 'region' | 'cpu' | 'memory';
type StatusFilter = 'all' | Server['status'];

const columns: { key: SortableKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'region', label: 'Region' },
  { key: 'cpu', label: 'CPU' },
  { key: 'memory', label: 'Memory' },
];

/**
 * A filterable, sortable, paginated list view.
 *
 * This is the one page whose content genuinely needs the client, so it ships as
 * its own island rather than as static HTML like the other sections.
 */
export default function ServersTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortableKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const matches = servers.filter(
      (server) =>
        (statusFilter === 'all' || server.status === statusFilter) &&
        (needle === '' ||
          server.name.toLowerCase().includes(needle) ||
          server.region.toLowerCase().includes(needle)),
    );

    return [...matches].sort((a, b) => {
      const left = a[sortBy];
      const right = b[sortBy];
      const order =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right));
      return sortDirection === 'asc' ? order : -order;
    });
  }, [search, statusFilter, sortBy, sortDirection]);

  // Clamp to the last page rather than showing an empty one when filtering
  // shrinks the result set below the current offset.
  const lastPage = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, lastPage);
  const visible = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const onSort = (key: SortableKey) => {
    setSortDirection(sortBy === key && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortBy(key);
    setPage(1);
  };

  const toggleAll = (isSelecting: boolean) =>
    setSelected(isSelecting ? filtered.map((server) => server.id) : []);

  const toggleOne = (server: Server, isSelecting: boolean) =>
    setSelected((current) =>
      isSelecting ? [...current, server.id] : current.filter((id) => id !== server.id),
    );

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPage(1);
  };

  const toolbar = (
    <Toolbar id="servers-toolbar" clearAllFilters={resetFilters}>
      <ToolbarContent>
        <ToolbarItem>
          <SearchInput
            aria-label="Search servers"
            placeholder="Filter by name or region"
            value={search}
            onChange={(_event, value) => {
              setSearch(value);
              setPage(1);
            }}
            onClear={() => {
              setSearch('');
              setPage(1);
            }}
          />
        </ToolbarItem>
        <ToolbarItem>
          <Select
            id="status-filter"
            isOpen={isStatusOpen}
            selected={statusFilter}
            onSelect={(_event, value) => {
              setStatusFilter(value as StatusFilter);
              setIsStatusOpen(false);
              setPage(1);
            }}
            onOpenChange={setIsStatusOpen}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setIsStatusOpen((open) => !open)}
                isExpanded={isStatusOpen}
              >
                {statusFilter === 'all' ? 'All statuses' : statusMeta[statusFilter].label}
              </MenuToggle>
            )}
          >
            <SelectList>
              <SelectOption value="all">All statuses</SelectOption>
              {Object.entries(statusMeta).map(([value, meta]) => (
                <SelectOption key={value} value={value}>
                  {meta.label}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
        </ToolbarItem>
        <ToolbarGroup variant="action-group">
          <ToolbarItem>
            <Button variant="secondary" isDisabled={selected.length === 0}>
              Restart{selected.length > 0 ? ` (${selected.length})` : ''}
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarItem align={{ default: 'alignEnd' }} variant="pagination">
          <Pagination
            itemCount={filtered.length}
            page={currentPage}
            perPage={perPage}
            onSetPage={(_event, value) => setPage(value)}
            onPerPageSelect={(_event, value) => {
              setPerPage(value);
              setPage(1);
            }}
            perPageOptions={[
              { title: '5', value: 5 },
              { title: '10', value: 10 },
            ]}
            isCompact
            titles={{ paginationAriaLabel: 'Server pagination' }}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

  return (
    <>
      {toolbar}
      <Table aria-label="Servers" variant="compact">
        <Thead>
          <Tr>
            <Th
              select={{
                onSelect: (_event, isSelecting) => toggleAll(isSelecting),
                isSelected: selected.length > 0 && selected.length === filtered.length,
                isDisabled: filtered.length === 0,
              }}
              aria-label="Select all servers"
            />
            {columns.map((column) => (
              <Th
                key={column.key}
                sort={{
                  sortBy: {
                    index: columns.findIndex((c) => c.key === sortBy),
                    direction: sortDirection,
                  },
                  onSort: () => onSort(column.key),
                  columnIndex: columns.findIndex((c) => c.key === column.key),
                }}
              >
                {column.label}
              </Th>
            ))}
            <Th screenReaderText="Row actions" />
          </Tr>
        </Thead>
        <Tbody>
          {visible.map((server, rowIndex) => (
            <Tr key={server.id}>
              <Td
                select={{
                  rowIndex,
                  onSelect: (_event, isSelecting) => toggleOne(server, isSelecting),
                  isSelected: selected.includes(server.id),
                }}
              />
              <Td dataLabel="Name">{server.name}</Td>
              <Td dataLabel="Status">
                <Label isCompact color={statusMeta[server.status].color}>
                  {statusMeta[server.status].label}
                </Label>
              </Td>
              <Td dataLabel="Region">{server.region}</Td>
              <Td dataLabel="CPU">{server.cpu}%</Td>
              <Td dataLabel="Memory">{server.memory}%</Td>
              <Td isActionCell>
                <ActionsColumn
                  items={[
                    { title: 'Restart' },
                    { title: 'View logs' },
                    { isSeparator: true },
                    { title: 'Delete', isDanger: true },
                  ]}
                />
              </Td>
            </Tr>
          ))}
          {visible.length === 0 && (
            <Tr>
              <Td colSpan={columns.length + 2}>
                <EmptyState
                  headingLevel="h2"
                  icon={SearchIcon}
                  titleText="No servers match the filters"
                  variant="sm"
                >
                  <EmptyStateBody>
                    Nothing matches the current search and status filter.
                  </EmptyStateBody>
                  <EmptyStateFooter>
                    <EmptyStateActions>
                      <Button variant="link" onClick={resetFilters}>
                        Clear all filters
                      </Button>
                    </EmptyStateActions>
                  </EmptyStateFooter>
                </EmptyState>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </>
  );
}
