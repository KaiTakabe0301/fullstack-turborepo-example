/**
 * 型ガード関数
 *
 * Apollo Clientの認証処理で使用される型チェック関数群
 */

/**
 * 値がオブジェクトかどうかをチェック
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * 値がstring型のみを含むRecordかどうかをチェック
 */
export function isStringRecord(
  value: unknown
): value is Record<string, string> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(v => typeof v === 'string');
}

/**
 * Auth0アクセストークンレスポンスの型定義
 */
export interface AccessTokenResponse {
  accessToken: {
    token: string;
    expiresAt: number;
    scope?: string;
  };
}

/**
 * Auth0アクセストークンレスポンスの型ガード
 */
export function isAccessTokenResponse(
  data: unknown
): data is AccessTokenResponse {
  if (!isRecord(data)) {
    return false;
  }

  if (!('accessToken' in data)) {
    return false;
  }

  const { accessToken } = data;

  if (!isRecord(accessToken)) {
    return false;
  }

  if (!('token' in accessToken) || !('expiresAt' in accessToken)) {
    return false;
  }

  return (
    typeof accessToken.token === 'string' &&
    typeof accessToken.expiresAt === 'number'
  );
}
