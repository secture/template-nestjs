import { Migration } from '@mikro-orm/migrations';

export class Migration20250127113104 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "resort" add column "location" geography(Point, 4326) not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "resort" drop column "location";`);
  }
}
