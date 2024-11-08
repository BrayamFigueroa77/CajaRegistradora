const selectProducto = document.getElementById('producto');
const valorProducto = document.getElementById('valor_producto');
const valorCantidad = document.getElementById('valor_cantidad');
const btnComprar = document.getElementById('btn-comprar');
const btnBorrar = document.getElementById('btn-borrar');
const resultadoCompra = document.getElementById('resultado_compra');
const totalCompra = document.getElementById('total_compra');
const valorCompra = document.getElementById('valor_compra'); // Para mostrar el valor de la compra
const imagenProducto = document.getElementById('img'); // Elemento para mostrar la imagen

let totalAcumulado = 0; // Variable para almacenar el total acumulado

// Evento para seleccionar el producto
selectProducto.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    
    // Si se selecciona un producto válido
    if (selectedOption.value !== "") {
        valorProducto.value = selectedOption.text; 
        valorCompra.value = ""; 
        valorCantidad.value = ""; 
        
        // Mostrar la imagen del producto seleccionado
        const imagenUrl = selectedOption.getAttribute('data-imagen');
        if (imagenUrl) {
            imagenProducto.src = imagenUrl; // Asignar URL de la imagen
            imagenProducto.style.display = 'block'; // Mostrar la imagen
        } else {
            imagenProducto.style.display = 'none'; // Ocultar si no hay imagen
        }
    } else {
        valorProducto.value = "";
        valorCompra.value = ""; 
        valorCantidad.value = ""; 
        imagenProducto.style.display = 'none'; // Ocultar si no hay selección
    }
});

// Evento para calcular el valor de la compra
valorCantidad.addEventListener('input', function() {
    const precio = parseFloat(selectProducto.options[selectProducto.selectedIndex].getAttribute('data-precio'));
    const cantidad = parseInt(valorCantidad.value);

    if (precio > 0 && cantidad > 0) {
        const valorTotal = precio * cantidad;
        valorCompra.value = `$${valorTotal.toFixed(2)}`; // Mostrar el valor calculado en el campo correspondiente
    } else {
        valorCompra.value = ""; // Limpiar si no hay cantidad o precio válido
    }
});

// Evento para comprar
btnComprar.addEventListener('click', function() {
    const precio = parseFloat(selectProducto.options[selectProducto.selectedIndex].getAttribute('data-precio'));
    const cantidad = parseInt(valorCantidad.value);

    if (selectProducto.selectedIndex === 0) {
        Swal.fire({
            title: "Error",
            text: "Por favor, selecciona un producto antes de proceder.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
        return; 
    }

    if (!cantidad || cantidad <= 0) { // Verificar si la cantidad es válida
        Swal.fire({
            title: "Error",
            text: "Por favor, ingresa una cantidad válida.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    if (precio > 0 && cantidad > 0) {
        const valorTotal = precio * cantidad;

        // Actualizar total acumulado
        totalAcumulado += valorTotal;

        // Mostrar resultado de la compra en resultado_compra
        resultadoCompra.value += `Producto: ${valorProducto.value}, Cantidad: ${cantidad}, Valor: $${valorTotal.toFixed(2)}\n`;
        
        // Mostrar total acumulado en total_compra
        totalCompra.value = `$${totalAcumulado.toFixed(2)}`;

        // Limpiar cantidad después de comprar
        valorCantidad.value = '';
        valorCompra.value = ''; 
        
        Swal.fire({
            title: "¡Comprado!",
            text: "Tu compra ha sido realizada.",
            icon: "success"
        });
    } else {
        alert("Por favor selecciona un producto y una cantidad válida.");
    }
});

// Evento para borrar campos
btnBorrar.addEventListener('click', function() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres borrar toda la compra?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Reiniciar selección y limpiar campos
            selectProducto.selectedIndex = 0; // Reiniciar selección
            valorProducto.value = ""; // Limpiar nombre del producto
            valorCantidad.value = ""; // Limpiar cantidad
            resultadoCompra.value = ""; // Limpiar resultado
            totalCompra.value = ""; // Limpiar total
            valorCompra.value = ""; // Limpiar valor de compra
            
            totalAcumulado = 0; // Reiniciar total acumulado
            
            swalWithBootstrapButtons.fire({
                title: "¡Borrado!",
                text: "Toda la compra ha sido borrada.",
                icon: "success"
            });
            
            imagenProducto.style.display = 'none'; // Ocultar la imagen al borrar
            
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "Tu compra sigue intacta.",
                icon: "error"
            });
        }
    });
});