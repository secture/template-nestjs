import { Migration } from '@mikro-orm/migrations';

export class Migration20250220073348 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      ` create type "resort_services" as enum ('slopes', 'lifts', 'restrooms', 'parking', 'information', 'medical_center', 'equipment_rental', 'shops', 'schools', 'restaurants', 'play_areas', 'other');`,
    );
    this.addSql(
      `create type "poi_type" as enum ('restrooms', 'parking', 'information', 'medical_center', 'equipment_rental', 'shops', 'schools', 'restaurants', 'play_areas', 'other');`,
    );
    this.addSql(
      `create type "lift_type" as enum ('chairlift', 'gondolaLift', 'platter', 'magicCarpet', 'T-bar', 'skiCable', 'detachableChairlift', 'ropeTow');`,
    );
    this.addSql(
      `create type "lift_status" as enum ('active', 'inactive', 'maintenance');`,
    );
    this.addSql(
      `create type "slope_difficulty" as enum ('novice', 'easy', 'intermediate', 'advanced', 'freeride');`,
    );
    this.addSql(
      `create type "slope_status" as enum ('open', 'close', 'maintenance');`,
    );
    this.addSql(
      `create table "resort" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "logo" varchar(255) not null, "images" text[] not null, "technical_data_kilometers_of_tracks" int not null, "technical_data_number_of_lifts" int not null, "technical_data_number_of_tracks" int not null, "description" varchar(255) not null, "_contacts" jsonb not null, "services" "resort_services"[] not null, "location" geography(Point, 4326) not null, "country" varchar(255) not null, constraint "resort_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "poi" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "type" "poi_type" not null, "location" geography(Point, 4326) not null, "description" varchar(255) not null, "resort_id" uuid not null, "area" geography(Polygon, 4326) null, constraint "poi_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "news" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "resort_id" uuid not null, "title" varchar(255) not null, "description" varchar(255) not null, "url" varchar(255) not null, "date" timestamptz not null, "image" varchar(255) not null, constraint "news_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "lift" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "type" "lift_type" not null, "capacity" int not null, "resort_id" uuid not null, "status" "lift_status" not null, "path" geography(LineString, 4326) not null, constraint "lift_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "slope" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "difficulty" "slope_difficulty" not null, "length" numeric(10,0) not null, "resort_id" uuid not null, "status" "slope_status" not null, "path" geography(LineString, 4326) not null, constraint "slope_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "user" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "surname" varchar(255) not null, "email" varchar(255) not null, "apple_id" varchar(255) null, "phone" varchar(255) null, "phone_verified" boolean not null default false, constraint "user_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "refresh_token" ("id" uuid not null, "user_id" uuid not null, "token" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "expires_at" timestamptz not null, "is_revoked" boolean not null default false, "device_info" varchar(255) not null, constraint "refresh_token_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "weather" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "resort_id" uuid not null, "day" date not null, "today" jsonb not null, "weekly" jsonb not null, constraint "weather_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "weather" add constraint "weather_resort_id_unique" unique ("resort_id");`,
    );

    this.addSql(
      `create table "webcam" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "resort_id" uuid not null, "name" varchar(255) not null, "url" varchar(255) not null, "last_updated" timestamptz not null, constraint "webcam_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "poi" add constraint "poi_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "news" add constraint "news_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "lift" add constraint "lift_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "slope" add constraint "slope_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "weather" add constraint "weather_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "webcam" add constraint "webcam_resort_id_foreign" foreign key ("resort_id") references "resort" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "poi" drop constraint "poi_resort_id_foreign";`);

    this.addSql(`alter table "news" drop constraint "news_resort_id_foreign";`);

    this.addSql(`alter table "lift" drop constraint "lift_resort_id_foreign";`);

    this.addSql(
      `alter table "slope" drop constraint "slope_resort_id_foreign";`,
    );

    this.addSql(
      `alter table "weather" drop constraint "weather_resort_id_foreign";`,
    );

    this.addSql(
      `alter table "webcam" drop constraint "webcam_resort_id_foreign";`,
    );

    this.addSql(
      `alter table "refresh_token" drop constraint "refresh_token_user_id_foreign";`,
    );

    this.addSql(`drop table if exists "resort" cascade;`);

    this.addSql(`drop table if exists "poi" cascade;`);

    this.addSql(`drop table if exists "news" cascade;`);

    this.addSql(`drop table if exists "lift" cascade;`);

    this.addSql(`drop table if exists "slope" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "refresh_token" cascade;`);

    this.addSql(`drop table if exists "weather" cascade;`);

    this.addSql(`drop table if exists "webcam" cascade;`);

    this.addSql(`drop type "resort_services";`);
    this.addSql(`drop type "poi_type";`);
    this.addSql(`drop type "lift_type";`);
    this.addSql(`drop type "lift_status";`);
    this.addSql(`drop type "slope_difficulty";`);
    this.addSql(`drop type "slope_status";`);
  }
}
