document.addEventListener('DOMContentLoaded', () => {
    // Obtención de referencias a los elementos del DOM
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const productosToggle = document.getElementById('productos-toggle');
    const submenuProductos = document.getElementById('submenu-productos');
    const overlay = document.getElementById('overlay'); // El elemento overlay que cubre el fondo

    // --- Funciones auxiliares ---

    // Función para mostrar/ocultar el overlay y controlar el scroll del body
    function toggleOverlay(show) {
        if (show) {
            overlay.classList.add('visible'); // Agrega la clase 'visible' para activar el display: block
            document.body.classList.add('no-scroll'); // Evita el scroll en el body
            // Pequeño retraso para asegurar que 'display: block' se aplique antes de la transición de opacidad
            setTimeout(() => {
                overlay.style.opacity = '1';
            }, 10);
        } else {
            overlay.style.opacity = '0'; // Inicia la transición para hacer el overlay transparente
            // Espera a que la transición de opacidad termine antes de ocultar completamente el overlay
            overlay.addEventListener('transitionend', function handler() {
                overlay.classList.remove('visible'); // Oculta el overlay removiendo la clase 'visible'
                document.body.classList.remove('no-scroll'); // Permite el scroll de nuevo en el body
                overlay.removeEventListener('transitionend', handler); // Elimina el listener para evitar duplicados
            }, { once: true }); // El listener se ejecutará solo una vez

            // Fallback en caso de que la transición no se dispare (ej. si el elemento ya no estaba visible)
            if (getComputedStyle(overlay).opacity === '0') {
                 overlay.classList.remove('visible');
                 document.body.classList.remove('no-scroll');
            }
        }
    }

    // Función para cerrar completamente el menú (móvil) y el submenú, y ocultar el overlay
    function closeAllMenus() {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
        if (submenuProductos.classList.contains('open')) {
            submenuProductos.classList.remove('open');
        }
        productosToggle.classList.remove('active'); // Restablece el color de "Productos"
        toggleOverlay(false); // Oculta el overlay
    }


    // --- Event Listeners ---

    // 1. Clic en el botón de hamburguesa
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active'); // Alterna la visibilidad del menú principal

            if (navLinks.classList.contains('active')) {
                // Si el menú principal se abre, muestra el overlay
                toggleOverlay(true);
            } else {
                // Si el menú principal se cierra, cierra todo y oculta el overlay
                closeAllMenus();
            }
        });
    }

    // 2. Clic en "Productos" para desplegar/contraer el submenú
    if (productosToggle && submenuProductos) {
        productosToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el enlace # navegue

            // Alterna la clase 'open' en el submenú y 'active' en el toggle de Productos
            submenuProductos.classList.toggle('open');
            productosToggle.classList.toggle('active');

            // Lógica para el overlay en móvil:
            // Si el submenú de Productos se abre Y estamos en una pantalla móvil
            if (window.innerWidth <= 768 && submenuProductos.classList.contains('open')) {
                navLinks.classList.add('active'); // Asegura que el menú principal esté abierto para que el submenú se vea
                toggleOverlay(true); // Muestra el overlay
            }
            // Si el submenú de Productos se cierra Y estamos en móvil Y el menú principal no está activo
            // (esto previene que el overlay se oculte si el menú principal tiene otros elementos visibles)
            else if (window.innerWidth <= 768 && !submenuProductos.classList.contains('open') && !navLinks.classList.contains('active')) {
                toggleOverlay(false); // Oculta el overlay
            }
            // En escritorio, el overlay NO se activa solo por el submenú de productos.
            // Solo se activa si el menú principal móvil (hamburguesa) está abierto.
        });
    }

    // 3. Clic en cualquier enlace del menú (para cerrar el menú en móvil)
    navLinks.querySelectorAll('.nav-link-item').forEach(link => {
        // Excluimos el propio "productosToggle" porque su clic es para abrir/cerrar su submenú.
        // Los elementos dentro del submenú de productos también cerrarán el menú principal.
        if (link.id !== 'productos-toggle') {
            link.addEventListener('click', () => {
                // Solo cerrar todo si estamos en móvil y el menú principal está activo
                if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
                    closeAllMenus(); // Cierra todos los menús y el overlay
                } else if (window.innerWidth > 768) {
                    // En escritorio, si haces clic en un enlace (que no sea productos), cierra el submenú de productos si está abierto
                    if (submenuProductos.classList.contains('open')) {
                         submenuProductos.classList.remove('open');
                         productosToggle.classList.remove('active');
                    }
                }
            });
        }
    });

    // 4. Clic fuera del menú (para cerrar todo)
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickInsideHamburger = hamburger.contains(event.target);
        const isClickInsideSubmenu = submenuProductos.contains(event.target);
        const isClickOnProductosToggle = productosToggle.contains(event.target);
        const isClickOnOverlay = overlay.contains(event.target); // Si el clic fue directamente en el overlay

        // Si el clic fue en el overlay O fue fuera de todos los elementos interactuables del menú
        if (isClickOnOverlay || (!isClickInsideNav && !isClickInsideHamburger && !isClickInsideSubmenu && !isClickOnProductosToggle)) {
            closeAllMenus(); // Cierra todos los menús y el overlay
        }
    });

    // 5. Manejar el estado del menú al redimensionar la ventana (ej. de móvil a escritorio)
    function setNavDisplay() {
        if (window.innerWidth >= 769) { // Pantalla de escritorio/tableta
            // Asegurarse de que el menú principal móvil esté cerrado y el menú de escritorio sea visible
            navLinks.classList.remove('active'); // Oculta el menú de hamburguesa si estaba abierto
            navLinks.style.display = 'flex'; // Fuerza el display flex para el menú de escritorio
            // Asegurarse de que el submenú de Productos esté cerrado y reseteado
            submenuProductos.classList.remove('open');
            productosToggle.classList.remove('active');
            // Asegurarse de que el overlay esté oculto
            toggleOverlay(false);
        } else { // Pantalla móvil
            // Restablecer el display para que sea controlado por la clase 'active' del menú de hamburguesa
            navLinks.style.display = '';
            // Asegurarse de que el submenú de Productos esté cerrado y reseteado
            submenuProductos.classList.remove('open');
            productosToggle.classList.remove('active');
            // Si el menú principal no está activo, el overlay debe estar oculto
            if (!navLinks.classList.contains('active')) {
                toggleOverlay(false);
            }
        }
    }

    // Llamar a la función 'setNavDisplay' al cargar la página para establecer el estado inicial correcto
    setNavDisplay();

    // Añadir un event listener para cuando la ventana del navegador cambia de tamaño
    window.addEventListener('resize', setNavDisplay);
});
