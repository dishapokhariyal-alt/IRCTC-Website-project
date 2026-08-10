const captchaBox = document.getElementById("captchaBox");
const captchaInput = document.getElementById("captcha");
const checkCaptcha = document.getElementById("check_captcha");
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function generateCaptcha() {
  let captcha = "";
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    captcha += characters[randomIndex];
  }
  captchaBox.innerText = captcha;
}
generateCaptcha();
checkCaptcha.addEventListener("click", function () {
  if (captchaInput.value === captchaBox.innerText) {
    alert("Correct Captcha");
  } else {
    alert("Wrong Captcha");

    generateCaptcha();

    captchaInput.value = "";
  }
});
