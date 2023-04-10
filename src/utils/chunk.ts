// Takes an array of items and chunks them into a matrix.
// Useful for offset based pagination.
export function chunk<T>(items: T[], chunkSize: number): T[][] {
  // Inicialize the matrix
  const matrix: T[][] = [];

  // Iterate over the items
  for (let i = 0; i < items.length; i += chunkSize) {
    // Add the chunk to the matrix
    matrix.push(items.slice(i, i + chunkSize));
  }

  // Return the matrix
  return matrix;
}
