// custom error with status code
class DataError extends Error {
  public httpStatusCode: number;

  constructor(err: string, code: number) {
    super(err);
    this.httpStatusCode = code;
  }
}

export default DataError;
