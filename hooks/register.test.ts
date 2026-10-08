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
