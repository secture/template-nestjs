import { Migration } from '@mikro-orm/migrations';

export class Migration20250117112415 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "refresh_token" ("id" uuid not null, "user_id" uuid not null, "token" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "expires_at" timestamptz not null, "is_revoked" boolean not null default false, "device_info" varchar(255) not null, constraint "refresh_token_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(`alter table "user" add column "_apple_id" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "refresh_token" cascade;`);

    this.addSql(`alter table "user" drop column "_apple_id";`);
  }
}
