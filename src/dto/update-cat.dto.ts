export class UpdateCatDto {
  readonly name: string;
  readonly age: number;

  static fromBody(body: any): UpdateCatDto {
    return {
      name: body.name,
      age: body.age,
    };
  }
}
