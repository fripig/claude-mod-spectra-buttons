# spectra-buttons

Claude Code mod：Claude 回覆裡提到的 `/spectra-*` 指令，在輸入框上方變成按鈕，點一下填入輸入框。

```
spectra:  /spectra-apply gl-12-add-login   /spectra-verify gl-12-add-login   ✕
```

## 行為

- 每輪主對話回覆結束時抓出 `/spectra-<skill>` 及其後一個 ASCII 參數（change 名、`gl-<id>-…`、`#<id>`），去重、最多 9 個；subagent 的回覆不算。
- 也抓 `git push` 連同後面的 ASCII 參數（如 `git push -u origin feat/x`），原樣填入、交給 Claude 執行。
- 點按鈕只**填入**輸入框，按 Enter 才執行（避免誤點），送出前可修改。
- 按鈕列取得焦點時可用 `1`–`9` 快捷鍵；`✕` 關閉；下一輪回覆會換掉或清空。
- 回覆進行中不顯示。

給 Spectra 規格驅動開發流程使用；要抓其他指令，改 `hooks/register.tsx` 的 `PATTERN`。

## 安裝

```
/plugin install spectra-buttons --marketplace fripig/claude-mod-spectra-buttons
```

## 開發

```
claude plugin validate .
claude plugin test .
claude --plugin-dir .
```
