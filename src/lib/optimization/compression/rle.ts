export function encodeRLE(data: Uint8Array): Uint8Array {
  const output: number[] = [];
  let count = 1;
  let current = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i] === current && count < 255) {
      count++;
    } else {
      output.push(count, current);
      count = 1;
      current = data[i];
    }
  }
  output.push(count, current);

  return new Uint8Array(output);
}

export function decodeRLE(data: Uint8Array): Uint8Array {
  const output: number[] = [];
  
  for (let i = 0; i < data.length; i += 2) {
    const count = data[i];
    const value = data[i + 1];
    for (let j = 0; j < count; j++) {
      output.push(value);
    }
  }

  return new Uint8Array(output);
}