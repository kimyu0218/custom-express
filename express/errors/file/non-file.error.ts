import { CustomError } from '../custom-error';

export class NonFileError extends CustomError {
  constructor() {
    super(400, 'Illegal operation on a directory');
  }
}
