export function toHexString(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  return Array.prototype.map
    .call(uint8Array, (byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function fromHexString(hexString: string) {
  return new Uint8Array(
    (hexString.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16))
  ).buffer;
}
