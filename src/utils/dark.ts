export const SETITEM = (key: string, value: string) => {
  localStorage.setItem(key, value)
}
export const GETITEM = (key: string): string => {
  return localStorage.getItem(key) as string
}
