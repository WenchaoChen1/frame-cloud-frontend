// @ts-ignore
/* eslint-disable */
declare namespace APIIdentity {
  type Oauth2TokenResultDataType = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: string;
  };
  type Oauth2TokenParamsDataType = {
    grant_type: 'password'|'refresh_token';
    refresh_token?: string;
    username?: string;
    password?: string;
    rememberMe?: boolean;
    type?: string;
  };
  type Oauth2TokenParamsDataType = {
    grant_type: 'password'|'refresh_token';
    refresh_token?: string;
    username?: string;
    password?: string;
    rememberMe?: boolean;
    type?: string;
  };
  type UserLoginBodyDataType = {
    username?: string;
    password?: string;
    rememberMe?: boolean;
  };
  type CurrentUser = {
    accountId?: string;
    accountName?: string;
    accountType?: string;
    tenantId?: string;
    userId?: string;
    currentLoginAccount?: {
      id?: string;
      userid?: string;
      name?: string;
      avatar?: string;
      createdAt?: string;
      createdBy?: string;
      updatedAt?: string;
      updatedBy?: string;
      deleted?: number,
      identity?: string;
      tenantId?: string;
      userId?: string;
      mirrorTenantId?: string;
      user?: {
        updatedBy?: string;
        gender?: number;
        mobile?: string;
        avatar?: string;
        createdAt?: string;
        password?: string;
        deleted?: number;
        createdBy?: string;
        id?: string;
        email?: string;
        updatedAt?: string;
        username?: string;
      }
    };
    currentLoginAccountUserPermissions?: API.RouteTreeItemDataType[];
    tenant?: {
      id?: string;
      parentId?: string;
      status?: number;
      type?: number;
      tenantCode?: string;
      tenantName?: string;
      description?: string;
      updatedBy?: string;
      createdAt?: string;
      createdBy?: string;
    },

    redirect?: string;
    permission?: string[];
    dynamicRouteTree?: API.MenuTreeItemDataType[];
  };
  type signOutParams = {
    /** Access Token */
    accessToken: string;
  };

  // TODO
  // 分页Bo对象
  // type findByPage4Params = {
  //   pager: Pager;
  // };

  type Pager = {
    direction?: string; // 排序方向的值只能是大写 ASC 或者 DESC, 默认值：DESC
    properties?: string[]; // 指定排序的字段名称
    pageNumber: number;
    pageSize: number;
  };

  type authorization = {
    id?: string;
    registeredClientId?: string;
    principalName?: string;
    authorizationGrantType?: string;
    authorizedScopes?: string;
    attributes?: string;
    state?: string;
    authorizationCodeValue?: string;
    authorizationCodeIssuedAt?: string;
    authorizationCodeExpiresAt?: string;
    authorizationCodeMetadata?: string;
    accessTokenValue?: string;
    accessTokenIssuedAt?: string;
    accessTokenExpiresAt?: string;
    accessTokenMetadata?: string;
    accessTokenType?: string;
    accessTokenScopes?: string;
    oidcIdTokenValue?: string;
    oidcIdTokenIssuedAt?: string;
    oidcIdTokenExpiresAt?: string;
    oidcIdTokenMetadata?: string;
    oidcIdTokenClaims?: string;
    refreshTokenValue?: string;
    refreshTokenIssuedAt?: string;
    refreshTokenExpiresAt?: string;
    refreshTokenMetadata?: string;
    userCodeValue?: string;
    userCodeIssuedAt?: string;
    userCodeExpiresAt?: string;
    userCodeMetadata?: string;
    deviceCodeValue?: string;
    deviceCodeIssuedAt?: string;
    deviceCodeExpiresAt?: string;
    deviceCodeMetadata?: string;
    createdDate:string,
    updatedDate:string
  };

  type application = {
    updatedDate?: string;
    applicationName?: string;
    abbreviation?: string;
    authorizationGrantTypes?: string[];
    accessTokenValidity?: string;
    refreshTokenValidity?: string;
    authorizationCodeValidity?: string;
    deviceCodeValidity?: string;
    status?: string;
    createdDate?: string;
    updatedDate?: string;
    clientId?: string;
    clientSecret?: string;
    logo?: string;
    homepage?: string;
    clientAuthenticationMethods?: string;
    applicationType?: string;
    clientSecretExpiresAt?: string;
    redirectUris?: string;
    jwkSetUrl?: string;
    requireProofKey?: boolean;
    requireAuthorizationConsent?: boolean;
    idTokenSignatureAlgorithm?: string;
    reuseRefreshTokens?: boolean;
    description?: string;
    ranking?: number;
    reserved?: boolean;
  };

  type scopeItemType = {
    scopeName?: string;
    scopeCode?: string;
    createdDate?: string;
    updatedDate?: string;
    scopeId?: string;
  };

  type complianceItemType = {
    principalName?: string;
    clientId?: string;
    ip?: string;
    osName?: string;
    android?: string;
    operation?: string;
    createdDate?: string;
    updatedDate?: string;
    current?: number;
    pageSize?: number;
  };
}
