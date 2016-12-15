import "reflect-metadata";
import { createConnection, DriverOptions, Connection } from "typeorm";
import { Phone } from "./phone";
import { args } from './args';

let driver: DriverOptions = {
  type: 'postgres',
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "phone",
};

export const conn: Promise<Connection> = createConnection({
  driver: Object.assign(driver, args.driver),
  entities: [
    Phone,
  ],
  autoSchemaSync: false,
});
