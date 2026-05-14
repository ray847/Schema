import { useCallback, useEffect, useState } from 'react';
import { localStore } from '../../shared';
import type { TaskTemplate } from './model';

const storageKey = (userKey: string | number) => `taskTemplates:${userKey}`;

export function useTaskTemplates(userKey: string | number | null | undefined) {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(Boolean(userKey));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!userKey) {
      setTemplates([]);
      setLoading(false);
      setError(null);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    localStore.get<TaskTemplate[]>(storageKey(userKey))
      .then((storedTemplates) => {
        if (active) setTemplates(storedTemplates ?? []);
      })
      .catch((caught) => {
        if (active) setError(caught instanceof Error ? caught.message : 'Failed to load task templates.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userKey]);

  const saveTemplates = useCallback(async (nextTemplates: TaskTemplate[]) => {
    if (!userKey) return;
    setTemplates(nextTemplates);
    await localStore.set(storageKey(userKey), nextTemplates);
  }, [userKey]);

  const upsertTemplate = useCallback(async (template: TaskTemplate) => {
    await saveTemplates(
      templates.some((candidate) => candidate.id === template.id)
        ? templates.map((candidate) => candidate.id === template.id ? template : candidate)
        : [...templates, template],
    );
  }, [saveTemplates, templates]);

  const deleteTemplate = useCallback(async (templateId: string) => {
    await saveTemplates(templates.filter((template) => template.id !== templateId));
  }, [saveTemplates, templates]);

  return {
    deleteTemplate,
    error,
    loading,
    templates,
    upsertTemplate,
  };
}
