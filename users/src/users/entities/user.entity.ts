import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
  @Column({ unique: true })
  email!: string

  @Column({ name: 'first_name' })
  firstName!: string

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'last_name' })
  lastName!: string

  @Column({ name: 'mobile_number', unique: true })
  mobileNumber!: string

  @Column()
  password!: string
}
