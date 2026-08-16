# 調査記録: ストアは更新されるのに DOM が更新されない

## 観測した事実

| 観測 | 実行方法 | 結果 |
|---|---|---|
| 初期 DOM | `ProfileEditor.control.spec.ts` を mount して `data-testid="display-name"` を読む | `田中`。対照テストは成功した。 |
| 更新後のストア値 | `ProfileEditor.bug.spec.ts` でボタン押下後に `useProfileStore(pinia).displayName` を検証する | `佐藤`。このアサーションは DOM のアサーションより先に通過した。 |
| 更新後の DOM | 同テストで `data-testid="display-name"` を読む | 期待値 `佐藤` に対して受信値は `田中`。テストは失敗した。 |

## 競合仮説

| 仮説 | 予測 | 最小実験 | 結果 | 判定 |
|---|---|---|---|---|
| アクションが実行されていない | クリック後の `profileStore.displayName` も `田中` のままである | クリック後にストア値を検証する | `佐藤` だった | 棄却 |
| Vue Test Utils の描画待機が不足している | `nextTick()` 後に DOM は `佐藤` へ変わる | クリック後に `await nextTick()` を実行して DOM を検証する | なお `田中` だった | 棄却 |
| 直接分割代入でリアクティブな接続を失った | ストア値は更新するが、`const { displayName } = profileStore` のローカル変数は初期値を保持する | `displayName` だけを `storeToRefs(profileStore)` から取得する | 修正後の回帰テストで検証する | 採用 |

## 根本原因

Pinia ストアはリアクティブなオブジェクトとして利用できるが、`const { displayName } = profileStore` は getter を通じて得たプリミティブ値を通常のローカル変数へ代入する。その後、テンプレートはストアや ref ではなく、その固定されたローカル変数を読む。したがって `rename()` がストアの `displayName` ref を更新しても、コンポーネントが依存として追跡している値は更新されない。

`storeToRefs(profileStore)` は状態・getter を ref として抽出するため、テンプレートは ref を通じて更新を追跡する。アクションはストアへ束縛されているため、直接分割代入してよい。

根拠: [Pinia: Defining a Store](https://pinia.vuejs.org/core-concepts/)、[Vue: Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
