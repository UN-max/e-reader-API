const checkEmail = strEmail => {
  if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(strEmail)) {
    return false;
  } else {
    return true;
  }
}

const checkPassword = strPsw => {
  if (!/^[0-9a-zA-Z]{6,}$/.test(strPsw)) {
    return false
  } else {
    return true
  }
}

module.exports = {
  checkEmail,
  checkPassword
}
