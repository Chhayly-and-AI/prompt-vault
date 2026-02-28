// Schema versioning and migration system

const CURRENT_SCHEMA_VERSION = 1;

interface MigrationContext {
  version: number;
  workspaces: any[];
  assets: any[];
  conversations: any[];
}

const migrations: Record<number, (ctx: MigrationContext) => MigrationContext> = {
  // Future migrations go here
  // Example: 2: (ctx) => ({ ...ctx, assets: ctx.assets.map(a => ({ ...a, newField: 'default' })) })
};

export function migrate(data: MigrationContext): MigrationContext {
  let migrated = { ...data };
  
  while (migrated.version < CURRENT_SCHEMA_VERSION) {
    const nextVersion = migrated.version + 1;
    const migration = migrations[nextVersion];
    if (migration) {
      migrated = migration(migrated);
    }
    migrated.version = nextVersion;
  }
  
  return migrated;
}

export function getSchemaVersion(): number {
  return CURRENT_SCHEMA_VERSION;
}
