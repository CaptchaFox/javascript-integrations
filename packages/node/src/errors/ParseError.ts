type ParseErrorProps = {
  code?: number;
  message: string;
  body: string;
};

export class ParseError extends Error {
  public code;
  public body;

  constructor({ code, message, body }: ParseErrorProps) {
    super(message);
    this.code = code;
    this.body = body;
  }
}
