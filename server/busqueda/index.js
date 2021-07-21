const storage = require('../storage'),
      path = require('path');

const busqueda = (app) => {
    // Lista las opciones de filtrado
    app.get('/filteroptions', (req, res) => {
        storage.getDataAll()
            .then((data) => {
                let ciudades = [];
                let tipos = [];
                data.forEach((key, idx) => {
                    if (ciudades.indexOf(key.Ciudad) < 0) {
                        ciudades.push(key.Ciudad);
                    }
                    if (tipos.indexOf(key.Tipo) < 0) {
                        tipos.push(key.Tipo);
                    }
                });
                res.json({ "error": false, "ciudades": ciudades, "tipos": tipos });
            })
            .catch((err) => {
                res.json({ "error": true, "err": err });
            });
    });

    // lista todas las propiedades
    app.get('/search', (req, res) => {
        storage.getDataAll()
            .then((data) => {
                res.json({ "error": false, "datos": data });
            })
            .catch((err) => {
                res.json({ "error": true, "datos": err });
            });
    });

    //Lista propiedades por filtro
    app.get('/filteredSearch', (req, res) => {
      let params = req.query;
      storage.getDataAll()
          .then(data => {
              var aux = [];
              var filtrados = [];
              var datos = [];

              aux = data.slice();

              //valida si se seleccionaron ciudades
              if (params.ciudad != "") {
                  aux.forEach((key, idx) => {
                      if (key.Ciudad == params.ciudad) { filtrados.push(key); }
                  });
              } else {
                  filtrados = aux.slice();
              }

              //reinicia los array auxiliares
              aux = [];
              aux = filtrados.slice();
              filtrados = [];

              //valida si se selecciono un tipo en especifico
              if (params.tipo != "") {
                  aux.forEach((key, idx) => {
                      if (key.Tipo == params.tipo) { filtrados.push(key); }
                  });
              } else {
                  filtrados = aux.slice();
              }

              // recorre y filtra si esta entre los valores seleccionados
              filtrados.forEach((key, idx) => {
                  let valor = parseInt(key.Precio.replace("$", "").replace(",", ""));
                  if (valor >= parseInt(params.desde) && valor <= parseInt(params.hasta)) {
                      datos.push(key);
                  }
              });

              res.status(200).json({ datos, params });
          })
          .catch((err) => {
              res.json({ "error": true, "err": err });
          });
    });
};

module.exports = busqueda;
