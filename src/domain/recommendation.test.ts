import { makeService } from '@/test/fixtures';
import {
  answerLabel,
  confidenceLabel,
  confidencePercent,
  isQuestionnaireComplete,
  recommendationTitle,
} from './recommendation';

describe('recommendation', () => {
  it('normaliza la confianza a porcentaje', () => {
    expect(confidencePercent(0.834)).toBe(83);
    expect(confidencePercent(83)).toBe(83);
    expect(confidencePercent(-1)).toBe(0);
    expect(confidenceLabel(0.9)).toBe('Alta coincidencia');
    expect(confidenceLabel(0.6)).toBe('Buena coincidencia');
    expect(confidenceLabel(0.2)).toBe('Coincidencia parcial');
  });

  it('obtiene el título del servicio o tratamiento', () => {
    expect(recommendationTitle({ type: 'SERVICE', service: makeService(), treatment: null })).toBe(
      'Manicuría Rusa',
    );
    expect(
      recommendationTitle({
        type: 'TREATMENT',
        service: null,
        treatment: {
          id: 't',
          name: 'Plan Glow',
          description: null,
          isActive: true,
          recommendationTags: [],
          services: [],
        },
      }),
    ).toBe('Plan Glow');
    expect(recommendationTitle({ type: 'TREATMENT', service: null, treatment: null })).toBe('Tratamiento');
    expect(recommendationTitle({ type: 'SERVICE', service: null, treatment: null })).toBe('Servicio');
  });

  it('valida el cuestionario y traduce respuestas', () => {
    const questions = [
      { id: 'q1', text: '¿Piel?', options: [{ value: 'seca', label: 'Seca' }] },
      { id: 'q2', text: '¿Objetivo?', options: [{ value: 'relax', label: 'Relajarme' }] },
    ];
    expect(isQuestionnaireComplete(questions, { q1: 'seca' })).toBe(false);
    expect(isQuestionnaireComplete(questions, { q1: 'seca', q2: 'relax' })).toBe(true);
    expect(answerLabel(questions, 'q2', 'relax')).toBe('Relajarme');
    expect(answerLabel(questions, 'qx', 'otro')).toBe('otro');
  });
});
