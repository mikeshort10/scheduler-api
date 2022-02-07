export const simpleTrace = <X>(x: X) => {
  console.log(JSON.stringify(x) ?? x);
  return x;
};
