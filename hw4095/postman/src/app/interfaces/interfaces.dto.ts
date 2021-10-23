import { RequestTypeEnum } from './constant';

export interface RequestDto {
  type: RequestTypeEnum;
  url: string;
  headers: Record<string, string> | null;
  body?: string;
  query?: string[];
}

export interface ResponseDto {
  status: number;
  statusText: string;
  url: string;
  contentType: string;
  headers: string[];
  responseText: string;
}

export interface History {
  id: string;
  type: RequestTypeEnum;
  date: Date;
}

export type HistoryDto = Array<History>;
// export interface HistoryDto {
//   content: History[];
// }
