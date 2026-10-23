// Hero の球体を等幅の文字で描くための計算。描画（canvas）からは切り離し、マスごとの文字と濃さだけを返す

/** 暗い → 明るいの順に並べた陰影の文字 */
export const RAMP = ".:-=+*#%";
const BITS = "01";
/** 登場時に文字が乱れているあいだに使う文字 */
const SCRAMBLE = "01#%*+=-:.";
/** 濃さの段階。描画側で段階ごとに不透明度を変える */
export const TONES = 4;

export type FrameParams = {
  /** 経過秒 */
  time: number;
  /** 光源の位置（-1〜1）。マウスの位置を渡す */
  light: { x: number; y: number };
  /** 登場の進み具合（0〜1）。1 で乱れがなくなる */
  intro: number;
  /** 球の大きさ（1 が基準）。スクロールで沈めるときに小さくする */
  scale: number;
};

export type Frame = {
  /** マスごとの文字（左上から行ごとに並べる。空白は描かない） */
  glyphs: string[];
  /** マスごとの濃さ（0〜TONES-1） */
  tones: Uint8Array;
};

type Particle = {
  radius: number;
  angle: number;
  height: number;
  speed: number;
  phase: number;
};

const BASE_RADIUS = 0.62;
const PARTICLE_COUNT = 72;

// 乱数の種を固定し、毎回同じ見た目にする
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 2 つの値から 0〜1 の値を決める。フレームをまたいで同じ入力なら同じ値になる
function hash(a: number, b: number) {
  const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/**
 * cols × rows のマスに球を描く関数を作る。
 * 1 マスは縦が横の 2 倍（等幅フォントの 1 文字）として計算する
 */
export function createAsciiSphere({
  cols,
  rows,
  seed = 2218,
}: {
  cols: number;
  rows: number;
  seed?: number;
}) {
  const random = mulberry32(seed);
  const aspect = cols / (rows * 2);
  const size = cols * rows;

  // 登場時に、中心に近いマスから順に（少しばらつかせて）乱れが解ける
  const reveal = new Float32Array(size);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = ((c + 0.5) / cols) * 2 - 1;
      const y = 1 - ((r + 0.5) / rows) * 2;
      reveal[r * cols + c] =
        Math.min(Math.hypot(x * aspect, y) / BASE_RADIUS, 1.4) * 0.55 +
        random() * 0.35;
    }
  }

  // 球の周りの殻（半径 1.12〜1.47 倍）を回る 0 と 1。広げすぎるとスマホで見出しにかかる
  const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
    radius: 1.12 + random() * 0.35,
    angle: random() * Math.PI * 2,
    height: random() * 1.8 - 0.9,
    speed: 0.06 + random() * 0.12,
    phase: random(),
  }));

  return function frame({ time, light, intro, scale }: FrameParams): Frame {
    const glyphs = new Array<string>(size).fill(" ");
    const tones = new Uint8Array(size);
    const radius = BASE_RADIUS * scale;
    const step = Math.floor(time * 12);

    // マウスの位置から光を当てる（既定は左上から）
    const lx = -0.45 + light.x * 0.9;
    const ly = 0.4 - light.y * 0.8;
    const lz = 0.7;
    const ln = Math.hypot(lx, ly, lz);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const x = (((c + 0.5) / cols) * 2 - 1) * aspect;
        const y = 1 - ((r + 0.5) / rows) * 2;
        const d = Math.hypot(x, y);

        // 輪郭をノイズで揺らがせる
        const a = Math.atan2(y, x);
        const edge =
          radius *
          (1 +
            0.035 * Math.sin(3 * a + time * 0.8) +
            0.025 * Math.sin(5 * a - time * 1.3 + 1.7));

        if (reveal[i] > intro * 1.15) {
          // まだ乱れているマス。球のあたりだけ、フレームごとに文字を変える
          if (d < edge * 1.05) {
            const pick = hash(i, step);
            glyphs[i] = SCRAMBLE[Math.floor(pick * SCRAMBLE.length)];
            tones[i] = 1;
          }
          continue;
        }
        if (d >= edge) continue;

        const nx = x / edge;
        const ny = y / edge;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        const lambert = Math.max(0, (nx * lx + ny * ly + nz * lz) / ln);

        // 表面の縞を経度方向に流し、回っているように見せる
        const lon = Math.atan2(nx, nz) + time * 0.35;
        const lat = Math.asin(clamp(ny, -1, 1));
        const bands =
          0.08 *
          Math.sin(lon * 5 + Math.sin(lat * 3 + time * 0.5) * 1.5) *
          Math.cos(lat * 4);
        const b = clamp(0.1 + lambert ** 1.2 * 0.88 + bands, 0, 0.999);

        if (b < 0.06) {
          // 影のいちばん暗いところには、ときどき 0 と 1 をちらつかせる
          if (hash(i, Math.floor(time * 2)) < 0.14) {
            glyphs[i] = BITS[hash(i + 1, Math.floor(time * 2)) < 0.5 ? 0 : 1];
            tones[i] = 0;
          }
          continue;
        }
        glyphs[i] = RAMP[Math.floor(((b - 0.06) / 0.94) * RAMP.length)];
        tones[i] = Math.min(TONES - 1, Math.floor(b * TONES));
      }
    }

    // 登場の後半から、球の周りに 0 と 1 を回す
    for (const p of particles) {
      if (p.phase > intro * 1.6 - 0.6) continue;
      const angle = p.angle + time * p.speed;
      const ring = Math.sqrt(1 - p.height * p.height) * p.radius * radius;
      const px = Math.cos(angle) * ring;
      const py = p.height * p.radius * radius;
      const pz = Math.sin(angle) * ring;
      // 球の裏側に回ったものは隠す
      if (pz < 0 && Math.hypot(px, py) < radius) continue;
      const c = Math.floor((px / aspect + 1) * 0.5 * cols);
      const r = Math.floor((1 - py) * 0.5 * rows);
      if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
      const i = r * cols + c;
      const flip = hash(p.phase * 100, Math.floor(time * 1.5 + p.phase * 10));
      glyphs[i] = BITS[flip < 0.5 ? 0 : 1];
      tones[i] = pz > 0 ? 2 : 1;
    }

    return { glyphs, tones };
  };
}
