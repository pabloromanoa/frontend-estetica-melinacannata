import { makeService } from '@/test/fixtures';
import { getTreatmentStep, nextTreatmentStepIndex, treatmentTotals } from './treatment-plan';

describe('treatment-plan', () => {
  const treatment = {
    services: [
      makeService({ id: 'a', price: 10000, depositAmount: 5000 }),
      makeService({ id: 'b', price: 6000, depositAmount: 3000 }),
    ],
  };

  it('devuelve el paso actual y si es el último', () => {
    expect(getTreatmentStep(treatment, 0)).toMatchObject({ stepIndex: 0, totalSteps: 2, isLast: false });
    expect(getTreatmentStep(treatment, 1)?.isLast).toBe(true);
    expect(getTreatmentStep(treatment, 5)).toBeNull();
  });

  it('calcula el siguiente paso', () => {
    expect(nextTreatmentStepIndex(treatment, 0)).toBe(1);
    expect(nextTreatmentStepIndex(treatment, 1)).toBeNull();
  });

  it('suma precios y señas', () => {
    expect(treatmentTotals(treatment)).toEqual({ price: 16000, deposit: 8000 });
  });
});
