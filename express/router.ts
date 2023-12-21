import { HttpMethods, HttpRequest, HttpResponse } from '@kimyu0218/custom-http';

export type Handler = (req: HttpRequest, res: HttpResponse) => any;
type Routes = Record<HttpMethods, Map<string, Handler>>;

export class Router {
  private routes: Routes = {
    GET: new Map(),
    HEAD: new Map(),
    PUT: new Map(),
    POST: new Map(),
    PATCH: new Map(),
    DELETE: new Map(),
    TRACE: new Map(),
    OPTIONS: new Map(),
  };

  /**
   * Set callback function on specific path
   * @param {HttpMethods} method
   * @param {string} path
   * @param {Handler} callback
   */
  setRoute(method: HttpMethods, path: string, callback: Handler): void {
    const route: Map<string, Handler> = this.routes[method];
    route.set(path, callback);
  }

  get(path: string, req: HttpRequest, res: HttpResponse): void {
    this.execCallback('GET', path, req, res);
  }

  head(path: string, req: HttpRequest, res: HttpResponse): void {
    this.execCallback('HEAD', path, req, res);
  }

  put(path: string, req: HttpRequest, res: HttpResponse): void {
    this.execCallback('PUT', path, req, res);
  }

  post(path: string, req: HttpRequest, res: HttpResponse): void {
    this.execCallback('POST', path, req, res);
  }

  patch(path: string, req: HttpRequest, res: HttpResponse): void {
    this.execCallback('PATCH', path, req, res);
  }

  delete(path: string, req: HttpRequest, res: HttpResponse): void {
    this.execCallback('DELETE', path, req, res);
  }

  trace(path: string, req: HttpRequest, res: HttpResponse): void {
    this.execCallback('TRACE', path, req, res);
  }

  options(path: string, req: HttpRequest, res: HttpResponse): void {
    this.execCallback('OPTIONS', path, req, res);
  }

  /**
   * Execute callback function
   * @param {HttpMethods} method
   * @param {string} path - URI
   * @param {HttpRequest} req
   * @param {HttpResponse} res
   */
  private execCallback(
    method: HttpMethods,
    path: string,
    req: HttpRequest,
    res: HttpResponse,
  ): void {
    const map: Map<string, Handler> = this.routes[method];
    const callback: Handler = this.getCallback(path, map);
    if (!callback) {
      return res.throwError(404).send();
    }
    callback(req, res);
  }

  /**
   * Get callback function corresponding to path
   * @param {string} path
   * @param {Map<string, Handler>} map - map[path]: callback
   * @returns {Handler}
   */
  private getCallback(path: string, map: Map<string, Handler>): Handler {
    for (const key in map) {
      const parsed: string = key.replace(/:[^\/]+/g, '([^/]+)'); // parse param
      const reg: RegExp = new RegExp(`^${parsed}$`);
      if (reg.test(path)) {
        return map.get(key);
      }
    }
    return null; // there is no callback function
  }
}

/**
 * Return router
 * @returns {Router}
 */
export function router(): Router {
  return new Router();
}
