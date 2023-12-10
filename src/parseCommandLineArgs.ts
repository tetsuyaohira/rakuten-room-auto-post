const parseCommandLineArgs = (args: string[]) => {
  const options: { genre?: string; keyword?: string } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-genre") {
      if (options.genre) {
        throw new Error("エラー: ジャンルは既に指定されています。");
      }
      options.genre = args[i + 1];
      i++;
    } else if (args[i] === "-keyword") {
      if (options.keyword) {
        throw new Error("エラー: キーワードは既に指定されています。");
      }
      options.keyword = args[i + 1];
      i++;
    }
  }

  return options;
};

export default parseCommandLineArgs;
