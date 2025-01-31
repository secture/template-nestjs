import { Migration } from '@mikro-orm/migrations';

export class Migration20250130084254 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "resort" add column "country" varchar(255) not null;`,
    );
    this.addSql(
      `alter table "resort" alter column "location" type geography(Point, 4326) using ("location"::geography(Point, 4326));`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "resort" drop column "country";`);

    this.addSql(
      `alter table "resort" alter column "location" type geography using ("location"::geography);`,
    );
  }
}
