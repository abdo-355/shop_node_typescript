const deleteProduct = async (btn) => {
  try {
    const productId = btn.parentNode.querySelector("[name=productId]").value;
    const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;

    const result = await fetch(`/admin/product/${productId}`, {
      method: "DELETE",
      headers: {
        "CSRF-Token": csrfToken,
      },
    });

    console.log(result);
  } catch (err) {
    console.log(err);
  }
};
