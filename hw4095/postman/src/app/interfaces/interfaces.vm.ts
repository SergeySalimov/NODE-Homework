import { RequestTypeEnum } from './constant';

export interface HeadersInterface {
  key: string;
  value: string;
}

export interface RequestForm {
  url: string;
  type: RequestTypeEnum;
  headers: HeadersInterface;
  body: string;
}
