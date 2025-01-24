import { Webcam } from '../entities/webcam.entity';

export interface WebcamRepository {
  findById(id: string): Promise<Webcam | null>;
  findByResort(resortId: string): Promise<Webcam[]>;
  save(webcam: Webcam): Promise<void>;
  delete(webcam: Webcam): Promise<void>;
}
