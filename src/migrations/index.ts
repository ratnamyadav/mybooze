import * as migration_20260626_060945_fts_search from './20260626_060945_fts_search';
import * as migration_20260626_120000_owner_magic_link from './20260626_120000_owner_magic_link';
import * as migration_20260626_130000_add_store_inventory_and_events from './20260626_130000_add_store_inventory_and_events';

export const migrations = [
  {
    up: migration_20260626_060945_fts_search.up,
    down: migration_20260626_060945_fts_search.down,
    name: '20260626_060945_fts_search',
  },
  {
    up: migration_20260626_120000_owner_magic_link.up,
    down: migration_20260626_120000_owner_magic_link.down,
    name: '20260626_120000_owner_magic_link',
  },
  {
    up: migration_20260626_130000_add_store_inventory_and_events.up,
    down: migration_20260626_130000_add_store_inventory_and_events.down,
    name: '20260626_130000_add_store_inventory_and_events',
  },
];
