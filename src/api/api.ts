import type {
  Car,
  CarCreateParams,
  EngineStatus,
  EngineStartResponse,
  EngineDriveResponse,
  Winner,
  WinnersParams,
  WinnersResponse,
} from '../types';

const BASE_URL = 'http://127.0.0.1:3000';
const CARS_LIMIT = 7;
const WINNERS_LIMIT = 10;

export const api = {
  async getCars(page: number, limit = CARS_LIMIT): Promise<{ items: Car[]; count: number }> {
    const res = await fetch(`${BASE_URL}/garage?_page=${page}&_limit=${limit}`);
    const items = await res.json();
    const count = Number(res.headers.get('X-Total-Count') || '0');
    return { items, count };
  },

  async getCar(id: number): Promise<Car> {
    const res = await fetch(`${BASE_URL}/garage/${id}`);
    if (!res.ok) throw new Error('Car not found');
    return res.json();
  },

  async createCar(car: CarCreateParams): Promise<Car> {
    const res = await fetch(`${BASE_URL}/garage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car),
    });
    if (!res.ok) throw new Error('Failed to create car');
    return res.json();
  },

  async deleteCar(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/garage/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete car');
  },

  async updateCar(id: number, car: CarCreateParams): Promise<Car> {
    const res = await fetch(`${BASE_URL}/garage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car),
    });
    if (!res.ok) throw new Error('Failed to update car');
    return res.json();
  },

  async toggleEngine(id: number, status: Exclude<EngineStatus, 'drive'>): Promise<EngineStartResponse> {
    const res = await fetch(`${BASE_URL}/engine?id=${id}&status=${status}`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to change engine status');
    return res.json();
  },

  async driveCar(id: number): Promise<EngineDriveResponse> {
    const res = await fetch(`${BASE_URL}/engine?id=${id}&status=drive`, { method: 'PATCH' });
    if (res.status === 500) return { success: false };
    if (!res.ok) throw new Error('Drive mode request failed');
    return res.json();
  },

  async getWinners({ page, limit = WINNERS_LIMIT, sort = 'id', order = 'ASC' }: WinnersParams): Promise<WinnersResponse> {
    const query = `_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`;
    const res = await fetch(`${BASE_URL}/winners?${query}`);
    if (!res.ok) throw new Error('Failed to fetch winners');
    return {
      winners: await res.json(),
      totalCount: Number(res.headers.get('X-Total-Count') || '0'),
    };
  },

  async getWinner(id: number): Promise<Winner> {
    const res = await fetch(`${BASE_URL}/winners/${id}`);
    if (!res.ok) throw new Error('Winner not found');
    return res.json();
  },

  async createWinner(body: { id: number; wins: number; time: number }): Promise<void> {
    await fetch(`${BASE_URL}/winners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },

  async deleteWinner(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/winners/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete winner');
  },

  async updateWinner(id: number, body: { wins: number; time: number }): Promise<void> {
    await fetch(`${BASE_URL}/winners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
};