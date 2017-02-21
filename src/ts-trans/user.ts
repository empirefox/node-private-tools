/**
 * @trans disabled
 */
export interface ISetUserInfoPayload {
  /**
   * @tr zh:"昵称", en:"Nick Name"
  */
  Nickname: string;
  /**
   * @tr    zh:"性别"
  */
  Sex: number;
  City: string;
  Province: string;
  Birthday: number;
  CarInsurance: string;
  InsuranceFee: number;
  CarIntro: string;
  Hobby: string;
  Career: string;
  Demand: string;
  Intro: string;
}

export interface IUserInfo {
  // from jwt, write limit
  ID: number;
  /**
   * @tr  zh:"OOO"
   */
  OpenId: string;
  /**@tr zh:"ppp" */
  Phone: string;
 /**@tr en:"uuuu" */ User1: number;

  Writable: ISetUserInfoPayload;

  HeadImageURL: string;

  // ro
  CreatedAt: number;
  UpdatedAt: number;
  HasPayKey: boolean;
}

export interface ISetUserInfoResponse {
  UpdatedAt: number;
}

export interface IUserTokenResponse {
  AccessToken: string;
  RefreshToken: string;
  User: IUserInfo;
}

export interface IPreBindPhonePayload {
  Phone: string;
}

export interface IBindPhonePayload {
  Phone: string;
  Code: string;
  CaptchaID: string;
  Captcha: string;
  RefreshToken?: string;
}

export interface IRefreshTokenResponse {
  OK: boolean;
  AccessToken: string;
}

export interface ISetPaykeyPayload {
  Key: string;
  Code: string;
  CaptchaID: string;
  Captcha: string;
}

export interface ExchangePayload {
  code: string;
  state: string;
  user1?: number;
}