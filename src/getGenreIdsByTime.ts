type Genres = {
  [key in number]: string[];
};

const genres: Genres = {
  9: ["100371", "100433"],
  12: ["216131", "558885"],
  15: ["216129", "100533"],
  18: ["551167", "100804"],
  21: ["558944", "100939"],
};

const getGenreIdsByTime = (hour: number): string[] => {
  return genres[hour] || [];
};

export default getGenreIdsByTime;
