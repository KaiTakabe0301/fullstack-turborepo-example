module.exports = {
  // 行の最大幅
  printWidth: 80,

  // インデントにタブを使用するかスペースを使用するか
  useTabs: false,

  // インデントのスペース数
  tabWidth: 2,

  // 文末にセミコロンを付けるか
  semi: true,

  // 文字列にシングルクォートを使用するか
  singleQuote: true,

  // オブジェクトのプロパティ名をクォートで囲むタイミング
  quoteProps: 'as-needed',

  // JSXでシングルクォートを使用するか
  jsxSingleQuote: true,

  // 配列やオブジェクトの最後の要素の後にカンマを付けるか
  trailingComma: 'es5',

  // オブジェクトリテラルの括弧の内側にスペースを入れるか
  bracketSpacing: true,

  // JSXの閉じ括弧を同じ行に置くか
  bracketSameLine: false,

  // アロー関数の引数が1つの場合に括弧を付けるか
  arrowParens: 'avoid',

  // ファイルの先頭にあるコメントを保持するか
  rangeStart: 0,
  rangeEnd: Infinity,

  // パーサーを指定（通常は自動検出）
  parser: undefined,

  // ファイルパスを指定（通常は自動検出）
  filepath: undefined,

  // Prettierが処理する必要があるかどうかを判断
  requirePragma: false,

  // ファイルの先頭にPrettierのプラグマを挿入するか
  insertPragma: false,

  // Markdownのテキストの折り返し方法
  proseWrap: 'preserve',

  // HTMLの空白の扱い方
  htmlWhitespaceSensitivity: 'css',

  // Vue SFCのスクリプトとスタイルタグのインデント
  vueIndentScriptAndStyle: false,

  // 改行文字の種類
  endOfLine: 'lf',

  // 埋め込み言語のフォーマット
  embeddedLanguageFormatting: 'auto',

  // HTMLの属性を1行に収めるかどうか
  singleAttributePerLine: false,
};
