import { HeaderInterface, RequestForm } from '../../interfaces/interfaces.vm';
import { RequestDto } from '../../interfaces/interfaces.dto';

export class WorkPageHelper {
  static translateFormDataToRequestDto(data: RequestForm): RequestDto {
    const { type, url, body, headers: headersForm } = data;
    const headers: string[] = headersForm.map((header: HeaderInterface) => `${header.key}: ${header.value}`);
    
    return { type, url, body, headers };
  }
}
