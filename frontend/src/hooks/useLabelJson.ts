import useLabelJsonQuery from '@/queries/labelJson/useLabelJsonQuery';
import { Project } from '@/types';
import createLabelJson from '@/utils/json/createLabelJson';
import { useMemo } from 'react';

export default function useLabelJson(dataPath: string, project: Project) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createdJson = useMemo(() => createLabelJson(project.type), [dataPath]);

  const response = useLabelJsonQuery(dataPath);
  if (Object.keys(response.data).includes('version')) {
    return response;
  }
  return { ...response, data: createdJson };
}
