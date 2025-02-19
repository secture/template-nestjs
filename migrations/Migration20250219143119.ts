import { Migration } from '@mikro-orm/migrations';

export class Migration20250219143119 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "lift" drop column "location";`);

    this.addSql(
      `alter table "lift" alter column "path" type geography(LineString, 4326) using ("path"::geography(LineString, 4326));`,
    );
    this.addSql(`alter table "lift" alter column "path" set not null;`);

    this.addSql(
      `alter table "slope" drop column "location", drop column "area";`,
    );

    this.addSql(
      `alter table "slope" add column "path" geography(LineString, 4326) not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "lift" add column "location" geography(Point, 4326) not null;`,
    );
    this.addSql(
      `alter table "lift" alter column "path" type geography(LineString, 4326) using ("path"::geography(LineString, 4326));`,
    );
    this.addSql(`alter table "lift" alter column "path" drop not null;`);

    this.addSql(`alter table "slope" drop column "path";`);

    this.addSql(
      `alter table "slope" add column "location" geography(Point, 4326) not null, add column "area" geography(Polygon, 4326) null;`,
    );
  }
}
