import { Migration } from '@mikro-orm/migrations';

export class Migration20250218132643 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "lift" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "type" text check ("type" in ('chairlift', 'gondolaLift', 'platter', 'magicCarpet', 'T-bar', 'skiCable', 'detachableChairlift', 'ropeTow')) not null, "location" geography(Point, 4326) not null, "capacity" int not null, "resort_id" uuid not null, "status" text check ("status" in ('active', 'inactive', 'maintenance')) not null, "path" geography(LineString, 4326) null, constraint "lift_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "lift" add constraint "lift_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );

    this.addSql(`alter table "poi" drop column "area";`);

    this.addSql(`alter table "slope" drop column "area";`);

    this.addSql(
      `alter table "slope" add column "path" geography(LineString, 4326) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "lift" cascade;`);

    this.addSql(
      `alter table "poi" add column "area" geography(Polygon, 4326) null;`,
    );

    this.addSql(`alter table "slope" drop column "path";`);

    this.addSql(
      `alter table "slope" add column "area" geography(Polygon, 4326) null;`,
    );
  }
}
