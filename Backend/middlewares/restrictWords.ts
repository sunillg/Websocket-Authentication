
const badWords = ["word1", "word2", "word3"];

export const restrictWords = (message: string): boolean => {
    return badWords.some((word) => message.toLowerCase().includes(word.toLowerCase()));
  };
