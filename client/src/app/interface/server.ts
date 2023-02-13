import { Status } from './../enums/status.enum';

export interface Server {
  id: number;
  ipAddress: string;
  name: string;
  memory: string;
  type: string;
  imgUrl: string;
  status: Status;
}
