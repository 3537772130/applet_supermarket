var CryptoJS = require('./aes.js'); //引用AES源码js
var key = CryptoJS.enc.Utf8.parse("8050207040109060"); //十六位十六进制数作为秘钥
var iv = CryptoJS.enc.Utf8.parse('6030205010408090');//十六位十六进制数作为秘钥偏移量
//解密方法
var decrypt = function (word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
//加密方法
var encrypt = function (word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString().toUpperCase();
}

//暴露接口
module.exports.decrypt = decrypt;
module.exports.encrypt = encrypt;