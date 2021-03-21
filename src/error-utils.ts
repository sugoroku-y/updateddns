/**
 * テンプレートリテラルで生成した文字列をメッセージとした例外を投げる。
 * @param templ 例外のメッセージに指定する文字列のテンプレート
 * @param values テンプレートに適用する値
 */
export function error(templ: TemplateStringsArray, ...values: unknown[]): never;
/**
 * メッセージ無しの例外を投げる。
 */
export function error(): never;
/**
 * 指定した文字列をメッセージとした例外を投げる。
 * @param message 例外のメッセージに指定する文字列。
 */
export function error(message: string): never;

export function error(): never {
  const message =
    // 引数無しの場合はメッセージ無し
    arguments.length === 0
      ? undefined
      : // 引数が文字列の場合はそのままメッセージにする
      typeof arguments[0] === 'string'
      ? arguments[0]
      : // タグ付きテンプレートリテラルの場合はテンプレートからメッセージ生成
        (arguments[0] as string[]).reduce(
          (r, t, i) => r + String(arguments[i]) + t
        );
  throw new Error(message);
}

export function assertNever(o: never): never {
  throw new Error(`Unexpected: ${o}`);
}

export function rethrow(ex: unknown): never {
  throw ex;
}
