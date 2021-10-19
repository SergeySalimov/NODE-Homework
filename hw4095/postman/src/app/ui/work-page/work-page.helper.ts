import { KeyValueInterface, RequestForm } from '../../interfaces/interfaces.vm';
import { RequestDto } from '../../interfaces/interfaces.dto';

export class WorkPageHelper {
  static translateFormDataToRequestDto(data: RequestForm): RequestDto {
    const { type, url, body, headers: headersForm } = data;
    let headers: Record<string, string> | null = {};
    headersForm.length === 0
      ? headers = null
      : headersForm.forEach((header: KeyValueInterface) => headers[header.key] = header.value);
    
    return {type, url, body, headers};
  }
}
