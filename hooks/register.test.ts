import { expect, test } from 'claude-code/testing'

import { extractCommands } from './register'

test('抓出回覆裡的 /spectra-* 指令與參數，去重', async () => {
  const answer = [
    '接下來可以跑 `/spectra-apply gl-12-add-login`，',
    '完成後 /spectra-verify gl-12-add-login。',
    '需求不清就 /spectra-discuss 再說；也可以 `/spectra-apply gl-12-add-login`',
  ].join('\n')
  expect(extractCommands(answer)).toEqual([
    '/spectra-apply gl-12-add-login',
    '/spectra-verify gl-12-add-login',
    '/spectra-discuss',
  ])
})

test('參數只收 ASCII token；路徑裡的 /spectra- 不算', async () => {
  expect(extractCommands('跑 /spectra-propose 處理 #15')).toEqual(['/spectra-propose'])
  expect(extractCommands('/spectra-ingest #15.')).toEqual(['/spectra-ingest #15'])
  expect(extractCommands('見 docs/spectra-guide.md 與 a/spectra-x')).toEqual([])
})

test('git push 連同 ASCII 參數一起抓，與 /spectra-* 依出現順序排列', async () => {
  const answer = [
    '先 `git push -u origin feat/login`，',
    '再跑 /spectra-verify gl-12-add-login，最後 git  push origin HEAD:main。',
    '別用 git push --force-with-lease 以外的強推；git push 就好.',
  ].join('\n')
  expect(extractCommands(answer)).toEqual([
    'git push -u origin feat/login',
    '/spectra-verify gl-12-add-login',
    'git push origin HEAD:main',
    'git push --force-with-lease',
    'git push',
  ])
  expect(extractCommands('見 my-git push 與 legit push')).toEqual([])
})
