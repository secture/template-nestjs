import { Migration } from '@mikro-orm/migrations';

export class Migration20250212084032 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "pois" drop constraint "pois_resort_id_foreign";`);

    this.addSql(`alter table "pois" rename column "resort_id" to "resortId";`);
    this.addSql(
      `alter table "pois" add constraint "pois_resortId_foreign" foreign key ("resortId") references "resort" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "pois" drop constraint "pois_resortId_foreign";`);

    this.addSql(`alter table "pois" rename column "resortId" to "resort_id";`);
    this.addSql(
      `alter table "pois" add constraint "pois_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );
  }
}
