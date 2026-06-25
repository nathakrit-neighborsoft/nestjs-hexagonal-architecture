import { UserEntity } from 'src/users/adapters/outbounds/user.entity';
import type { UserId } from 'src/users/applications/domains/user.domain';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type {
  ExpenseAmount,
  ExpenseCategory,
  ExpenseCreatedAt,
  ExpenseDate,
  ExpenseId,
  ExpenseNotes,
  ExpenseTitle,
  ExpenseUpdatedAt,
} from '../../applications/domains/expense.domain';

export const expensesTableName = 'expenses';

@Entity({
  name: expensesTableName,
})
@Index(['userId'])
@Index(['userId', 'category'])
@Index(['userId', 'date'])
@Index(['userId', 'category', 'date'])
export class ExpenseEntity {
  @PrimaryColumn({
    type: 'uuid',
    name: 'uuid',
    default: 'gen_random_uuid()',
  })
  uuid: ExpenseId;

  @Column({
    type: 'varchar',
  })
  title: ExpenseTitle;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: ExpenseAmount;

  @Column({
    type: 'date',
  })
  date: ExpenseDate;

  @Column({
    type: 'varchar',
  })
  category: ExpenseCategory;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: ExpenseNotes;

  @Column({
    type: 'uuid',
    name: 'user_id',
  })
  userId: UserId;

  @ManyToOne('UserEntity', 'expenses', {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @CreateDateColumn()
  declare createdAt: ExpenseCreatedAt;

  @UpdateDateColumn()
  declare updatedAt: ExpenseUpdatedAt;
}
