import { HttpRequest, HttpResponse, METHODS } from '@kimyu0218/custom-http';
import parseParam from '@kimyu0218/custom-http/dist/http/utils/parsers/param.parser';
import catsController from 'src/controller/cats.controller';
import { Router, router } from '../../index';

const catsRouter: Router = router();

catsRouter.setRoute(METHODS.POST, '', (req: HttpRequest, res: HttpResponse) => {
  catsController.create(req, res);
});

catsRouter.setRoute(METHODS.GET, '', (req: HttpRequest, res: HttpResponse) => {
  catsController.findAll(req, res);
});

catsRouter.setRoute(
  METHODS.GET,
  '/:id',
  (req: HttpRequest, res: HttpResponse) => {
    catsController.find(req, res);
  },
);

catsRouter.setRoute(
  METHODS.PATCH,
  '/:id',
  (req: HttpRequest, res: HttpResponse) => {
    catsController.update(req, res);
  },
);

catsRouter.setRoute(
  METHODS.DELETE,
  '/:id',
  (req: HttpRequest, res: HttpResponse) => {
    catsController.delete(req, res);
  },
);

export default catsRouter;
