// The One-Liner Groan-Off — u-alfasurya91-the-one-liner-groan-off-5a1febd5
// Writes one original one-line dad joke to /output/entry.txt (gate: 1-140 chars).
// v2: scores 3 candidate jokes against the judge's 5 published criteria, in
// their published order, and writes the winner. Deterministic, no network,
// no secrets, no env vars (except an overridable OUTPUT_PATH for local testing).

import { mkdirSync, writeFileSync } from "node:fs";

const OUTPUT = process.env.OUTPUT_PATH ?? "/output/entry.txt";

// Judge criteria, most important first (from RULES):
// 1. is a one-line dad joke (pun/twist a dad would tell out loud)
// 2. punchline lands fast and clean, setup and turn inside the single line
// 3. fresh, not one everyone has heard a hundred times
// 4. tight and rhythmic, easy to say out loud and pass on
// 5. groan earned: silly enough to laugh at, sharp enough to repeat
// Each criterion scored 0-5; ties broken on the earliest criterion that differs.

type Candidate = { text: string; scores: [number, number, number, number, number] };

const candidates: Candidate[] = [
  {
    // A: the groan contract — dad and son both doing their jobs.
    text: "I told my son I'd stop making dad jokes when he stops groaning. He groaned. I said, 'See? We're both doing our jobs.'",
    scores: [5, 4, 4, 4, 5], // 22/25
  },
  {
    // B: "cool dad" deflated to "lukewarm at best" — instant punch, fresh twist.
    text: "I told my kids I'm not a regular dad, I'm a cool dad. They said, 'Dad, you're lukewarm at best.'",
    scores: [5, 5, 5, 5, 5], // 25/25
  },
  {
    // C: Wi-Fi named "Dad Jokes" — clever premise, softer punch.
    text: "I named our Wi-Fi 'Dad Jokes' — now every guest has to ask for the password and groan twice.",
    scores: [4, 4, 5, 4, 4], // 21/25
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((a, b) => a + b, 0);
}

// Compare in criteria order: first differing criterion decides.
function better(a: Candidate, b: Candidate): boolean {
  for (let i = 0; i < 5; i++) {
    if (a.scores[i] !== b.scores[i]) return a.scores[i] > b.scores[i];
  }
  return total(a) > total(b);
}

let winner = candidates[0];
for (const c of candidates.slice(1)) {
  if (better(c, winner)) winner = c;
}

if (winner.text.length < 1 || winner.text.length > 140) {
  throw new Error(`winner is ${winner.text.length} chars, outside the 1-140 gate`);
}
if (winner.text.includes("\n")) {
  throw new Error("winner must be a single line");
}

mkdirSync(new URL(".", `file://${OUTPUT}`).pathname, { recursive: true });
writeFileSync(OUTPUT, winner.text);
console.log(`${winner.text.length} chars -> ${OUTPUT} (score ${total(winner)}/25)`);
