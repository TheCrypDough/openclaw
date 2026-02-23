/*
 * AUTO ANNOTATION
 * File: src/terminal/stream-writer.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type SafeStreamWriterOptions = {
  beforeWrite?: () => void;
  onBrokenPipe?: (err: NodeJS.ErrnoException, stream: NodeJS.WriteStream) => void;
};

export type SafeStreamWriter = {
  write: (stream: NodeJS.WriteStream, text: string) => boolean;
  writeLine: (stream: NodeJS.WriteStream, text: string) => boolean;
  reset: () => void;
  isClosed: () => boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isBrokenPipeError(err: unknown): err is NodeJS.ErrnoException {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const code = (err as NodeJS.ErrnoException)?.code;
  return code === "EPIPE" || code === "EIO";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSafeStreamWriter(options: SafeStreamWriterOptions = {}): SafeStreamWriter {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let closed = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let notified = false;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const noteBrokenPipe = (err: NodeJS.ErrnoException, stream: NodeJS.WriteStream) => {
    if (notified) {
      return;
    }
    notified = true;
    options.onBrokenPipe?.(err, stream);
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const handleError = (err: unknown, stream: NodeJS.WriteStream): boolean => {
    if (!isBrokenPipeError(err)) {
      throw err;
    }
    closed = true;
    noteBrokenPipe(err, stream);
    return false;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const write = (stream: NodeJS.WriteStream, text: string): boolean => {
    if (closed) {
      return false;
    }
    try {
      options.beforeWrite?.();
    } catch (err) {
      return handleError(err, process.stderr);
    }
    try {
      stream.write(text);
      return !closed;
    } catch (err) {
      return handleError(err, stream);
    }
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const writeLine = (stream: NodeJS.WriteStream, text: string): boolean =>
    write(stream, `${text}\n`);

  return {
    write,
    writeLine,
    reset: () => {
      closed = false;
      notified = false;
    },
    isClosed: () => closed,
  };
}
