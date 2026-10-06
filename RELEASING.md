# 發布 `@fugle/marketdata`

| | |
|---|---|
| 套件 | `@fugle/marketdata`（npm） |
| 版本 bump | release-it（`.release-it.json`） |
| tag 格式 | `v1.8.0-rc.1`（有 `v`） |
| 上架觸發 | **push tag** → `.github/workflows/publish.yml` |
| 預發布通道 | npm `next` dist-tag（**與 v3 共用**，見下方） |
| 發版分支 | **`master`**（預設分支） |

發版前先讀「[版號相容承諾](#版號相容承諾下游套件用區間依賴)」——下游用區間依賴，版號選錯會直接推給下游使用者。

---

## 流程

先開 PR 合進 `master`，再直接在 `master` 上發：

```bash
git switch master && git pull --ff-only origin master   # HEAD 應是剛合進去的 merge commit

# 先 dry-run：印出算出來的版號與 changelog，不改任何東西
GITHUB_TOKEN=$(gh auth token) npx release-it --preRelease=rc --ci --dry-run

# 確認無誤再正式跑
GITHUB_TOKEN=$(gh auth token) npx release-it --preRelease=rc --ci
```

一行做完：bump `package.json` + `package-lock.json` → 重生 `CHANGELOG.md` → commit `chore(release): x` → 打 annotated tag → push → 建 GitHub Release。

- `--preRelease=rc` 由 release-it 依 commit 推算版號，rc 編號從 `.0` 起算。要特定版號（例如新 minor 從 `rc.1` 起）就明確指定：`npx release-it 1.8.0-rc.1 --ci`。發正式版：`npx release-it 1.8.0 --ci`。
- **`GITHUB_TOKEN` 一定要給**。`.release-it.json` 設了 `github.release: true`，但 release-it 不會讀 `gh` 的登入狀態，沒 token 會在最後一步失敗（此時 commit / tag / push 都已經做完，得手動補 release）。
- `--ci` 是非互動模式；想逐步確認就拿掉 `--ci`。
- release commit 會跑 husky `commit-msg` hook（`yarn commitlint`），機器上要有 `yarn`。
- 工作目錄有未追蹤檔案不會擋——release-it 的檢查是 `git status --short --untracked-files=no`。

`.release-it.json` 裡 `npm.publish: false`——**發布不是 release-it 做的**，是 push tag 觸發 `publish.yml`（npm Trusted Publishing／OIDC，不需要 `NPM_TOKEN`）。workflow 看 tag 有沒有 `-`：

- `v1.8.0-rc.1` → `npm publish --tag next`
- `v1.8.0` → `npm publish`（進 `latest`）

### `next` dist-tag 跟 v3 共用

v3（`fugle-dev-marketdata-sdk`，3.0.0-rc 系列）也發到同一個套件名的 `next`。本套件發 rc 會把 `next` 從 v3 搶過來（`npm install @fugle/marketdata@next` 會裝到 1.x）。

處理方式是**協調順序**：本套件 rc 先發、確認 npm 上看得到之後，通知 v3 再發一版 rc 把 `next` 指回 v3。**不要手動 `npm dist-tag`。** 2026-10-06 發 `1.8.0-rc.1` 時實際這樣處理過（蓋掉 `3.0.0-rc.12`，由 v3 發 rc.13 搶回）。

### 剛發完 dist-tags 可能還是舊值

workflow log 已出現 `+ @fugle/marketdata@x`，但幾分鐘內 `npm view @fugle/marketdata dist-tags` 可能還是舊值、`npm view @fugle/marketdata@x` 回 404——registry 還在處理。等一下再查，別急著重發。

---

## Commit message 的兩個硬限制

release-it 用 `@release-it/conventional-changelog` 的 **angular preset**：

**`BREAKING CHANGE:` footer 會強制推成 major。** 想發 minor 就不能寫這個 footer——不管 body 講得多清楚。

**CHANGELOG 只收 subject 行，body 不會出現。** 使用者需要知道的變更（例如預設行為改了）**必須寫進 subject**。commitlint 上限 100 字元。

---

## 版號相容承諾（下游套件用區間依賴）

下游套件以**區間依賴**本套件（例如 `@fugle/marketdata >=1.8.0-rc.1 <1.9.0`），目的是本套件修 bug 時下游不必重新發版。

**同一個 minor 線（1.8.x；之後的 minor 同理）只能放相容的修正。** 下面這些一律升 minor（或 major），不准進 patch：

- 新增參數、新增端點或功能
- 改回應型別（加欄位、改 nullable、改名都算）
- 任何 breaking（改參數名、改預設行為、拿掉東西）

判斷依據是 commit 類型：上一個 tag 之後只要有 `feat`，就不能發 patch。release-it 會照 commit 推薦 bump；**明確指定版號時別蓋成 patch**——它會印 `WARNING The recommended bump is "minor", but is overridden with ...`，推薦是 minor、自己卻填 patch 就是違規。

發 patch 前先確認新版號仍落在下游區間內；要升 minor 時，先跟下游對齊何時放寬區間，否則下游使用者拿不到新版。

**rc 的範圍**：npm 只對區間下界那個 `1.8.0` 開放 prerelease——`1.8.0-rc.2` 會被接受，`1.8.1-rc.1`、`1.9.0-rc.1` 都不會。所以 patch 的 rc 不會被下游裝到，要驗得自己指定版號安裝。（Python 版不一樣：pip 會接受整條 2.8 線的 rc，見該 repo 的 `RELEASING.md`。）

---

## 發完之後驗

```bash
npm view @fugle/marketdata dist-tags --json          # rc 應在 next、latest 不動
gh run list --repo fugle-dev/fugle-marketdata-node --limit 3
```

rc 裝法：`npm install @fugle/marketdata@next`（若 `next` 已被 v3 搶回，改用 `@fugle/marketdata@1.8.0-rc.1` 指定版號）。

---

## 環境與前置

- `origin` 是 `fugle-dev/fugle-marketdata-node`；本機可能另有 fork 或鏡像 remote，**別推錯**。
- `gh` 要登入且有 `repo` scope：`gh auth status`。
- 早期曾在獨立的 release 分支上發版，已不再使用。
