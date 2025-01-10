import { Webcam } from '../entities/webcam.entity';
import { Id } from '../value-objects/id.value-object';

export interface WebcamRepository {
  findById(id: Id): Promise<Webcam | null>;
  findByResort(resortId: Id): Promise<Webcam[]>;
  save(webcam: Webcam): Promise<void>;
  delete(webcam: Webcam): Promise<void>;
}
