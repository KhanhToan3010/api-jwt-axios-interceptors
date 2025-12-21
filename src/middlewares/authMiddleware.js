import { StatusCodes } from 'http-status-codes'
import { JwtProvider, ACCESS_TOKEN_SECRET_SIGNATURE } from '~/providers/JwtProvider'

// Middleware : Lấy và xác thực JWWT accessToken nhận từ phía FE có hợp lệ hay không
const isAuthorized = async (req, res, next) => {
  // Cách 1: Lấy accessToken nằm trong request cookies phía client - withCredentials trong file authorizeAxios và credentials trong CORS
  //const accessTokenFromCookies = req.cookies?.accessToken
  // console.log('accessTokenFromCookies', accessTokenFromCookies)
  // console.log('-------')
  // if (!accessTokenFromCookies) {
  //   res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! (Token not found)' })
  //   return
  // }

  // Cách 2: Lấy accessToken trong TH FE lưu vào localStorage và gửi lên thông qua header authorization
  const accessTokenFromHeader = req.headers.authorization
  // console.log('accessTokenFromHeader', accessTokenFromHeader)
  // console.log('-------')
  if (!accessTokenFromHeader) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! (Token not found)' })
    return
  }


  try {
    // step1: Giải mã token xem nó có hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      //accessTokenFromCookies, // dungf token theo cach 1
      accessTokenFromHeader.substring('Bearer '.length), // Dung token theo cach 2
      ACCESS_TOKEN_SECRET_SIGNATURE

    )
    // step2: Nếu hợp lệ -> lưu thông ti được giải mã vào req.jwtDecoded để sd cho các tần xl phía sau
    req.jwtDecoded = accessTokenDecoded
    // step3: cho phép request đi tiếp
    next()
  } catch (error) {
    console.log('Erorr form authMiddleware', error)
    // TH1: accessToken hết hạn (expired) thì trả về mã lỗi GONE - 410 cho FE biết để gọi api refreshToken
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Meed to refresh token!' })
      return
    }
    // TH2: accessToken không hợp lệ do vấn đề khác ngoài expired thì trả về mã lỗi 401 cho phía FE xl logout
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! (Please login again)' })
  }
}

export const authMiddleware = {
  isAuthorized
}
