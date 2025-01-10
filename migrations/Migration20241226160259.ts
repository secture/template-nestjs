import { Migration } from '@mikro-orm/migrations';

// Removed unnecessary empty line
export class Migration20241226160259 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "resort" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "logo" varchar(255) not null, "images" jsonb not null, "technical_data" jsonb not null, "description" varchar(255) not null, "contacts" jsonb not null, "services" jsonb not null, constraint "resort_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "news" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "resort_id" uuid not null, "title" varchar(255) not null, "description" varchar(255) not null, "url" varchar(255) not null, "date" timestamptz not null, constraint "news_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "user" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "surname" varchar(255) not null, "email" varchar(255) not null, constraint "user_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "weather" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "resort_id" uuid not null, "day" timestamptz not null, "today" jsonb not null, "weekly" jsonb not null, constraint "weather_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "weather" add constraint "weather_resort_id_unique" unique ("resort_id");`,
    );

    this.addSql(
      `create table "webcam" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "resort_id" uuid not null, "name" varchar(255) not null, "url" varchar(255) not null, "last_updated" timestamptz not null, constraint "webcam_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "news" add constraint "news_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "weather" add constraint "weather_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "webcam" add constraint "webcam_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "news" drop constraint "news_resort_id_foreign";`);

    this.addSql(
      `alter table "weather" drop constraint "weather_resort_id_foreign";`,
    );

    this.addSql(
      `alter table "webcam" drop constraint "webcam_resort_id_foreign";`,
    );

    this.addSql(`drop table if exists "resort" cascade;`);

    this.addSql(`drop table if exists "news" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "weather" cascade;`);

    this.addSql(`drop table if exists "webcam" cascade;`);
  }
}
