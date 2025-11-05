import {
  calculateRevenueMarginAndProfit,
  createConsultantAssignmentObject,
  checkName,
  sortByName,
  getAssignmentMonth,
} from '../app/utilities/helpers/helpers';
import {
  Client,
  Consultant,
  ConsultantAssignment,
  Partner,
} from '@/app/core/types/types';

// Test data interfaces
interface TestEntity {
  name: string;
  id?: number;
}

interface TestConsultantAssignment {
  hourly_rate?: number;
  hours_worked?: number;
  cost_fulltime?: number;
}

describe('Helper Functions', () => {
  describe('calculateRevenueMarginAndProfit', () => {
    it('calculates correct values with valid inputs', () => {
      const assignment: TestConsultantAssignment = {
        hourly_rate: 100,
        hours_worked: 40,
        cost_fulltime: 50,
      };

      const result = calculateRevenueMarginAndProfit(
        assignment as ConsultantAssignment
      );

      expect(result.totalRevenue).toBe(4000);
      expect(result.profit).toBe(2000);
      expect(result.margin).toBe(50); // ((4000-2000)/4000)*100 = 50%
    });

    it('handles zero hourly rate', () => {
      const assignment: TestConsultantAssignment = {
        hourly_rate: 0,
        hours_worked: 40,
        cost_fulltime: 50,
      };

      const result = calculateRevenueMarginAndProfit(
        assignment as ConsultantAssignment
      );

      expect(result.totalRevenue).toBe(0);
      expect(result.margin).toBe(0);
      expect(result.profit).toBe(0);
    });

    it('handles undefined values', () => {
      const assignment: TestConsultantAssignment = {
        hourly_rate: undefined,
        hours_worked: undefined,
      };

      const result = calculateRevenueMarginAndProfit(
        assignment as ConsultantAssignment
      );

      expect(result.totalRevenue).toBe(0);
      expect(result.margin).toBe(0);
      expect(result.profit).toBe(0);
    });

    it('handles partial assignment object', () => {
      const assignment = {} as ConsultantAssignment;

      const result = calculateRevenueMarginAndProfit(assignment);

      expect(result.totalRevenue).toBe(0);
      expect(result.margin).toBe(0);
      expect(result.profit).toBe(0);
    });
  });

  describe('createConsultantAssignmentObject', () => {
    it('returns object with all undefined properties', () => {
      const result = createConsultantAssignmentObject();

      expect(result).toEqual({
        consultant_id: undefined,
        client_id: undefined,
        partner_id: undefined,
        month: undefined,
        cost_fulltime: undefined,
        hourly_rate: undefined,
        hours_worked: undefined,
        total_revenue: undefined,
        margin_percent: undefined,
        profit: undefined,
      });
    });
  });

  describe('checkName', () => {
    it('finds entity by name (case insensitive)', () => {
      const entities: TestEntity[] = [
        { name: 'John Doe', id: 1 },
        { name: 'Jane Smith', id: 2 },
      ];

      const result = checkName(entities, 'john doe');

      expect(result).toEqual({ name: 'John Doe', id: 1 });
    });

    it('returns undefined when name not found', () => {
      const entities: TestEntity[] = [{ name: 'John Doe', id: 1 }];

      const result = checkName(entities, 'Unknown Name');

      expect(result).toBeUndefined();
    });

    it('handles empty array', () => {
      const result = checkName([], 'Any Name');

      expect(result).toBeUndefined();
    });

    it('trims whitespace from search name', () => {
      const entities: TestEntity[] = [{ name: 'John Doe', id: 1 }];

      const result = checkName(entities, '  john doe  ');

      expect(result).toEqual({ name: 'John Doe', id: 1 });
    });
  });

  describe('sortByName', () => {
    it('sorts entities alphabetically by name', () => {
      const entities: Client[] = [
        { name: 'Charlie', client_id: 3 } as Client,
        { name: 'Alice', client_id: 1 } as Client,
        { name: 'Bob', client_id: 2 } as Client,
      ];

      sortByName(entities);

      expect(entities[0].name).toBe('Alice');
      expect(entities[1].name).toBe('Bob');
      expect(entities[2].name).toBe('Charlie');
    });

    it('handles case insensitive sorting', () => {
      const entities: Consultant[] = [
        { name: 'charlie', consultant_id: 3 } as Consultant,
        { name: 'Alice', consultant_id: 1 } as Consultant,
        { name: 'bob', consultant_id: 2 } as Consultant,
      ];

      sortByName(entities);

      expect(entities[0].name).toBe('Alice');
      expect(entities[1].name).toBe('bob');
      expect(entities[2].name).toBe('charlie');
    });

    it('handles empty names', () => {
      const entities: Partner[] = [
        { name: 'Charlie', partner_id: 3 } as Partner,
        { name: '', partner_id: 1 } as Partner,
        { name: 'Bob', partner_id: 2 } as Partner,
      ];

      sortByName(entities);

      // The one with empty name should come last due to the sort logic
      expect(entities[2].name).toBe('');
    });
  });

  describe('getAssignmentMonth', () => {
    it('returns correct month name for valid value', () => {
      expect(getAssignmentMonth('0')).toBe('Januari');
      expect(getAssignmentMonth('5')).toBe('Juni');
      expect(getAssignmentMonth('11')).toBe('December');
    });

    it('returns empty string for invalid value', () => {
      expect(getAssignmentMonth('12')).toBe('');
      expect(getAssignmentMonth('invalid')).toBe('');
      expect(getAssignmentMonth('-1')).toBe('');
    });

    it('returns empty string for out of bounds values', () => {
      expect(getAssignmentMonth('100')).toBe('');
      expect(getAssignmentMonth('')).toBe('');
    });
  });
});
