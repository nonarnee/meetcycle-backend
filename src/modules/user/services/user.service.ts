import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { UserRole } from '../types/user-role.type';
import { LeanDocument } from 'src/common/types/lean.type';
import { saveAndLean } from 'src/common/helper/lean.helper';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<LeanDocument<User>[]> {
    return await this.userModel.find().lean<LeanDocument<User>[]>().exec();
  }

  async findOne(id: string): Promise<LeanDocument<User> | null> {
    return await this.userModel.findById(id).lean<LeanDocument<User>>().exec();
  }

  async findByEmail(email: string): Promise<LeanDocument<User> | null> {
    return await this.userModel
      .findOne({ email })
      .lean<LeanDocument<User>>()
      .exec();
  }

  async create(user: Omit<User, 'role'>) {
    await this._throwIfEmailExists(user.email);
    const hashed = await this._hashPassword(user.password);
    return this._createUser({ ...user, password: hashed });
  }

  private async _throwIfEmailExists(email: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다');
    }
  }

  private async _hashPassword(password: string) {
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
    return bcrypt.hash(password, salt);
  }

  private async _createUser(user: Omit<User, 'role'> & { password: string }) {
    return saveAndLean(
      new this.userModel({
        ...user,
        role: UserRole.PARTICIPANT,
      }),
    );
  }

  async update(id: string, user: User): Promise<LeanDocument<User> | null> {
    return this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .lean<LeanDocument<User>>()
      .exec();
  }

  async remove(id: string): Promise<LeanDocument<User> | null> {
    return this.userModel
      .findByIdAndDelete(id)
      .lean<LeanDocument<User>>()
      .exec();
  }
}
