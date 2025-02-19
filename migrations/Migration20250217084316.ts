import { Migration } from '@mikro-orm/migrations';

export class Migration20250217084316 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "poi" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "type" text check ("type" in ('restrooms', 'parking', 'information', 'medical_center', 'equipment_rental', 'shops', 'schools', 'restaurants', 'play_areas')) not null, "location" geography(Point, 4326) not null, "description" varchar(255) not null, "resort_id" uuid not null, "area" geography(Polygon, 4326) null, constraint "poi_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "poi" add constraint "poi_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "slope" add column "area" geography(Polygon, 4326) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "poi" cascade;`);

    this.addSql(`alter table "slope" drop column "area";`);
  }
}
