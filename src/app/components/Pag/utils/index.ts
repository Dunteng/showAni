// import { ilogsError } from "@tencent/kg-report/lib/common/ilogsCommon";

export const handleError = (message: string, error: any, callback?: () => void) => {
  console.error(message, error);
  // ilogsError(`Pag动画-${message}：${JSON.stringify(error)}`);
  callback?.();
};
