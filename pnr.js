const captchaBox = document.getElementById("captchaBox");
const captchaInput = document.getElementById("captcha");
const checkCaptcha = document.getElementById("check_captcha");
const pnrForm = document.querySelector(".user_pnr_details");
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

function captchaIsCorrect() {
  return captchaInput.value.trim().toUpperCase() === captchaBox.innerText;
}

// "Check Captcha" button (now type="button") just tells the user the result
checkCaptcha.addEventListener("click", function () {
  if (captchaIsCorrect()) {
    alert("Correct Captcha");
  } else {
    alert("Wrong Captcha");
    generateCaptcha();
    captchaInput.value = "";
  }
});

// "Check Status" only goes to the result page if the captcha is right
pnrForm.addEventListener("submit", function (e) {
  if (!captchaIsCorrect()) {
    e.preventDefault();
    alert("Wrong Captcha");
    generateCaptcha();
    captchaInput.value = "";
  }
});
