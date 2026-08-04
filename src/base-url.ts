const VERSION_SEGMENT = /\/v\d+\.\d+$/;

/**
 * Join a caller-supplied `baseUrl` with the version the SDK resolved.
 *
 * `baseUrl` carries the host and path prefix and nothing else; the version
 * segment is always appended here. A version written into `baseUrl` is
 * rejected rather than swapped or appended on top of, because letting two
 * options decide the same path segment is what forced the old precedence
 * rules — and those rules meant anyone who only wanted to change host was
 * made to manage the version by hand.
 */
export const withVersion = (baseUrl: string, version: string, hint = ''): string => {
  const trimmed = baseUrl.replace(/\/+$/, '');
  const existing = trimmed.match(VERSION_SEGMENT);

  if (existing) {
    throw new TypeError(
      `baseUrl must not include a version segment (found '${existing[0]}'). ` +
      `Pass the host and path prefix only: '${trimmed.slice(0, -existing[0].length)}'.` +
      (hint ? ` ${hint}` : '')
    );
  }

  return `${trimmed}/${version}`;
};
