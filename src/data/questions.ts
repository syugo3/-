import { Question } from '../types/types';

export const questions: Question[] = [
  {
    id: 1,
    question: "ChatGPTをプログラミング学習に活用する際の最も適切な方法はどれでしょうか？\n\nA) エラーが出たらすぐにエンジニアに相談する\nB) ChatGPTに質問し、解決策を得る習慣をつける\nC) どんなコードも自分で一から書く\nD) AIを使わずに学習する",
    answer: "B",
    explanation: "ChatGPTはプログラミングの疑問を解決するための強力なツールです。問題が発生した際には、まずChatGPTに質問し、回答を元に学習を進めることが効率的な方法です。"
  },
  {
    id: 2,
    question: "以下のプログラミング言語のうち、ウェブサイトの動的な動作を制御するのに最も適しているのはどれでしょうか？\n\nA) Python\nB) Java\nC) JavaScript\nD) C++",
    answer: "C",
    explanation: "JavaScriptは、ウェブサイトのインタラクティブな要素（ボタンのクリックやアニメーションなど）を実装するために使われる言語です。PythonやJavaは主にバックエンド開発やデータ分析に使用されます。"
  },
  {
    id: 3,
    question: "Pythonで新しいファイルを作成する際に、Cursorエディタで行うべき正しい手順はどれでしょうか？\n\nA) ターミナルで touch newfile.txt と入力する\nB) メニューから「新規ファイル」を選択し、拡張子 .py を付けて保存する\nC) ChatGPTにファイルを作るよう依頼する\nD) 直接ターミナルにPythonコードを書く",
    answer: "B",
    explanation: "Cursorエディタでは、新しいPythonファイルを作成する際に「新規ファイル」オプションを選び、拡張子 .py を付けて保存するのが適切です。"
  },
  {
    id: 4,
    question: "以下のPythonコードをCursorエディタで実行した場合、出力されるのはどれでしょうか？\n\nprint(\"Hello, World!\")\n\nA) \"Hello, World!\" と表示される\nB) エラーが発生する\nC) 何も表示されない\nD) \"hello, world!\" と小文字で表示される",
    answer: "A",
    explanation: "print(\"Hello, World!\") は標準出力に「Hello, World!」と表示するPythonの基本的なコードです。エラーも発生せず、正しく大文字と小文字が区別されます。"
  },
  {
    id: 5,
    question: "GitHubを利用する主な目的として最も適切なものはどれでしょうか？\n\nA) コードのバージョン管理と共有\nB) プログラムを自動的に最適化する\nC) コンピュータウイルスのチェック\nD) AIを訓練する",
    answer: "A",
    explanation: "GitHubは、ソフトウェア開発プロジェクトのコードを保存し、バージョン管理を行うためのサービスです。チーム開発や個人プロジェクトのコード管理に役立ちます。"
  },
  {
    id: 6,
    question: "API（Application Programming Interface）の主な役割はどれでしょうか？\n\nA) 異なるソフトウェア間でデータや機能を共有する\nB) コンピュータのウイルスを除去する\nC) Webページのデザインを決める\nD) 人間が直接操作するためのインターフェースを提供する",
    answer: "A",
    explanation: "APIは、異なるソフトウェアが通信するためのルールやプロトコルの集合です。例えば、天気アプリが気象データを取得する際にAPIを利用します。"
  },
  {
    id: 7,
    question: "Web APIの主な特徴として正しいものはどれでしょうか？\n\nA) インターネットを介してデータや機能を提供する\nB) すべてのAPIはローカル環境でしか動作しない\nC) APIはプログラムが直接ユーザーと対話するための仕組みである\nD) APIはWebサイトのレイアウトを変更するために使われる",
    answer: "A",
    explanation: "Web APIは、インターネットを介して外部のデータや機能にアクセスする仕組みです。例えば、Google Maps APIを使用すると、Webサイトに地図を埋め込むことができます。"
  },
  {
    id: 8,
    question: "Flaskを使用してAPIを作成する際に最初に必要な作業はどれでしょうか？\n\nA) pip install flask を実行してFlaskをインストールする\nB) JavaScriptのコードを記述する\nC) APIのURLを取得する\nD) HTMLファイルを作成する",
    answer: "A",
    explanation: "FlaskはPythonでWeb APIを作成するための軽量なフレームワークです。使用するには、まず pip install flask でインストールする必要があります。"
  },
  {
    id: 9,
    question: "FastAPIの主な特徴として適切なものはどれでしょうか？\n\nA) 高速なパフォーマンスと自動生成されるドキュメント\nB) すべてのリクエストを同期的に処理する\nC) Python 2 で動作する\nD) フロントエンドの開発専用のフレームワークである",
    answer: "A",
    explanation: "FastAPIは非同期処理をサポートしており、高速なAPIの開発が可能です。また、Swagger UIを使って自動的にAPIのドキュメントを生成する機能も備えています。"
  },
  {
    id: 10,
    question: "APIでデータを削除するために使用されるHTTPメソッドはどれでしょうか？\n\nA) GET\nB) POST\nC) DELETE\nD) PUT",
    answer: "C",
    explanation: "DELETEメソッドは、サーバー上のリソースを削除するために使用されます。例えば、DELETE /users/1 のようなリクエストを送ると、IDが1のユーザーを削除できます。"
  }
]; 