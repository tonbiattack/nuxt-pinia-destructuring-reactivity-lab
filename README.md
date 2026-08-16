# Nuxt 3 / Pinia の分割代入で画面更新が止まる再現ラボ

このプロジェクトは、Nuxt 3 と TypeScript で Pinia ストアの状態を直接分割代入した結果、ストアは更新されるのに画面が追従しない問題を最小再現します。Nuxt 固有の不具合ではなく、Vue 3 と Pinia を使う SPA にも同じ契約が当てはまります。

> この教材は Nuxt `3.21.11` を再現用に固定しています。Nuxt 3 は 2026-07-31 に EOL であるため、新規プロダクション採用の推奨を目的としていません。題材は Vue / Pinia のリアクティビティです。

## 前提環境

Node.js 22 以降と pnpm 10 を使います。依存関係は `pnpm-lock.yaml` で固定します。

## セットアップ

```bash
pnpm install
```

Nuxt アプリを確認する場合は次を実行し、表示された URL を開きます。

```bash
pnpm dev
```

初期状態では「田中」と表示されます。「名前を更新」を押すと Pinia ストアの値は「佐藤」へ変わりますが、画面には古い「田中」が残ります。

## 不具合の再現

不具合を期待値との不一致として確認するには、次を実行します。

```bash
pnpm test:bug
```

`tests/ProfileEditor.bug.spec.ts` は、ボタン操作後にストアと DOM がともに「佐藤」になることを期待します。不具合状態ではストアだけが更新され、DOM のアサーションが失敗します。

初期表示が一見正常であることは次の対照テストで確認できます。

```bash
pnpm exec vitest run tests/ProfileEditor.control.spec.ts
```

## 原因と修正の方向

不具合は `components/ProfileEditor.vue` の次の直接分割代入にあります。

```ts
const { displayName, rename } = profileStore
```

`displayName` はその時点のプリミティブ値としてローカル変数へ取り出されるため、以後のストア更新を購読できません。修正では、状態・getter を `storeToRefs()` で ref として取り出し、アクションだけをストアから直接分割代入します。

```ts
const { displayName } = storeToRefs(profileStore)
const { rename } = profileStore
```

修正後は、元の失敗テストを回帰テストとして残したまま `pnpm test`、`pnpm typecheck`、`pnpm build` を実行します。

## 主なファイル

| パス | 役割 |
|---|---|
| `stores/profile.ts` | 表示名と更新アクションを持つ Pinia setup store。 |
| `components/ProfileEditor.vue` | 直接分割代入による不具合を含む Vue SFC。 |
| `tests/ProfileEditor.bug.spec.ts` | 更新後 DOM を期待して失敗する振る舞いテスト。 |
| `tests/ProfileEditor.control.spec.ts` | 初期表示だけは正常に見える対照テスト。 |
| `nuxt.config.ts` | Nuxt と Pinia モジュールを有効化する最小設定。 |

## 参考資料

- [Pinia: Defining a Store](https://pinia.vuejs.org/core-concepts/)
- [Vue: Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [Vue: Testing](https://vuejs.org/guide/scaling-up/testing.html)
- [Nuxt: Upgrade Guide v3](https://nuxt.com/docs/3.x/getting-started/upgrade)
