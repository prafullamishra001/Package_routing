const { routeParcel } = require('../../src/services/routing.service');

describe('Routing Service', () => {
  describe('Mail Department routing', () => {
    it('should route parcels <= 1kg to Mail Department', () => {
      const parcel = { weight: 0.5, value: 500, destinationCountry: 'Germany' };
      const result = routeParcel(parcel);

      expect(result.department).toBe('Mail Department');
      expect(result.insuranceRequired).toBe(false);
      expect(result.reason).toContain('Weight <= 1 kg');
    });

    it('should route exactly 1kg to Mail Department', () => {
      const parcel = { weight: 1, value: 500, destinationCountry: 'Germany' };
      const result = routeParcel(parcel);

      expect(result.department).toBe('Mail Department');
      expect(result.reason).toContain('Weight <= 1 kg');
    });
  });

  describe('Regular Department routing', () => {
    it('should route parcels > 1kg and <= 10kg to Regular Department', () => {
      const parcel = { weight: 5, value: 500, destinationCountry: 'Germany' };
      const result = routeParcel(parcel);

      expect(result.department).toBe('Regular Department');
      expect(result.reason).toContain('Weight <= 10 kg');
    });

    it('should route exactly 10kg to Regular Department', () => {
      const parcel = { weight: 10, value: 500, destinationCountry: 'Germany' };
      const result = routeParcel(parcel);

      expect(result.department).toBe('Regular Department');
      expect(result.reason).toContain('Weight <= 10 kg');
    });
  });

  describe('Heavy Department routing', () => {
    it('should route parcels > 10kg to Heavy Department', () => {
      const parcel = { weight: 15, value: 500, destinationCountry: 'Germany' };
      const result = routeParcel(parcel);

      expect(result.department).toBe('Heavy Department');
      expect(result.reason).toContain('Weight > 10 kg');
    });
  });

  describe('Insurance requirement', () => {
    it('should require insurance for value > €1000', () => {
      const parcel = { weight: 5, value: 1500, destinationCountry: 'Germany' };
      const result = routeParcel(parcel);

      expect(result.insuranceRequired).toBe(true);
      expect(result.reason).toContain('Value > €1000');
    });

    it('should not require insurance for value <= €1000', () => {
      const parcel = { weight: 5, value: 1000, destinationCountry: 'Germany' };
      const result = routeParcel(parcel);

      expect(result.insuranceRequired).toBe(false);
      expect(result.reason).not.toContain('Value > €1000');
    });

    it('should require insurance for exactly €1000', () => {
      const parcel = { weight: 5, value: 1000.01, destinationCountry: 'Germany' };
      const result = routeParcel(parcel);

      expect(result.insuranceRequired).toBe(true);
    });
  });

  describe('Customs Department routing', () => {
    it('should route Switzerland to Customs Department', () => {
      const parcel = { weight: 5, value: 500, destinationCountry: 'Switzerland' };
      const result = routeParcel(parcel);

      expect(result.department).toBe('Customs Department');
      expect(result.reason).toContain('Destination is Switzerland');
    });

    it('should prioritize Customs over weight-based routing', () => {
      const parcel = { weight: 0.5, value: 500, destinationCountry: 'Switzerland' };
      const result = routeParcel(parcel);

      expect(result.department).toBe('Customs Department');
      expect(result.reason).toContain('Destination is Switzerland');
    });
  });

  describe('Combined rules', () => {
    it('should apply both weight and insurance rules', () => {
      const parcel = { weight: 5, value: 1500, destinationCountry: 'Germany' };
      const result = routeParcel(parcel);

      expect(result.department).toBe('Regular Department');
      expect(result.insuranceRequired).toBe(true);
      expect(result.reason).toContain('Weight <= 10 kg');
      expect(result.reason).toContain('Value > €1000');
    });

    it('should apply all three rules when applicable', () => {
      const parcel = { weight: 15, value: 1500, destinationCountry: 'Switzerland' };
      const result = routeParcel(parcel);

      expect(result.department).toBe('Customs Department');
      expect(result.insuranceRequired).toBe(true);
      expect(result.reason).toContain('Destination is Switzerland');
      expect(result.reason).toContain('Value > €1000');
    });
  });

  describe('Boundary values', () => {
    it('should handle weight boundary at 1kg', () => {
      const parcel1 = { weight: 0.99, value: 500, destinationCountry: 'Germany' };
      const parcel2 = { weight: 1.01, value: 500, destinationCountry: 'Germany' };

      const result1 = routeParcel(parcel1);
      const result2 = routeParcel(parcel2);

      expect(result1.department).toBe('Mail Department');
      expect(result2.department).toBe('Regular Department');
    });

    it('should handle weight boundary at 10kg', () => {
      const parcel1 = { weight: 9.99, value: 500, destinationCountry: 'Germany' };
      const parcel2 = { weight: 10.01, value: 500, destinationCountry: 'Germany' };

      const result1 = routeParcel(parcel1);
      const result2 = routeParcel(parcel2);

      expect(result1.department).toBe('Regular Department');
      expect(result2.department).toBe('Heavy Department');
    });

    it('should handle value boundary at €1000', () => {
      const parcel1 = { weight: 5, value: 999.99, destinationCountry: 'Germany' };
      const parcel2 = { weight: 5, value: 1000.01, destinationCountry: 'Germany' };

      const result1 = routeParcel(parcel1);
      const result2 = routeParcel(parcel2);

      expect(result1.insuranceRequired).toBe(false);
      expect(result2.insuranceRequired).toBe(true);
    });
  });
});
