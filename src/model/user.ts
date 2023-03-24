export interface UserLogin {
  username: string;
  password: string;
}

/**
 * UserInfoVO，用户信息
 */
export interface UserInfo {
  /**
   * 用户头像
   */
  avatar: string;
  /**
   * 邮箱号
   */
  email: string;
  /**
   * 用户账号id
   */
  id: number;
  /**
   * 用户简介
   */
  intro: string;
  /**
   * 用户昵称
   */
  nickname: string;
  /**
   * 令牌信息
   */
  token: Token;
  /**
   * 用户名
   */
  username: string;
  /**
   * 个人网站
   */
  webSite: string;
}

/**
 * TokenVO，令牌信息
 */
export interface Token {
  /**
   * 认证token
   */
  accessToken: string;
  /**
   * 刷新token
   */
  refreshToken: string;
}
