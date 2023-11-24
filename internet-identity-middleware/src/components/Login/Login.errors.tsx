export class PageParamsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PageParamsError";
  }
}
