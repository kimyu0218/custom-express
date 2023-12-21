import { CustomError } from '../custom-error';

export class FileAccessError extends CustomError {
  constructor() {
    super(403, 'Permission denied');
  }
}
