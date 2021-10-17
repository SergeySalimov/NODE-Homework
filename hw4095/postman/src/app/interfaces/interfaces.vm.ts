import { RequestTypeEnum } from './constant';

export interface HeaderInterface {
  key: string;
  value: string;
}

export interface RequestForm {
  url: string;
  type: RequestTypeEnum;
  headers: HeaderInterface[];
  body: string;
}
