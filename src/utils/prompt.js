export const prompt = (msg) => {
  process.stdout.write(msg);
  return new Promise((resolve) => {
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
};
