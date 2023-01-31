const cartBody = document.querySelector("#cart-body");

const renderCart = (data) => {
    let rawHTML = '';
    let i = 1;
    let totalPrice = 0;
    data?.forEach(element => {
        let optionHTML = '';
        for (let j = 1; j < 6; j++) {
            if (j !== element.quantity) {
                optionHTML += `
                <option value="${j}">${j}</option>
                `;
            }
        }
        rawHTML += `
        <tr>
            <th scope="row">${i}</th>
            <td>${element.productName}</td>
            <td>
            <select class="custom-select" id="cart-change-quantity-${element.productId}" data-id="${element.productId}"required>
                <option selected disabled value="${element.quantity}">${element.quantity}</option>
                ${optionHTML}
            </select>
            </td>
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

// 更新購物車項目數量
function changeQtyFromCart(id, value) {
    const cartData = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    if (cartData.length == 0) return;

    const item = cartData.find((element) => element.productId === id);

    item.quantity = value;

    //存回 local storage
    localStorage.setItem('cart', JSON.stringify(cartData));

}

cartBody.addEventListener('click', function onPanelClicked(event) {
    const id = event.target.dataset.id;
    if (event.target.matches('.btn-remove-item')) {
        removeFromCart(Number(id));
    } else if (event.target.matches('.custom-select')) {
        console.log('select.....');
        const changeQuantity = document.getElementById(`cart-change-quantity-${id}`);
        const value = changeQuantity.value;
        console.log('value=>', value);
        changeQtyFromCart(Number(id), Number(value));
    }
});

// 刪除購物車項目
function removeFromCart(id) {
    const cartData = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    if (cartData.length == 0) return;

    const itemIndex = cartData.findIndex((element) => element.productId === id);
    if (itemIndex === -1) return;

    //刪除該項目
    cartData.splice(itemIndex, 1);

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