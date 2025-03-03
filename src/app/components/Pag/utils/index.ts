
export const handleError = (message: string, error: any, callback?: () => void) => {
  console.error(message, error);
  callback?.();
};
