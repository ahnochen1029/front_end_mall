const BASE_URL = 'http://127.0.0.1:8080';



const dataPanel = document.querySelector("#data-panel");

const showProductModal = (id) => {
    const modalTitle = document.querySelector("#mall-modal-title");
    const modalImage = document.querySelector("#mall-modal-image");
    const modalDesc = document.querySelector("#mall-modal-description");
    const modalCategory = document.querySelector("#mall-modal-category")
    axios.get(`${BASE_URL}/products/${id}`).then(res => {
        const data = res.data;
        modalTitle.innerText = data.productName;
        modalImage.innerHTML = `<img src="${data.imageUrl}" alt="poster" class="img-fluid">`;
        modalDesc.innerText = `描述: ${data.description}`;
        modalCategory.innerText = `分類: ${data.category}`
    }).catch(e => {
        console.log('error', e);
    });
};

dataPanel.addEventListener('click', function onPanelClicked(event) {
    if (event.target.matches(".btn-show-mall")) {
        console.log(event.target.dataset);
        showProductModal(Number(event.target.dataset.id));
    }
});

const renderProductList = (data) => {
    let rawHTML = "";

    data.forEach(element => {
        rawHTML += `
        <div class="col-sm-3">
            <div class="mb-2">
                <div class="card">
                    <img
                    src="${element.imageUrl}"
                    class="card-img-top"
                    alt="Poster"/>
                    <div class="card-body">
                        <h5 class="card-title">${element.productName}</h5>
                        <h6 class="card-info">價格: $ ${element.price}</h6>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary btn-show-mall" data-toggle="modal" data-target="#mall-modal" data-id="${element.productId}">More</button>
                        <button class="btn btn-info btn-add-favorite">加入購物車</button>
                    </div>
                </div>
            </div>
        </div>`;
    });

    dataPanel.innerHTML = rawHTML;
};

axios.get(`${BASE_URL}/products`).then(res => {
    const productsList = [];
    productsList.push(...res.data.results);
    renderProductList(productsList);
}).catch(e => {
    console.log('error', e);
});