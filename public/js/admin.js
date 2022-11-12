const deleteProduct = async (btn) => {
  try {
    const productId = btn.parentNode.querySelector("[name=productId]").value;
    const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;
    const productElement = btn.closest("article");

    const result = await fetch(`/admin/product/${productId}`, {
      method: "DELETE",
      headers: {
        "CSRF-Token": csrfToken,
      },
    });

    const data = await result.json();
    console.log(data);

    productElement.remove();
  } catch (err) {
    console.log(err);
  }
};
