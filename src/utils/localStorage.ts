export class LocalStorage {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  set(key: string, value: any): void {
    localStorage.setItem(this.getKey(key), JSON.stringify(value));
  }

  get(key: string): any {
    const value = localStorage.getItem(this.getKey(key));
    return value ? JSON.parse(value) : null;
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}
