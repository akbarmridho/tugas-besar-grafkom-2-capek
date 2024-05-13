export function debounce<T extends (...args: unknown[]) => unknown>(
  cb: T,
  wait: number
) {
  let h: number;
  const callable = (...args: unknown[]) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<unknown>callable);
}
