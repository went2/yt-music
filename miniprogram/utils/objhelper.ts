export const isObject = (obj: any):boolean => {
  const type = typeof obj;
  return type === 'object' && !!obj;
}