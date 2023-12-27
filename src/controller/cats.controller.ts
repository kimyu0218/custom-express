import {
  CONTENT_TYPE,
  HttpRequest,
  HttpResponse,
} from '@kimyu0218/custom-http';
import { CustomError } from 'express/errors/custom-error';
import { Cat } from 'src/entities/cat.entity';
import { CatsService, catsService } from 'src/service/cats.service';

class CatsController {
  constructor(private readonly catsService: CatsService) {}

  create(req: HttpRequest, res: HttpResponse): void {
    const body: any = req.getMessageBody();
    if (!body) {
      return res.throwError(400).send();
    }
    this.catsService.create(body);
    return res.setStatusCode(201).send();
  }

  findAll(req: HttpRequest, res: HttpResponse): void {
    const cats: Cat[] = this.catsService.findAll();
    res
      .setMessageBody(cats)
      .setHeader('Content-Type', CONTENT_TYPE.JSON)
      .send();
  }

  find(req: HttpRequest, res: HttpResponse): void {
    try {
      const id: string = req.getParam('id');
      if (!id) {
        throw new CustomError(400, 'Bad Request');
      }
      const cat: Cat = this.catsService.find(parseInt(id));
      res
        .setMessageBody(cat)
        .setHeader('Content-Type', CONTENT_TYPE.JSON)
        .send();
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        return res.throwError(err.code, err.message).send();
      }
      res.throwError(500).send();
    }
  }

  update(req: HttpRequest, res: HttpResponse) {
    try {
      const id: string = req.getParam('id');
      const body: any = req.getMessageBody();
      if (!id || !body) {
        throw new CustomError(400, 'Bad Request');
      }
      this.catsService.update(parseInt(id), body);
      res.send();
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        return res.throwError(err.code, err.message).send();
      }
      res.throwError(500).send();
    }
  }

  delete(req: HttpRequest, res: HttpResponse): void {
    try {
      const id: string = req.getParam('id');
      if (!id) {
        throw new CustomError(400, 'Bad Request');
      }
      this.catsService.delete(parseInt(id));
      res.send();
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        return res.throwError(err.code, err.message).send();
      }
      res.throwError(500).send();
    }
  }
}

const catsController: CatsController = new CatsController(catsService);
export default catsController;
