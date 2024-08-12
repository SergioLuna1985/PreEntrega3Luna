
document.addEventListener("DOMContentLoaded", () => {

  const mapa = [
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
  ]

  const reserva = JSON.parse(localStorage.getItem("reserva")) || [];
  const container = document.getElementById("contenedor");
  const ticketContainer = document.getElementById("ticket");
  const lugares = [];

  function crearLugares() {

    let contador = 0;
    let asiento = 1;

    mapa.forEach((row, y) => {
      row.forEach((value, x) => {

        const lugar = {

          id: contador++,
          asiento: value === 1 && asiento,
          estado: Boolean(value),
          reservado: reserva.some(el => el.asiento === asiento),
          columna: x + 1,
          fila: y + 1,
          precio: y < 3 ? 5500 : y > 7 ? 3500 : 2500,
          nombre: "",
          apellido: "",
          dni: ""

        }

        value === 1 && asiento++;

        lugares.push(lugar);

      })
    })
  }

  function mostrarLugares() {

    const table = document.createElement("table");
    container.append(table);
    const tbody = document.createElement("tbody");
    table.append(tbody);

    mapa.forEach((row, y) => {

      const tr = document.createElement("tr");
      tbody.append(tr);

      row.forEach((value, x) => {

        const posicion = (y * 30) + x;

        const td = document.createElement("td");

        td.className = lugares[posicion].estado ? "disponible" : "no_disponible";

        reserva.find(el => el.asiento === lugares[posicion].asiento) && td.classList.add("seleccionada");

        td.innerText = lugares[posicion].asiento || "";

        tr.append(td);

      })
    })

    const divMensaje = document.createElement("div");

    container.append(divMensaje);

    const h3 = document.createElement("h3");
    h3.className = "titulo";

    const p = document.createElement("p");
    p.className = "precio"

    const button = document.createElement("button");
    button.innerText = "LIMPIAR LUGARES";
    
    button.addEventListener("click", () => {

      localStorage.setItem("reserva", JSON.stringify([]));
      document.location.reload();

    })

    divMensaje.append(h3);
    divMensaje.append(p);
    divMensaje.append(button);
  }

  function mostrarTickets() {

    document.querySelectorAll(".card").forEach(card => card.remove());

    if (reserva.length) {

      reserva.forEach((el) => {

        const card = document.createElement("div");
        card.className = "card";

        const titulo = document.createElement("h3");
        titulo.innerText = `Asiento: ${el.asiento} Fila: ${el.fila} Columna: ${el.columna}`;

        const parrafo = document.createElement("p");
        parrafo.innerText = `Precio: $${el.precio}`

        card.append(titulo);
        card.append(parrafo);
        ticketContainer.append(card)

      })

      const isCard = document.querySelector(".cardSuma");
      isCard && isCard.remove();

      const cardSuma = document.createElement("div");
      cardSuma.className = "cardSuma";

      const titulo = document.createElement("h3");

      const suma = reserva.reduce((acc, el) => el.precio + acc, 0);

      titulo.innerText = `Total: ${suma}`;

      cardSuma.append(titulo);

      ticketContainer.append(cardSuma);

    }
  }

  function agregarReserva(lugar) {

    !reserva.some(el => el.asiento === lugar.asiento) && reserva.push(lugar);
    localStorage.setItem("reserva", JSON.stringify(reserva));

  }

  function quitarReserva(lugar) {

    const index = reserva.findIndex(el => el.id === lugar.id);

    reserva.splice(index, 1)
    localStorage.setItem("reserva", JSON.stringify(reserva))

  }

  crearLugares();
  mostrarLugares();
  mostrarTickets();

  const nodosDisponibles = document.querySelectorAll(".disponible");

  nodosDisponibles.forEach(element => {

    element.onmouseover = () => {

      const titulo = document.querySelector(".titulo");
      const precio = document.querySelector(".precio");

      element.classList.add("hover")

      const asiento = parseInt(element.innerText) || 0;

      const lugar = lugares.find(el => el.asiento === asiento);

      titulo.innerText = `Asiento ${lugar.asiento} Fila ${lugar.fila} Columna ${lugar.columna}`;

      precio.innerText = `Precio: $${lugar.precio}`;

    }


    element.onmouseout = () => {
      element.classList.remove("hover");
    }

    element.onclick = () => {

      element.classList.toggle("seleccionada");

      const asiento = parseInt(element.innerText);

      lugares.forEach((el) => {
        if (el.asiento === asiento) {

          if (el.reservado) {
            el.reservado = false;
            quitarReserva(el);
            reserva.length || document.querySelector(".cardSuma").remove();
            mostrarTickets();

          } else {
            el.reservado = true;
            agregarReserva(el);
            mostrarTickets();

          }
        }
      })
    }
  })
})

