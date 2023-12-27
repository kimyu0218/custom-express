import { CreateCatDto } from 'src/dto/create-cat.dto';

export class Cat {
  id: number;
  name: string;
  age: number;

  static fromDto(dto: CreateCatDto): Cat {
    return {
      id: idx++,
      name: dto.name,
      age: dto.age,
    };
  }
}

let idx = 0;

export const cats: Cat[] = [];
