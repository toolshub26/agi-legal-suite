export function validateName(name) {
  return typeof name === 'string'
    && name.trim().length >= 2
    && name.trim().length <= 100;
}

export function validateAge(age) {
  const num = Number(age);

  return !isNaN(num)
    && num >= 1
    && num <= 120;
}
