const axios = require('axios');

const generateAccessToken = async () => {
  try {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const client_version = process.env.CLIENT_VERSION;
    const grant_type = process.env.GRANT_TYPE;

    const tokenResponse = await axios.post(
      `${process.env.AUTHORIZATION_BASE_URL}${process.env.AUTHORIZATION_END_POINT}`,
      {
        client_id,
        client_version,
        client_secret,
        grant_type
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (tokenResponse.status === 200) {
      return {
        success: true,
        accessToken: tokenResponse.data.access_token
      };
    } else {
      throw new Error('Failed to generate access token');
    }
  } catch (error) {
    console.error('Error generating access token:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

module.exports = generateAccessToken;