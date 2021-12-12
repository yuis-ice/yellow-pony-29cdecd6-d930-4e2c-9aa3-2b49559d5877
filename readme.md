
# readme 

- discord app 
- google sheet app 

## 必要環境

- git 
- node.js v16.6 

## 想定環境

- windows 10
- powershell (admin)

## 環境構築

- chocoをインストール

powershellをadmin・管理者権限で開き以下を実行

```
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```

参考:

[Windows 11にchocolateyをインストールする - プログラミングの「YUIPRO」](https://yuis-programming.com/?p=3333)

- gitをインストール (既に入っている場合にはスキップ)

```
choco install git -y 
```

- node.js v16.6をインストール

node.jsを新規にインストールする場合

```
choco install nodejs --version=16.6 -y 

node -v # v16.6.xと表示されることを確認
```

node.jsの別のバージョンが既に入っておりそれを上書きインストールする場合

```
choco install nodejs --version=16.6 -y --force

node -v # v16.6.xと表示されることを確認
```

windowsにインストールされているnode.jsのバージョンと分けてv16.6をインストールする場合

```
choco install nvm -y
refreshenv

nvm install 16.6

C:/ProgramData/nvm/v16.6.0/node64.exe -v # v16.6.xと表示されることを確認
```

- git clone

```
git clone https://github.com/yuis-ice/yellow-pony-29cdecd6-d930-4e2c-9aa3-2b49559d5877.git
cd yellow-pony-29cdecd6-d930-4e2c-9aa3-2b49559d5877
```

- node.js npmパッケージ依存関係のダウンロード

```
C:\ProgramData\nvm\v16.6.0\npm.cmd i
```

## config.ymlに設定を記述する

設定ファイル ./config.default.yml を ./config.yml ファイルに名前変更またはコピーし、各設定を埋める

discordやgoogle sheetのapiキー、トークンキー、トークンファイルなどもここに加える。
(apiトークン周りの管理は自己責任で慎重に。githubなどにpushしたりしないこと)

discordでのapi作成、bot作成についてのガイド: 

[discord.jsで使うAPIトークンとbotを作成する - プログラミングの「YUIPRO」](https://yuis-programming.com/?p=3702)

google sheetでのapi作成、トークンファイル作成についてのガイド: 

[Sheets APIとgoogleapisでGoogleスプレッドシートの読み込み・書き込み - プログラミングの「YUIPRO」](https://yuis-programming.com/?p=3497#Google_sheets_APIAPI)

## プログラムを実行 

discordアプリ

```
C:/ProgramData/nvm/v16.6.0/node64.exe .\app_discord.js 

# or 

node .\app_discord.js 
```

google sheetアプリ

```
C:/ProgramData/nvm/v16.6.0/node64.exe .\app_googlesheet.js 

# or 

node .\app_googlesheet.js 
```

なお、想定スプレッドシートの例: 

![](https://yuis.xsrv.jp/images/ss/ShareX_ScreenShot_4a997f46-8ebd-4d39-84ab-751be510d8c5.png)

<!-- https://docs.google.com/spreadsheets/d/1mpKOKTU2MaBW_hoV_GXVDmD0XfW0PWRixfQOgQoT3Qo/edit#gid=1689859390 -->
