import { Status } from "../enums/status.enum";

export type ServerFormValues = {
  ipAddress: string;
  name: string;
  memory: string;
  type: string;
  status: Status;
};
