// --- Garage Types ---
export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface GarageResponse {
  cars: Car[];
  totalCount: number;
}

export interface CarCreateParams {
  name: string;
  color: string;
}

// --- Engine Types ---
export type EngineStatus = 'started' | 'stopped' | 'drive';

export interface EngineStartResponse {
  velocity: number;
  distance: number;
}

export interface EngineDriveResponse {
  success: boolean;
}

// --- Winners Types ---
export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export type WinnersSort = 'id' | 'wins' | 'time';
export type WinnersOrder = 'ASC' | 'DESC';

export interface WinnersParams {
  page: number;
  limit?: number;
  sort?: WinnersSort;
  order?: WinnersOrder;
}

export interface WinnersResponse {
  winners: Winner[];
  totalCount: number;
}
