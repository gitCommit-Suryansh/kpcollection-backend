import Cookies from "js-cookie";

const removeCookies = () => {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    Cookies.remove(name); // Remove each cookie by name
  }
};
module.exports.removeCookies=removeCookies
    