import { FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS } from '../constants';

export type WebSocketProduct = keyof typeof FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS;

export type WebSocketVersion = typeof FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS[WebSocketProduct][number];

/**
 * Per-product form. Each product is narrowed to the versions it actually
 * serves, so `{ stock: 'v1.1' }` is a compile-time error. A product left out
 * of the map — including the empty map — gets that product's latest.
 */
export type WebSocketVersionMap = {
  [P in WebSocketProduct]?: typeof FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS[P][number];
};

/**
 * The `version` option: always a per-product map.
 *
 * A bare version string used to be accepted as "this version for every
 * product", but which product it applied to wasn't known until a client was
 * taken off the factory, so an unsupported pairing only surfaced then — and
 * with the products serving different version sets, the only scalar that never
 * throws is the one every product happens to share. The map form says the same
 * thing without the trap.
 */
export type WebSocketVersionOption = WebSocketVersionMap;

const supportedVersions = (product: WebSocketProduct): readonly string[] =>
  FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS[product];

const latestVersion = (product: WebSocketProduct): string => {
  const versions = supportedVersions(product);
  return versions[versions.length - 1];
};

const productsSupporting = (version: string): WebSocketProduct[] =>
  (Object.keys(FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS) as WebSocketProduct[])
    .filter(product => supportedVersions(product).includes(version));

const assertSupported = (product: WebSocketProduct, version: string, hint: string) => {
  if (!supportedVersions(product).includes(version)) {
    throw new TypeError(
      `${product} streaming does not support ${version} ` +
      `(supported: ${supportedVersions(product).join(', ')}). ${hint}`
    );
  }
};

/**
 * Resolve the streaming version for a product from the `version` option.
 *
 * Omitted entirely, an empty map, or omitted for this product all mean the same
 * thing: that product's latest. Nothing is ever silently clamped — asking for a
 * version a product doesn't serve throws rather than quietly handing back an
 * older one.
 */
export const resolveVersion = (product: WebSocketProduct, version?: WebSocketVersionOption): string => {
  if (version === undefined) return latestVersion(product);

  // Guard for JavaScript callers, who don't get the compile-time rejection.
  if (typeof version === 'string') {
    const alternatives = productsSupporting(version);
    throw new TypeError(
      `version must be a per-product map, not the bare string '${version}'. ` +
      (alternatives.length
        ? `Use version: { ${alternatives.map(p => `${p}: '${version}'`).join(', ')} }.`
        : `No product serves ${version}.`)
    );
  }

  const requested = version[product];
  if (requested === undefined) return latestVersion(product);

  assertSupported(product, requested, `Remove it from the version map to use ${latestVersion(product)}.`);
  return requested;
};

/** Appended to `baseUrl` rejections, pointing at the option that owns the version. */
export const VERSION_OPTION_HINT =
  "The version comes from the `version` option, e.g. version: { futopt: 'v1.1' }.";
