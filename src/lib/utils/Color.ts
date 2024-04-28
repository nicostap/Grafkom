export class Color {
  public static fromHex(hex: string) {
    hex = hex.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return this.fromRGB255(r, g, b);
  }

  public static fromRGB255(r: number, g: number, b: number) {
    return [r / 255, g / 255, b / 255];
  }
}
