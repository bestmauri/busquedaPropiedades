$(document).ready(function() {
    const apiUrl = $(location).attr('href').replace($(location).attr('pathname'), ""); //'http://localhost:3000';

    $("#rangoPrecio").ionRangeSlider({
        type: "double",
        grid: false,
        min: 0,
        max: 100000,
        from: 1000,
        to: 20000,
        prefix: "$"
    });

    init();
    setSearch();

    // busca propiedades al hacer clic en el boton
    $('#buscar').click(function() {
      var filters = {};
        if ($("#checkPersonalizada")[0].checked){
            var valores = $("#rangoPrecio").val();
            var rango = valores.split(";");
            filters = {ciudad: $("#ciudad").val()
                     , tipo: $("#tipo").val()
                     , desde: rango[0]
                     , hasta: rango[1]}
            var endpoint = apiUrl + '/filteredSearch'
        } else {
            var endpoint = apiUrl + '/search';
        }
        ajaxRequest(endpoint, 'GET', filters)
            .done(function(data){
                if (!data.error) {
                    // console.log(data);
                    $('.lista').html(renderCard(data.datos));
                }
            });
    });

    //dibuja opciones de filtrado
    function renderSelect(data) {
        var html = '';
        data.forEach(function(key, idx) {
            html += `<option value="${key}">${key}</option>`;
        });
        return html;
    }

    //dibuja la lista de propiedades
    function renderCard(objArr) {
        var html = '';
        var template = '<div class="card horizontal">' +
                          '<div class="card-image">' +
                            '<img src="img/home.jpg">' +
                          '</div>' +
                          '<div class="card-stacked">' +
                              '<div class="card-content">' +
                                  '<div> <p><strong>Direccion: </strong>:direccion:</p> </div>' +
                                  '<div> <p><strong>Ciudad: </strong>:ciudad:</p> </div>' +
                                  '<div> <p><strong>Telefono: </strong>:telefono:</p> </div>' +
                                  '<div> <p><strong>Código postal: </strong>:codigoPostal:</p> </div>' +
                                  '<div> <p><strong>Precio: </strong>:precio:</p> </div>' +
                                  '<div> <p><strong>Tipo: </strong>:tipo:</p> </div>' +
                              '</div>' +
                          '</div>' +
                      '</div>';

        objArr.forEach(function(key, idx)
        {
            html += template.replace(":direccion:", key.Direccion)
                            .replace(":ciudad:", key.Ciudad)
                            .replace(":telefono:", key.Telefono)
                            .replace(":codigoPostal:", key.Codigo_Postal)
                            .replace(":precio:", key.Precio)
                            .replace(":tipo:", key.Tipo)
        });
        return html;
    }

    //solicitud de datos
    function ajaxRequest(url, type, data) {
      return $.ajax({
        url: url,
        type: type,
        dataType: 'json',
        data: data
      })
    }

    // constructor init
    function init(){
      var endpoint = apiUrl + '/filteroptions';
      ajaxRequest(endpoint, 'GET', {})
        .done(function(data) {
            if (!data.error) {
                $('#ciudad').append(renderSelect(data.ciudades));
                $('#tipo').append(renderSelect(data.tipos));
                $("#ciudad").material_select();
                $("#tipo").material_select();
            }
        }).fail(function(err) {
          alert(err);
        });
    } // .init

    function setSearch() {
        let busqueda = $('#checkPersonalizada');
        busqueda.on('change', (e) => {
            this.customSearch = !this.customSearch;
            $('#personalizada').toggleClass('invisible');
        });
    }
});
