import JWT from 'jsonwebtoken'

/**
 * Func tạo mới 1 token có 3 tham số đầu vào:
 * 1. userInfo - thông tin đính kèm với token
 * 2. secretSignature
 * 3. tokenLife
 */
const genarateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // Hàm sign() của thư viện JWT - thuật toán mặc định là HS256
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) { throw new Error(error) }
}

// Kiểm tra xem token được tạo ra có đúng với chữ kí bí mật secretSignature trong dự án hay không
const verifyToken = async (token, secretSignature) => {
  try {
    //
    return JWT.verify(token, secretSignature)
  } catch (error) { throw new Error(error) }
}

export const JwtProvider = {
  genarateToken,
  verifyToken
}
