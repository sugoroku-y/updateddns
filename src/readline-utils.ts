import {createInterface} from 'readline';

interface InnerReadline {
  _writeToOutput: (writee: string) => unknown;
  readonly output: {
    write(writee: string): unknown;
  };
}

export async function prompt(
  question: string,
  hiddingCharacter?: string
): Promise<string> {
  const readline = createInterface(process.stdin, process.stdout);
  try {
    if (hiddingCharacter !== undefined) {
      const inner = (readline as unknown) as InnerReadline;
      inner._writeToOutput = (writee: string) => {
        inner.output.write(
          writee.length === 1
            ? hiddingCharacter.length === 0
              ? ''
              : hiddingCharacter.charAt(0)
            : writee
        );
      };
    }
    return await new Promise<string>(resolve =>
      readline.question(question, answer => resolve(answer))
    );
  } finally {
    readline.close();
  }
}
