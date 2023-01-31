const cartBody = document.querySelector("#cart-body");

const renderCart = (data) => {
    let rawHTML = '';
    let i = 1;
    let totalPrice = 0;
    data?.forEach(element => {
        rawHTML += `
        <tr>
            <th scope="row">${i}</th>
            <td>${element.productName}</td>
            <td>${element.descprition || ''}</td>
            <td>${element.quantity}</td>
            <td>${element.price}</td>
            <td>${element.price * element.quantity}</td>
            <td>
                <button class="btn btn-danger btn-remove-item" data-id="${element.productId}">移除</button>
            </td>
        </tr>`;
        i++;
        totalPrice += element.price;
    });
    cartBody.innerHTML = rawHTML;
};

cartBody.addEventListener('click', function onPanelClicked(event) {
    const id = event.target.dataset.id;
    removeFromCart(Number(id));
});

// 刪除購物車項目
function removeFromCart(id) {
    const cartData = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    if (cartData.length == 0) return;

    const movieIndex = cartData.findIndex((element) => element.productId === id);
    if (movieIndex === -1) return;

    //刪除該項目
    cartData.splice(movieIndex, 1);

    //存回 local storage
    localStorage.setItem('cart', JSON.stringify(cartData));

    //更新頁面
    renderCart(cartData);
}


const init = () => {
    const cartData = JSON.parse(localStorage.getItem("cart"));

    renderCart(cartData);
};

init();