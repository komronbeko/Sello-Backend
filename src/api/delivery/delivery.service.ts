import { HttpException, Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryEntity } from 'src/infra/entities/delivery.entity';
import { DeliveryRepo } from 'src/infra/repos/delivery.repo';
import { PostamatRepo } from 'src/infra/repos/postamat.repo';
import { PostamatEntity } from 'src/infra/entities/postamat.entity';
import { UserAddressRepo } from 'src/infra/repos/user-address.repo';
import { UserAddressEntity } from 'src/infra/entities/user-adress.entity';
import { LocationEntity } from 'src/infra/entities/location.entity';
import { LocationRepo } from 'src/infra/repos/location.repo';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepo: DeliveryRepo,
    @InjectRepository(PostamatEntity)
    private readonly postamatRepo: PostamatRepo,
    @InjectRepository(UserAddressEntity)
    private readonly userAddressRepo: UserAddressRepo,
    @InjectRepository(LocationEntity)
    private readonly locationRepo: LocationRepo,
  ) {}

  async create(body: CreateDeliveryDto) {
    const { postamat_id, user_address_id, location_id } = body;
    const findPostamat = await this.postamatRepo.findOneBy({
      id: postamat_id,
    });

    const findUserAddress = await this.userAddressRepo.findOneBy({
      id: user_address_id,
    });

    const findLocation = await this.locationRepo.findOneBy({
      id: location_id,
    });

    if (!findPostamat) {
      throw new HttpException('Postamat ot found', 400);
    } else if (!findLocation) {
      throw new HttpException('Location ot found', 400);
    } else if (!findUserAddress) {
      throw new HttpException('User Address ot found', 400);
    }

    const newDelivery = await this.deliveryRepo.create(body);
    await this.deliveryRepo.save(newDelivery);

    return { message: 'success', data: newDelivery };
  }

  async findAll() {
    const data = await this.deliveryRepo.find({
      relations: ['postamat', 'user_address', 'location'],
    });

    return { message: 'success', data };
  }

  async findOne(id: number) {
    const findDelivery = await this.deliveryRepo.findOneBy({ id });

    if (!findDelivery) throw new HttpException('Delivery not found', 400);

    return { message: 'success', data: findDelivery };
  }

  async update(id: number, body: UpdateDeliveryDto) {
    const findDelivery = await this.deliveryRepo.findOneBy({ id });

    if (!findDelivery) throw new HttpException('Delivery not found', 400);

    await this.deliveryRepo.update(id, body);
    return { message: 'success' };
  }

  async remove(id: number) {
    const findDelivery = await this.deliveryRepo.findOneBy({ id });

    if (!findDelivery) throw new HttpException('Delivery not found', 400);

    await this.deliveryRepo.delete(id);

    return { message: 'success' };
  }
}
