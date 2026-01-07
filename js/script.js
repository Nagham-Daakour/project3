var toastbtn = document.getElementById("showToast")
var toastmsg = document.getElementById("myToast")
if (toastbtn) {
    toastbtn.addEventListener("click", function () {
        var toast = new bootstrap.Toast(toastmsg)
        toast.show();
    })
}
var copyButtons = document.querySelectorAll(".copyBtn");
copyButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        var copiedLabel = btn.nextElementSibling;
        copiedLabel.classList.remove("d-none");
        setTimeout(function () {
            copiedLabel.classList.add("d-none");
        }, 2000);
    });
});