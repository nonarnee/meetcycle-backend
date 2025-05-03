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
    // 이메일 중복 확인
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다');
    }

    // 비밀번호 암호화
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
