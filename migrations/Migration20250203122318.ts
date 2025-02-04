import { Migration } from '@mikro-orm/migrations';

export class Migration20250203122318 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "resort" alter column "location" type geography(Point, 4326) using ("location"::geography(Point, 4326));`,
    );

    this.addSql(
      `alter table "user" add column "phone" varchar(255) null, add column "phone_verified" boolean not null default false;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "resort" alter column "location" type geography using ("location"::geography);`,
    );

    this.addSql(
      `alter table "user" drop column "phone", drop column "phone_verified";`,
    );
  }
}
