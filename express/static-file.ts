import fs from 'fs';
import path from 'path';
import { FileAccessError } from './errors/file/access.error';
import { NonFileError } from './errors/file/non-file.error';
import { FileNotFoundError } from './errors/file/not-found.error';

type FileExtension = 'js' | 'css' | 'ico' | 'png' | 'jpg' | 'svg';
type StaticDirName = 'javascripts' | 'stylesheets' | 'icon' | 'images';

const STATIC_DIR_NAME: Record<FileExtension, StaticDirName> = {
  js: 'javascripts',
  css: 'stylesheets',
  ico: 'icon',
  png: 'images',
  jpg: 'images',
  svg: 'images',
};

export function isStaticFile(url: string): boolean {
  const extname: string = getExtname(url);
  return STATIC_DIR_NAME[extname] ? true : false;
}

export function isHtml(url: string): boolean {
  const extname: string = getExtname(url);
  return extname === 'html';
}

export function getContentType(url: string): string {
  return getExtname(url).toUpperCase();
}

export function render(root: string, url: string): string {
  const sep: string = path.sep;
  const __dirname: string = path.resolve();
  const lastDirname: StaticDirName | null = getStaticDirName(url);

  const dirname: string = lastDirname
    ? `${path.join(__dirname, root)}${sep}${lastDirname}`
    : `${path.join(__dirname, 'views')}${sep}`;

  const file: string = path.normalize(`${dirname}${url}`);
  try {
    return fs.readFileSync(file).toString();
  } catch (err: unknown) {
    handleFileError(err);
  }
}

function getExtname(url: string): string {
  return path.extname(url).slice(1);
}

function getStaticDirName(url: string): StaticDirName | null {
  const extname: string = getExtname(url);
  return STATIC_DIR_NAME[extname];
}

function handleFileError(err: unknown): void {
  if (err instanceof Error) {
    if (err.message.includes('ENOENT')) {
      throw new FileNotFoundError();
    }
    if (err.message.includes('EACCES')) {
      throw new FileAccessError();
    }
    if (err.message.includes('EISDIR')) {
      throw new NonFileError();
    }
  }
  throw err;
}
