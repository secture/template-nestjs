import { Migration } from '@mikro-orm/migrations';

export class Migration20250218134048 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "poi" add column "area" geography(Polygon, 4326) null;`,
    );

    this.addSql(`alter table "slope" drop column "path";`);

    this.addSql(
      `alter table "slope" add column "area" geography(Polygon, 4326) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "poi" drop column "area";`);

    this.addSql(`alter table "slope" drop column "area";`);

    this.addSql(
      `alter table "slope" add column "path" geography(LineString, 4326) null;`,
    );
  }
}
