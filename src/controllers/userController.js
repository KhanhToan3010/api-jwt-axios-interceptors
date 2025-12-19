import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { JwtProvider, JWTProvider } from '~/providers/JwtProvider'

/**
 * Mock nhanh thông tin user thay vì phải tạo Database rồi query.
 */
const MOCK_DATABASE = {
  USER: {
    ID: 'toandev-sample-id-12345678',
    EMAIL: 'khanhtoan18079261@gmail.com',
    PASSWORD: 'toandev123'
  }
}

/**
 * 2 cái chữ ký bí mật quan trọng trong dự án. Dành cho JWT - Jsonwebtokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế cho bảo mật.
 * Demo thôi nên mới đặt biến const và giá trị random ngẫu nhiên trong code luôn.
 */
const ACCESS_TOKEN_SECRET_SIGNATURE = 'ZMXXrCiFicCcclDofO7XlyrGok85o9NG'
const REFRESH_TOKEN_SECRET_SIGNATURE = '0fvDpSaCR44DehhTKxRkj2AqDzq6LM7f'

const login = async (req, res) => {
  try {
    if (req.body.email !== MOCK_DATABASE.USER.EMAIL || req.body.password !== MOCK_DATABASE.USER.PASSWORD) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' })
      return
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    // Tạo thông tin payload đính kèm trong JWT Token: id, email cửa user
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL
    }
    // Tạo access token và refresh token để trả về FE cho người dùng
    const accessToken = await JwtProvider.genarateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      '1h'
    )
    const refreshToken = await JwtProvider.genarateToken(
      userInfo,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days'
    )

    /** Xử lí trả về http only cookie cho phía trình duyệt
     * maxAge - thời gian sống của cookie khác với thời gian sống cửa token
    */
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: ms('14 days'),
      sameSite: 'none'
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: ms('14 days'),
      sameSite: 'none'
    })

    // Trả về thông tin user, Tokens cho trường hợp phía FE cần lưu Tokens vào LocalStorage
    res.status(StatusCodes.OK).json({
      ...userInfo,
      accessToken,
      refreshToken
})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Do something
    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // Do something
    res.status(StatusCodes.OK).json({ message: ' Refresh Token API success.' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const userController = {
  login,
  logout,
  refreshToken
}
