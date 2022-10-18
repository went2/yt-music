export function group(arr: any[], subGroupLength: number): Array<any[]> {
  let index = 0;
  const newArr = [];
  while(index < arr.length) {
    newArr.push(arr.slice(index, index += subGroupLength));
  }
  return newArr;
}