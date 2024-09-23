import useLabelJsonQuery from '@/queries/labelJson/useLabelJsonQuery';
import { Project } from '@/types';
import createLabelJson from '@/utils/json/createLabelJson';
import { useMemo } from 'react';

export default function useLabelJson(dataPath: string, project: Project) {
  const response = useLabelJsonQuery(dataPath);
  const { data: labelJsonData } = response;
  const createdJson = useMemo(
    () => createLabelJson(project.type, labelJsonData.imageHeight, labelJsonData.imageWidth),
    [project, labelJsonData]
  );

  if (Object.keys(labelJsonData).includes('version')) {
    return response;
  }

  return { ...response, data: createdJson };
}
