const products = [
    {name: "1 Bocha", price: 1000 },
    {name: "2 Bochas", price: 1500 },
    {name: "3 Bochas", price: 2000},
    {name: "Batido de frutilla", price: 1150 },
    {name: "Batido de chocolate", price: 1300 },
    {name: "Batido de vainilla", price: 990}
];

function getOrderList() {
 return JSON.parse(localStorage.getItem('orders')) || [];
}

function getOrderNumber() {
    return Number(localStorage.getItem('orderNumber')) || 1;
}

// Función para agregar filas de productos a la tabla
function buildTable() {
    const tableBody = document.querySelector("#productTable tbody");

    products.forEach(product => {
      const row = document.createElement("tr");
      const cellName = document.createElement("td");
      const cellPrice = document.createElement("td");

      cellName.textContent = product.name;
      cellPrice.textContent = `$${product.price}`;

      row.appendChild(cellName);
      row.appendChild(cellPrice);

      tableBody.appendChild(row);
    });
}

//Función para agregar un pedido
function addOrder() {
    
    const container = document.getElementById("container")

    const order = {
        number: getOrderNumber(),
        total: 0,
        items: []
    }
    for (const child of container.children) {
        const selectedProduct = child.children[3]
        const quantityInput = child.children[7]
        const quantity = parseInt(quantityInput.value);

        if (selectedProduct.value!="0"&&quantity>0) {
            // Calcular el precio total del producto
            const [productName, price] = selectedProduct.value.split("|");
            const unitPrice = parseFloat(price);

            // Agregar el pedido a la lista de pedidos
            order.items.push({    
                product: productName,
                quantity
            });
            order.total += (unitPrice * quantity)
        }
    }
    if(order.items.length==0){
        return
    }
    const orderList = getOrderList()
    orderList.push(order)
    const orderNumber = getOrderNumber()

    // Guardar la lista de pedidos en localStorage
    localStorage.setItem('orders', JSON.stringify(orderList));
    // Guardar el número de pedido en localStorage
    localStorage.setItem('orderNumber', orderNumber+1);

    // Mostrar la lista actualizada de pedidos
    showOrders();
    // Restablecer los valores del producto y la cantidad
    initContainer();
}

// Función para mostrar la lista de pedidos
function showOrders() {
    const orderListElement = document.getElementById("orderList");
    orderListElement.innerHTML = "";

    const orderList = getOrderList()
    orderList.forEach(order => {
        const listItem = document.createElement("li");
        let message= "";
        order.items.forEach(item =>{
            message+= `${item.product} x ${item.quantity}<br>`;
        })
        listItem.innerHTML = `Pedido #${order.number}:<br> ${message}Total: $${order.total}`;
        
        // Crear botón "Entregado" para cada pedido
        const deliverButton = document.createElement("button");
        deliverButton.textContent = "Entregar";
        deliverButton.addEventListener("click", function() {
            // Eliminar el pedido del array y del localStorage
            const newOrderList = getOrderList().filter(item => item.number !== order.number);
            localStorage.setItem('orders', JSON.stringify(newOrderList));
            // Volver a mostrar los pedidos
            showOrders();
        });

        listItem.appendChild(deliverButton);
        orderListElement.appendChild(listItem);
    });
}

function addEventToButton(){
    document.getElementById("accept-btn").addEventListener("click", addOrder);
    document.getElementById("reset").onclick = initContainer;
    document.getElementById("addOrderBtn").onclick = addNewProduct;
}

function addNewProduct(){ 
    
    const c = document.getElementById("container")
    for (const child of c.children) {
        const selectedProduct = child.children[3]
        const quantityInput = child.children[7]
        if (selectedProduct.value == "0" || parseInt(quantityInput.value) <=0) {
            return
        }
    }

    const parent = document.createElement("div")
    
    const productLabel = document.createElement("label")
    productLabel.textContent = "Producto:"

    const selectProduct = document.createElement("select");
    
    selectProduct.appendChild(new Option("Elige un producto", "0"))
    selectProduct[0].disabled=true
    products.forEach(product => {
        const option = new Option(`${product.name} - $${product.price}`, product.name + "|" + product.price);

        selectProduct.appendChild(option);
    });

    const quantityLabel = document.createElement("label")
    quantityLabel.textContent = "Cantidad:"

    const inputQuantity = document.createElement("input")
    inputQuantity.type= "number"
    inputQuantity.min = "1"
    inputQuantity.value = "1"

    parent.appendChild(document.createElement("br"))
    parent.appendChild(document.createElement("br"))
    parent.appendChild(productLabel)
    parent.appendChild(selectProduct)
    parent.appendChild(document.createElement("br"))
    parent.appendChild(document.createElement("br"))
    parent.appendChild(quantityLabel)
    parent.appendChild(inputQuantity)

    const container = document.getElementById("container")
    container.appendChild(parent)
}

function initContainer() {
    const container = document.getElementById("container")
    while (container.firstChild) {
        container.removeChild(container.lastChild);
      }
    addNewProduct()
}

window.addEventListener("load", function() {
    initContainer()
   
    //Inicializa la tabla con los productos
    buildTable();

    // Agregar evento a los botón 
    addEventToButton();

    // Mostrar pedidos almacenados en localStorage al cargar la página
    showOrders();
});











