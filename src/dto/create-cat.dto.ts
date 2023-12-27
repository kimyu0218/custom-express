export class CreateCatDto {
  readonly name: string;
  readonly age: number;

  static fromBody(body: any): CreateCatDto {
    return {
      name: body.name,
      age: body.age,
    };
  }
}
