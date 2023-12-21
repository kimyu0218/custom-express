import { CustomError } from '../custom-error';

export class FileNotFoundError extends CustomError {
  constructor() {
    super(404, 'No such file');
  }
}
