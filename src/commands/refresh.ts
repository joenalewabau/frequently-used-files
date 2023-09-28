import { FrequentlyUsedFilesProvider } from '../tree/frequentlyUsedFilesProvider';
/**
 * Add a file to the template
 */
export async function refresh(frequentlyUsedFilesProvider: FrequentlyUsedFilesProvider) {
  frequentlyUsedFilesProvider.refresh();
}
