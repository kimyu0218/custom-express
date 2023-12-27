import {
  CONTENT_TYPE,
  HttpMethods,
  HttpRequest,
  HttpResponse,
  InvalidRequestLineError,
  METHODS,
} from '@kimyu0218/custom-http';
import { Server, Socket, createServer } from 'net';
import { CustomError } from './errors/custom-error';
import { Router } from './router';
import { getContentType, isHtml, isStaticFile, render } from './static-file';

export class Express extends Router {
  private readonly server: Server;
  private middlewares: Map<string, any> = new Map();
  private root: string = 'static';

  constructor() {
    super();
    this.server = this.init();
  }

  init(): Server {
    return createServer((socket: Socket) => {
      socket.on('data', (data) => {
        try {
          const req: HttpRequest = new HttpRequest(data.toString());
          const res: HttpResponse = new HttpResponse(socket, req.getVersion());
          this.response(req, res);
        } catch (err: unknown) {
          if (err instanceof InvalidRequestLineError) {
            return this.sendRequestError(socket, err);
          }
          this.sendServerError(socket);
        }
      });
    });
  }

  listen(port: number): void {
    this.server.listen(port, () => {
      console.log(`HTTP server running on port ${port}`);
    });
  }

  /**
   * Set middlewares on base path
   * @param {string} basePath
   * @param {any} middleware
   */
  use(basePath: string, middleware: any): void {
    this.middlewares.set(basePath, middleware);
  }

  /**
   * Set root directory for serving static files
   * @param {string} root
   */
  setStatic(root: string): void {
    this.root = root;
  }

  private async next(
    req: HttpRequest,
    res: HttpResponse,
    middleware: any,
  ): Promise<boolean> {
    return await middleware(req, res);
  }

  /**
   * Execute router
   * @param {string} basePath - base path where the router is registered
   * @param {Router} router
   * @param {HttpRequest} req
   * @param {HttpResponse} res
   * @returns {void | Promise<void>}
   */
  private execRouter(
    basePath: string,
    router: Router,
    req: HttpRequest,
    res: HttpResponse,
  ): void | Promise<void> {
    const path: string = req.getPath();
    const method: HttpMethods = req.getMethod() as HttpMethods;
    if (method === METHODS.GET && isHtml(path)) {
      return this.getStaticFile(path, res);
    }
    const subPath: string = path.replace(`${basePath}`, ''); // remove base path and leave only sub path
    router.execCallback(method, subPath, req, res);
  }

  /**
   * Render home page
   * @param {HttpRequest} req
   * @param {HttpResponse} res
   */
  private renderHome(req: HttpRequest, res: HttpResponse): void {
    const home: Router = this.middlewares.get('/');
    home.get('', req, res);
  }

  private async response(req: HttpRequest, res: HttpResponse): Promise<void> {
    const path: string = req.getPath();
    const method: string = req.getMethod();
    if (method === METHODS.GET && (path === '/' || path === '/index.html')) {
      return this.renderHome(req, res);
    }
    if (method === METHODS.GET && isStaticFile(path)) {
      return this.getStaticFile(path, res);
    }
    this.execMiddleware(req, res);
  }

  private async execMiddleware(
    req: HttpRequest,
    res: HttpResponse,
  ): Promise<void> {
    const path: string = req.getPath();
    for (const basePath of this.middlewares.keys()) {
      const reg: RegExp = new RegExp(`^${basePath.replace('*', '')}`);
      if (reg.test(path)) {
        const middleware = this.middlewares.get(basePath);
        if (middleware?.get) {
          return this.execRouter(basePath, middleware, req, res);
        }
        const next: boolean = await this.next(req, res, middleware);
        if (!next) {
          return;
        }
      }
    }
    res.throwError(404).send();
  }

  private async getStaticFile(path: string, res: HttpResponse): Promise<void> {
    try {
      const type: string = getContentType(path);
      res
        .setHeader('Content-Type', CONTENT_TYPE[type])
        .setMessageBody(render(this.root, path))
        .send();
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        res.throwError(err.code, err.message).send();
      }
      res.throwError(500).send();
    }
  }

  private sendRequestError(socket: Socket, err: InvalidRequestLineError): void {
    const res: HttpResponse = new HttpResponse(socket, 'HTTP/1.1');
    res.throwError(err.code, err.message).send();
  }

  private sendServerError(socket: Socket): void {
    const res: HttpResponse = new HttpResponse(socket, 'HTTP/1.1');
    res.throwError(500).send();
  }
}

/**
 * Return express
 * @returns {Express}
 */
export function express(): Express {
  return new Express();
}
