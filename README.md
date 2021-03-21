# updateddns

DynamicDNS更新用スクリプト。

## 設定ファイル

ホームディレクトリに`.updateddns`という名前のディレクトリを作成し、そこに`config`という名前のファイルを作成する。

内容は以下のようにJSON形式で構成する。

```json
{
  "ipcheck": {
    "url": "http://root@router.local/index.html",
    "pattern": "<label.*?>.*?IP.*?</label>[\\s\\S]*?<td.*?>(\\d+\\.\\d+\\.\\d+\\.\\d+)</td>"
  },
  "update": [
    "https://mydnsXXXXXXX@www.mydns.jp/login.html",
    "https://mydnsYYYYYYY@www.mydns.jp/login.html"
  ],
  "forceExecInterval": 5
}
```

- `ipcheck.url`  
  現在のIPアドレスを取得するためのURLを指定する。  
  前回取得したIPアドレスから変化していなければ何もしない。  
  ただし、最後にIPアドレスを取得した日から`forceExecInterval`の日数が経過していた場合は強制的に更新する。
- `ipcheck.pattern`  
  `ipcheck.url`から取得した内容に適用して、IPアドレスを抽出するための正規表現を指定する。
- `update[]`  
  DynamicDNSを更新するためのURLを指定する。
- `forceExecInterval`  
  IPアドレスが更新されていなくても強制的にDynamicDNSを更新する日数を指定する。

## IPアドレスのキャッシュ

取得したIPアドレスは`$HOME/.updateddns/ip-cache`に保存される。

`forceExecInterval`で指定した日数が経過する前に、強制的に更新したい場合にはこのファイルを削除する。

## 認証情報

それぞれのURLへアクセスしたときに認証情報を求められた場合、ユーザー名とパスワードの入力を求める。

入力された認証情報は`$HOME/.updateddns/credentials`に暗号化されて保存される。

認証情報をクリアしたい場合にはこのファイルを削除する。
