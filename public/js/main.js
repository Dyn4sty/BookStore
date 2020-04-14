const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");
const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.classList.remove("open");
}

function menuToggleClickHandler() {
  backdrop.style.display = "block";
  sideDrawer.classList.add("open");
}
const addToCartHandler = (event) => {
  const productId = event.srcElement.getAttribute("product-id");
  console.log("frontend", productId);
  fetch("/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }) ,
  })
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log("Success:", data);
    // })
    // .catch((error) => {
    //   console.error("Error:", error);
    // });
};

backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);
addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", addToCartHandler);
});
