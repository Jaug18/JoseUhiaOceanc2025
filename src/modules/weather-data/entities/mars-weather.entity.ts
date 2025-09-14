import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('mars_weather')
export class MarsWeatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sol: number;

  @Column({ type: 'real', nullable: true })
  averageTemperature: number;

  @Column({ type: 'real', nullable: true })
  minTemperature: number;

  @Column({ type: 'real', nullable: true })
  maxTemperature: number;

  @Column({ type: 'real', nullable: true })
  pressure: number;

  @Column({ type: 'real', nullable: true })
  windSpeed: number;

  @Column({ nullable: true })
  season: string;

  @Column({ type: 'datetime', nullable: true })
  earthDate: Date;

  @Column({ type: 'datetime', nullable: true })
  lastUpdate: Date;

  @Column({ nullable: true })
  windDirection: string;

  @Column({ type: 'real', nullable: true })
  windDirectionDegrees: number;

  @Column({ type: 'integer', nullable: true })
  temperatureSamples: number;

  @Column({ type: 'integer', nullable: true })
  pressureSamples: number;

  @Column({ type: 'integer', nullable: true })
  windSpeedSamples: number;

  @Column({ type: 'boolean', default: true })
  isTemperatureValid: boolean;

  @Column({ type: 'boolean', default: true })
  isPressureValid: boolean;

  @Column({ type: 'boolean', default: true })
  isWindSpeedValid: boolean;

  @Column({ type: 'boolean', default: true })
  isWindDirectionValid: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
