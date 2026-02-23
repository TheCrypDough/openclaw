/*
 * AUTO ANNOTATION
 * File: src/web/qr-image.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import QRCodeModule from "qrcode-terminal/vendor/QRCode/index.js";
import QRErrorCorrectLevelModule from "qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel.js";
import { encodePngRgba, fillPixel } from "../media/png-encode.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type QRCodeConstructor = new (
  typeNumber: number,
  errorCorrectLevel: unknown,
) => {
  addData: (data: string) => void;
  make: () => void;
  getModuleCount: () => number;
  isDark: (row: number, col: number) => boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const QRCode = QRCodeModule as QRCodeConstructor;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const QRErrorCorrectLevel = QRErrorCorrectLevelModule;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createQrMatrix(input: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const qr = new QRCode(-1, QRErrorCorrectLevel.L);
  qr.addData(input);
  qr.make();
  return qr;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function renderQrPngBase64(
  input: string,
  opts: { scale?: number; marginModules?: number } = {},
): Promise<string> {
  const { scale = 6, marginModules = 4 } = opts;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const qr = createQrMatrix(input);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const modules = qr.getModuleCount();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const size = (modules + marginModules * 2) * scale;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const buf = Buffer.alloc(size * size * 4, 255);
  for (let row = 0; row < modules; row += 1) {
    for (let col = 0; col < modules; col += 1) {
      if (!qr.isDark(row, col)) {
        continue;
      }
      const startX = (col + marginModules) * scale;
      const startY = (row + marginModules) * scale;
      for (let y = 0; y < scale; y += 1) {
        const pixelY = startY + y;
        for (let x = 0; x < scale; x += 1) {
          const pixelX = startX + x;
          fillPixel(buf, pixelX, pixelY, size, 0, 0, 0, 255);
        }
      }
    }
  }

  const png = encodePngRgba(buf, size, size);
  return png.toString("base64");
}
