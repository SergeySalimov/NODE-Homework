import { RequestTypeEnum } from './constant';

export interface RequestDto {
  type: RequestTypeEnum;
  url: string;
  headers: string[];
  body?: string;
}
