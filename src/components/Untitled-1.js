
second audiobook


  .map((chapter, originalIndex) => ({ chapter, originalIndex }))
  .filter(({ originalIndex }) => ![0, 4, 6, 9, 12, 14].includes(originalIndex))
  .map(({ chapter, originalIndex }, filteredIndex) => {
    // Determine which chapter to play
    const chapterToPlay = 
      [1, 4,5, 7, 9, 10].includes(filteredIndex + 1) 
        ? originalIndex - 1 
        : originalIndex;


Third

map((chapter, originalIndex) => ({ chapter, originalIndex }))
  .filter(({ originalIndex }) => ![0, 3, 6, 9, 11, 15].includes(originalIndex))
  .map(({ chapter, originalIndex }, filteredIndex) => {
    // Determine which chapter to play
    const chapterToPlay = 
      [1, 3,5, 7, 8, 11].includes(filteredIndex + 1) 
        ? originalIndex - 1 
        : originalIndex;




Fourth



first

.map((chapter, originalIndex) => ({ chapter, originalIndex }))
.filter(({ originalIndex }) => ![0, 3, 8, 11, 13].includes(originalIndex))
.map(({ chapter, originalIndex }, filteredIndex) => {
  // Determine which chapter to play
  const chapterToPlay = 
    [1, 3,7, 9, 10].includes(filteredIndex + 1) 
      ? originalIndex - 1 
      : originalIndex;