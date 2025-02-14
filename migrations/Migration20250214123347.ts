import { Migration } from '@mikro-orm/migrations';

export class Migration20250214123347 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "slope" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "difficulty" text check ("difficulty" in ('novice', 'easy', 'intermediate', 'advanced', 'freeride')) not null, "location" geography(Point, 4326) not null, "length" numeric(10,0) not null, "resort_id" uuid not null, "status" text check ("status" in ('open', 'close', 'maintenance')) not null, constraint "slope_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "slope" add constraint "slope_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "resort" alter column "location" type geography(Point, 4326) using ("location"::geography(Point, 4326));`,
    );

    this.addSql(`alter table "news" add column "image" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "slope" cascade;`);

    this.addSql(`alter table "news" drop column "image";`);

    this.addSql(
      `alter table "resort" alter column "location" type geography using ("location"::geography);`,
    );
  }
}
