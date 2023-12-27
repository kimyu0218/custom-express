import { CustomError } from 'express/errors/custom-error';
import { CreateCatDto } from 'src/dto/create-cat.dto';
import { UpdateCatDto } from 'src/dto/update-cat.dto';
import { Cat, cats } from 'src/entities/cat.entity';

export class CatsService {
  create(createCatDto: CreateCatDto): boolean {
    const newCat: Cat = Cat.fromDto(createCatDto);
    cats.push(newCat);
    return true;
  }

  findAll(): Cat[] {
    return cats;
  }

  find(id: number): Cat {
    const cat: Cat[] = cats.filter((cat: Cat) => id === cat.id);
    if (cat.length === 0) {
      throw new CustomError(404, 'Not Found');
    }
    return cat.at(0);
  }

  update(id: number, updateCatDto: UpdateCatDto): boolean {
    const idx: number = cats.findIndex((cat: Cat) => id === cat.id);
    if (idx === -1) {
      throw new CustomError(404, 'Not Found');
    }
    const updatedCat: Cat = { ...cats[idx], ...updateCatDto };
    cats[idx] = updatedCat;
    return true;
  }

  delete(id: number): boolean {
    const newCats: Cat[] = cats.filter((cat: Cat) => id !== cat.id);
    if (cats.length === newCats.length) {
      throw new CustomError(404, 'Not Found');
    }
    cats.length = 0;
    cats.push(...newCats);
    return true;
  }
}

export const catsService: CatsService = new CatsService();
