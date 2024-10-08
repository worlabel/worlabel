import JSZip from 'jszip';

export async function unzipFilesWithPath(file: File, maxDepth: number = 10): Promise<{ path: string; file: File }[]> {
  const zip = await JSZip.loadAsync(file);
  const files: { path: string; file: File }[] = [];

  const zipFolderName = file.name.replace(/\.zip$/i, '');

  const extractFiles = async (zipObj: JSZip, currentPath: string = '', currentDepth: number = 0) => {
    if (currentDepth > maxDepth) {
      return;
    }

    const promises = Object.keys(zipObj.files).map(async (filename) => {
      const fileData = zipObj.files[filename];
      const fullPath = currentPath ? `${currentPath}/${filename}` : `${zipFolderName}/${filename}`;

      if (!fileData.dir) {
        const blob = await fileData.async('blob');
        files.push({ path: fullPath, file: new File([blob], filename) });
      } else {
        if (fileData.name !== filename) {
          const folderZipObj = zipObj.folder(fileData.name);
          if (folderZipObj) {
            await extractFiles(folderZipObj, fullPath, currentDepth + 1);
          }
        }
      }
    });

    await Promise.all(promises);
  };

  await extractFiles(zip);

  return files;
}

export function extractFilesRecursivelyWithPath(
  entry: FileSystemEntry,
  currentPath: string = ''
): Promise<{ path: string; file: File }[]> {
  return new Promise((resolve) => {
    if (entry) {
      if (entry.isDirectory) {
        const dirReader = (entry as FileSystemDirectoryEntry).createReader();
        const files: { path: string; file: File }[] = [];

        const readEntries = () => {
          dirReader.readEntries(async (entries) => {
            if (entries.length > 0) {
              const newFilesArrays = await Promise.all(
                Array.from(entries).map((e) => {
                  const newPath = currentPath ? `${currentPath}/${e.name}` : e.name;
                  return extractFilesRecursivelyWithPath(e, newPath);
                })
              );
              newFilesArrays.forEach((newFiles) => files.push(...newFiles));
              readEntries();
            } else {
              resolve(files);
            }
          });
        };

        readEntries();
      } else if (entry.isFile) {
        (entry as FileSystemFileEntry).file((file: File) => {
          resolve([{ path: currentPath, file }]);
        });
      } else {
        resolve([]);
      }
    } else {
      resolve([]);
    }
  });
}
