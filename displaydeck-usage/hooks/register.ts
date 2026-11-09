import type { EngineInterface, Register, SessionRateLimit } from 'claude-code'

// Claude Code が持っている使用枠（5時間・週間。ステータスラインと同じ値）を、DisplayDeck が読む小さなファイルに書く。
// ログイン情報や非公開の API は使わず、問い合わせもしない（返事のたびにエンジンが渡す値を書き写すだけ）。
// 書き先: <ユーザーのフォルダー>\.displaydeck\claude-usage.json（AppData の外。デスクトップアプリの中で動いても振り替えられない）

function toWindow(w: SessionRateLimit | undefined) {
  if (w === undefined) return null
  return {
    used_percentage: w.percentUsed,
    resets_at: w.resetsAt === undefined ? null : Math.floor(Date.parse(w.resetsAt) / 1000),
  }
}

async function writeUsage($: EngineInterface, limits: readonly SessionRateLimit[]) {
  const five = limits.find(l => l.kind === 'five_hour')
  const week = limits.find(l => l.kind === 'seven_day')
  if (five === undefined && week === undefined) return
  const home = await $.env.get('USERPROFILE')
  if (home === undefined) return
  const body = JSON.stringify({
    updated_at: Math.floor((await $.clock.now()) / 1000),
    source: 'mod',
    five_hour: toWindow(five),
    seven_day: toWindow(week),
  })
  await $.fs.write(`${home}\\.displaydeck\\claude-usage.json`, body)
}

export const register: Register = on => {
  // 返事のあと・使用率が1ポイント動いたとき（値は Claude Code が最後の応答で受け取ったもの）
  on('session.measure', async ($, e, next) => {
    try { await writeUsage($, e.rateLimits) } catch { /* 書けなくても Claude Code の邪魔をしない */ }
    return next(e)
  })

  // 始まったとき（再開したセッションなど、すでに値があれば）
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    try { await writeUsage($, (await $.session.usage()).rateLimits) } catch { /* 同上 */ }
    return r
  })
}
