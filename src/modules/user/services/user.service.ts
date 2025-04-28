import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { UserRole } from '../types/user-role.type';
import { LeanSchema } from 'src/common/types/lean.type';
import { saveAndLean } from 'src/common/helper/lean.helper';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<LeanSchema<User>[]> {
    return await this.userModel.find().lean<LeanSchema<User>[]>().exec();
  }

  async findOne(id: string): Promise<LeanSchema<User> | null> {
    return await this.userModel.findById(id).lean<LeanSchema<User>>().exec();
  }

  async findByEmail(email: string): Promise<LeanSchema<User> | null> {
    return await this.userModel
      .findOne({ email })
      .lean<LeanSchema<User>>()
      .exec();
  }

  async create(user: Omit<User, 'role'>): Promise<User> {
    // 이메일 중복 확인
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다');
    }

    // 비밀번호 암호화
    console.log('round:', process.env.BCRYPT_SALT_ROUNDS);
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
    const hashed = await bcrypt.hash(user.password, salt);

    // 유저 생성
    const createdUser = await saveAndLean(
      new this.userModel({
        ...user,
        password: hashed,
        role: UserRole.PARTICIPANT,
      }),
    );

    return createdUser;
  }

  async update(id: string, user: User): Promise<LeanSchema<User> | null> {
    return this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .lean<LeanSchema<User>>()
      .exec();
  }

  async remove(id: string): Promise<LeanSchema<User> | null> {
    return this.userModel.findByIdAndDelete(id).lean<LeanSchema<User>>().exec();
  }
}
