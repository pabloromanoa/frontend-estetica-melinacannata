import { useState, type FormEvent } from 'react';
import { isQuestionnaireComplete, type Question } from '@/domain';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui';

interface QuestionnaireFormProps {
  questions: readonly Question[];
  onSubmit: (answers: Record<string, string>) => void;
  isSubmitting?: boolean;
}

export function QuestionnaireForm({ questions, onSubmit, isSubmitting }: QuestionnaireFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const complete = isQuestionnaireComplete(questions, answers);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (complete) onSubmit(answers);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {questions.map((question, index) => (
        <fieldset key={question.id} className="rounded-2xl bg-surface p-5 shadow-card">
          <legend className="mb-3 font-semibold text-ink">
            <span className="mr-2 text-primary">{index + 1}.</span>
            {question.text}
          </legend>
          <div className="flex flex-wrap gap-2">
            {question.options.map((option) => {
              const selected = answers[question.id] === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    'cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary',
                    selected
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-border bg-surface text-ink hover:border-primary',
                  )}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={question.id}
                    value={option.value}
                    checked={selected}
                    onChange={() => setAnswers((previous) => ({ ...previous, [question.id]: option.value }))}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
      <Button type="submit" size="lg" disabled={!complete} loading={isSubmitting}>
        Ver mi recomendación
      </Button>
    </form>
  );
}
