import { createConnection, DriverOptions, Connection } from "typeorm";
import { Phone } from "./phone";

export function connect(driver: DriverOptions): Promise<Connection> {
  return createConnection({
    driver: Object.assign(driver),
    entities: [
      Phone,
    ],
    autoSchemaSync: false,
  });
}
