import { FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS } from '../constants';

export type WebSocketProduct = keyof typeof FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS;

export type WebSocketVersion = typeof FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS[WebSocketProduct][number];

/**
 * Per-product form. Each product is narrowed to the versions it actually
 * serves, so `{ stock: 'v1.1' }` is a compile-time error.
 */
export type WebSocketVersionMap = {
  [P in WebSocketProduct]?: typeof FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS[P][number];
};

/**
 * Either a single version applied to every product, or a per-product map.
 *
 * The scalar form can't be checked at compile time — which product it ends up
 * applying to isn't known until a client is taken off the factory — so an
 * unsupported combination throws when that client is created.
 */
export type WebSocketVersionOption = WebSocketVersion | WebSocketVersionMap;

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
 * Omitted entirely, or omitted for this product in the map form, means the
 * product's latest. Nothing is ever silently clamped: asking for a version a
 * product doesn't serve throws rather than quietly handing back an older one.
 */
export const resolveVersion = (product: WebSocketProduct, version?: WebSocketVersionOption): string => {
  if (version === undefined) return latestVersion(product);

  if (typeof version === 'string') {
    const alternatives = productsSupporting(version);
    assertSupported(product, version, alternatives.length
      ? `Use version: { ${alternatives[0]}: '${version}' } to target a single product.`
      : `No product serves ${version}.`);
    return version;
  }

  const requested = version[product];
  if (requested === undefined) return latestVersion(product);

  assertSupported(product, requested, `Remove it from the version map to use ${latestVersion(product)}.`);
  return requested;
};

const VERSION_SEGMENT = /\/v\d+\.\d+$/;

/**
 * Point an explicitly supplied `baseUrl` at `version` by swapping its trailing
 * version segment (`.../marketdata/v1.0` → `.../marketdata/v1.1`).
 *
 * A baseUrl without a recognizable version segment is left alone — it may be a
 * proxy or an internal deployment that doesn't encode a version in its path,
 * and inventing one would break it.
 */
export const applyVersionToBaseUrl = (baseUrl: string, version: string): string => {
  const trimmed = baseUrl.replace(/\/+$/, '');
  return VERSION_SEGMENT.test(trimmed)
    ? trimmed.replace(VERSION_SEGMENT, `/${version}`)
    : trimmed;
};
