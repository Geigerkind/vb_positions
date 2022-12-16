export class LocalStorageService {
  static store(key: string, data: any): void {
    const jsonData = JSON.stringify(data);
    window.localStorage.setItem(key, jsonData);
  }

  static retrieve(key: string): any {
    const result = window.localStorage.getItem(key);
    if (!result) {
      return undefined;
    }
    return JSON.parse(result);
  }

  static remove(key: string): void {
    window.localStorage.removeItem(key);
  }
}
