export class Session {
  private session: Map<string, any> = new Map();

  generateSession(key: string, sessionData: any): void {
    this.session.set(key, sessionData);
  }

  getSession(key: string): any | null {
    return this.session.get(key) ?? null;
  }

  deleteSession(sid: string): void {
    this.session.delete(sid);
  }
}

export const session: Session = new Session();
