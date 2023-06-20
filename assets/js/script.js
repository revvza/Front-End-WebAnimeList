// GET MENAMPILKAN SEMUA DATA
$.ajax({
    url: `http://localhost:3000/anime`,
    type: 'get',
    dataType: 'json',
    data:{
        anime : `title`, 
        anime : `image`,
        anime : `genres`
    },
    success: function(data) {
        let counter = 0; 
        $.each(data, function(index, item) {
          if (counter < 8) { 
            $('#anime-info').append(`
            <div class="col-md-3">
              <div class="card mb-3 mt-3">
                <img src="${item['image']}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${item['title']}</h5>
                  <p class="card-text">${item['genres']}</p>
                  <button class="btn btn-primary mx-2 w-auto detail" type="button" 
                    data-bs-toggle="modal" data-bs-target="#detailModal" data-id="${item['id']}">See Detail
                  </button>
                  <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${item['id']}">
                    Edit
                  </button>
                  <button type="button" class="btn btn-danger delete" data-id="${item['id']}">
                    Delete
                  </button>
                </div>
              </div>
            </div>
            `);
            counter++; 
          } else {
            return false; 
          }
        });

    },
    
  });

// GET UNTUK SEARCH BERDASARKAN ID
function showCard(params) {
    $('#anime-info').html('');

    const searchQuery = $('#search-input').val();

    $.ajax({
        url: `http://localhost:3000/anime`,
        type: 'get',
        dataType: 'json',
        data:{
            'title': `${searchQuery}`
        },
        success: function(data) {
  
            if (data.length >= 1) {
                $.each(data, function(key, item) {
                  $('#anime-info').append(`
                  <div class="col-md-3">
                    <div class="card mb-3 mt-3">
                      <img src="${item['image']}" class="img-fluid">
                      <div class="card-body">
                        <h5 class="card-title">${item['title']}</h5>
                        <p class="card-text">${item['genres']}</p>
                      <button class="btn btn-primary mx-2 w-auto detail" type="button" 
                        data-bs-toggle="modal" data-bs-target="#detailModal" data-id="${item['id']}">See Detail
                      </button>
                      <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${item['id']}">
                    Edit
                  </button>
                      <button type="button" class="btn btn-danger delete" data-id="${item['id']}">
                        Delete
                      </button>
                      </div>
                    </div>
                  </div>
                  `);
                });

            } else {
                alert('Anime Not Found')
                location.reload();
            }

        },
      });
}

$('#search-btn').on('click', function() {
    showCard();
  });

$('#search-input').on('keyup', function (e) {
    if (e.which === 13) {
        showCard();
    }
})

// GET UNTUK DETAIL PER ID
$('#anime-info').on('click', '.detail', function () {
    const id = $(this).data('id');
    $.ajax({
        url: `http://localhost:3000/anime/${id}`,
        type: 'get',
        dataType: 'json',
        data:{
            id
        },
        success: function(data) {
          $('.modal-body').html(
            `<div class="container-fluid">
            <div class="row">
              <div class="col-md-4">
                <img src="`+ data.image +`" class="img-fluid" w-80px/>
              </div>
      
              <div class="col-md-8">
                <ul class="list-group">
                  <li class="list-group-item"><h3>Title : ${data.title}</h3></li>
                  <li class="list-group-item">Type : ${data.type}</li>
                  <li class="list-group-item">Episodes : ${data.episodes}</li>
                  <li class="list-group-item">Status : ${data.status}</li>
                  <li class="list-group-item">Aired : ${data.aired}</li>
                  <li class="list-group-item">Premiered : ${data.premiered}</li>
                  <li class="list-group-item">Producers : ${data.producers}</li>
                  <li class="list-group-item">Studios : ${data.studios}</li>
                  <li class="list-group-item">Genres : ${data.genres}</li>
                  <li class="list-group-item">Duration : ${data.duration}</li>
                  <li class="list-group-item">Synopsis : ${data.synopsis}</li>
                </ul>
              </div>
            </div>
          </div>`)

          // Tetapkan atribut data-id dari tombol hapus
          $('.modal-footer .delete').data('id', id);
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error(errorThrown);
          alert('Nof found');
        }
      });
})

// POST MENAMBAH DATA
$(document).ready(function() {
  $('.btn-tambah').click(function() {
    $('#addForm')[0].reset();
  });

  $('#addForm').submit(function(event) {
    event.preventDefault();

    var data = {
      title: $('#title').val(),
      type: $('#type').val(),
      episodes: $('#episodes').val(),
      status: $('#status').val(),
      aired: $('#aired').val(),
      premiered: $('#premiered').val(),
      producers: $('#producers').val(),
      studios: $('#studios').val(),
      genres: $('#genres').val(),
      duration: $('#duration').val(),
      synopsis: $('#synopsis').val(),
      image: $('#image').val()
    };

    $.ajax({
      url: 'http://localhost:3000/anime',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(response) {
        alert('Data added successfully');
        $('#addModal').modal('hide');
      },
      error: function() {
        alert('Error occurred while adding data');
      }
    });
  });
});

// DELETE DATA BERDASARKAN ID
$(document).ready(function() {
  // Menggunakan event delegated karena modal mungkin belum ada saat dokumen dimuat
  $('body').on('click', '.delete', function() {
    const id = $(this).data('id');

    $.ajax({
      url: `http://localhost:3000/anime/${id}`,
      type: 'DELETE',
      dataType: 'json',
      success: function() {
        alert('Data deleted successfully');
        $('#detailModal').modal('hide');
        // Refresh halaman 
        location.reload();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
        alert('An error occurred while deleting the data');
      }
    });
  });
});

//PUT
$('#editForm').submit(function(event) {
  event.preventDefault();

  const id = $(this).data('id');
  const data = {
    title: $('#editTitle').val(),
    type: $('#editType').val(),
    episodes: $('#editEpisodes').val(),
    status: $('#editStatus').val(),
    aired: $('#editAired').val(),
    premiered: $('#editPremiered').val(),
    producers: $('#editProducers').val(),
    studios: $('#editStudios').val(),
    genres: $('#editGenres').val(),
    duration: $('#editDuration').val(),
    synopsis: $('#editSynopsis').val(),
    image: $('#editImage').val()
  };

  $.ajax({
    url: `http://localhost:3000/anime/${id}`,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(response) {
      alert('Data updated successfully');
      $('#editModal').modal('hide');
      // Refresh halaman 
        location.reload();
    },
    error: function() {
      alert('Error occurred while updating data');
    }
  });
});

// Menambahkan fungsi click pada tombol "Save Changes"
$('#editFormSubmit').click(function() {
  $('#editForm').submit(); // Mengirimkan formulir saat tombol di klik
});

// Menampilkan data saat tombol Edit di klik
$('#anime-info').on('click', '.edit', function () {
  const id = $(this).data('id');
  
  $.ajax({
    url: `http://localhost:3000/anime/${id}`,
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      $('#editForm').data('id', id); // Set data-id attribute pada form

      $('#editTitle').val(data.title);
      $('#editType').val(data.type);
      $('#editEpisodes').val(data.episodes);
      $('#editStatus').val(data.status);
      $('#editAired').val(data.aired);
      $('#editPremiered').val(data.premiered);
      $('#editProducers').val(data.producers);
      $('#editStudios').val(data.studios);
      $('#editGenres').val(data.genres);
      $('#editDuration').val(data.duration);
      $('#editSynopsis').val(data.synopsis);
      $('#editImage').val(data.image);

      $('#editModal').modal('show');
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error(errorThrown);
      alert('An error occurred while retrieving data');
    }
  });
});

// FILTERING

// Mendapatkan data anime berdasarkan dropdown "Type" yang dipilih
function getAnimeByType(type) {
  $.ajax({
    url: 'http://localhost:3000/anime',
    type: 'GET',
    data: {
      type: type
    },
    dataType: 'json',
    success: function (data) {
      $('#anime-info').empty(); // Menghapus konten sebelumnya

      $.each(data, function (index, item) {
        $('#anime-info').append(`
          <div class="col-md-3">
            <div class="card mb-3 mt-3">
              <img src="${item.image}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.genres}</p>
                <button class="btn btn-primary mx-2 w-auto detail" type="button" 
                  data-bs-toggle="modal" data-bs-target="#detailModal" data-id="${item.id}">See Detail
                </button>
                <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${item.id}">
                  Edit
                </button>
                <button type="button" class="btn btn-danger delete" data-id="${item.id}">
                  Delete
                </button>
              </div>
            </div>
          </div>
        `);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(errorThrown);
      alert('An error occurred while retrieving data');
    }
  });
}

function getAllAnime(){
  $.ajax({
    url: `http://localhost:3000/anime`,
    type: 'get',
    dataType: 'json',
    data:{
        anime : `title`, 
        anime : `image`,
        anime : `genres`
    },
    success: function(data) {
        let counter = 0; 
        $.each(data, function(index, item) {
          if (counter < 8) { 
            $('#anime-info').append(`
            <div class="col-md-3">
              <div class="card mb-3 mt-3">
                <img src="${item['image']}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${item['title']}</h5>
                  <p class="card-text">${item['genres']}</p>
                  <button class="btn btn-primary mx-2 w-auto detail" type="button" 
                    data-bs-toggle="modal" data-bs-target="#detailModal" data-id="${item['id']}">See Detail
                  </button>
                  <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${item['id']}">
                    Edit
                  </button>
                  <button type="button" class="btn btn-danger delete" data-id="${item['id']}">
                    Delete
                  </button>
                </div>
              </div>
            </div>
            `);
            counter++; 
          } else {
            return false; 
          }
        });

    },
    
  });
}
// Mendapatkan data anime berdasarkan dropdown "Type" yang dipilih saat dropdown berubah
$('.dropdown-menu').on('change', 'input[type="checkbox"]', function () {
  var selectedTypes = []
  // Mendapatkan nilai terpilih dari checkbox
  $('.dropdown-menu input[type="checkbox"]:checked').each(function () {
    selectedTypes.push($(this).val());
  });

  // Memanggil fungsi untuk mendapatkan data anime berdasarkan tipe terpilih jika ada checkbox yang dipilih
  if (selectedTypes.length > 0) {
    getAnimeByType(selectedTypes.join(','));
  } else {
    $('#anime-info').empty();
    getAllAnime(); // Memanggil fungsi untuk mendapatkan semua data anime jika tidak ada checkbox yang dipilih
  }
});


// Mendapatkan data anime berdasarkan dropdown "Status" yang dipilih
$(document).ready(function() {
  // Menangani perubahan pada radio button status
  $('input[name="status"]').change(function() {
    // Mendapatkan nilai status yang dipilih
    var status = $('input[name="status"]:checked').val();
    
    // Mengirim permintaan Ajax
    $.ajax({
      url: 'http://localhost:3000/anime',
      type: 'GET',
      data: { status: status },
      
      success: function(data) {
        $('#anime-info').empty();
        console.log(data)
        $.each(data, function(index, item) {
          $('#anime-info').append(`
            <div class="col-md-3">
              <div class="card mb-3 mt-3">
                <img src="${item.image}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${item.title}</h5>
                  <p class="card-text">${item.genres}</p>
                  <button class="btn btn-primary mx-2 w-auto detail" type="button" 
                    data-bs-toggle="modal" data-bs-target="#detailModal" data-id="${item.id}">See Detail
                  </button>
                  <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${item.id}">
                    Edit
                  </button>
                  <button type="button" class="btn btn-danger delete" data-id="${item.id}">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          `);
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
        alert('An error occurred while retrieving data');
      }
    });
  })
})

// Mendapatkan data anime berdasarkan dropdown "Genre" yang dipilih
$(document).ready(function() {
  // Mendapatkan data anime berdasarkan status yang dipilih
  function getAnimeByGenres(genres) {
    $.ajax({
      url: 'http://localhost:3000/anime',
      type: 'GET',
      data: {
        genres: genres
      },
      dataType: 'json',
      success: function(data) {
        // $('#anime-info').empty();

        $.each(data, function(index, item) {
          
          $('#anime-info').append(`
            <div class="col-md-3">
              <div class="card mb-3 mt-3">
                <img src="${item.image}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${item.title}</h5>
                  <p class="card-text">${item.genres}</p>
                  <button class="btn btn-primary mx-2 w-auto detail" type="button" 
                    data-bs-toggle="modal" data-bs-target="#detailModal" data-id="${item.id}">See Detail
                  </button>
                  <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${item.id}">
                    Edit
                  </button>
                  <button type="button" class="btn btn-danger delete" data-id="${item.id}">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          `);
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
        alert('An error occurred while retrieving data');
      }
    });
  }

  // Mendapatkan status terpilih dari checkbox
  function getSelectedGenres() {
    var selectedGenres = [];
    console.log(selectedGenres)
    

    $('.dropdown-menu input[type="checkbox"]:checked').each(function() {
      selectedGenres.push($(this).val());
    });

    return selectedGenres;
   
  }

  // Memanggil fungsi untuk mendapatkan data anime saat dropdown berubah
  $('.dropdown-menu').on('change', 'input[type="checkbox"]', function() {

    var selectedGenres = getSelectedGenres();
    if (selectedGenres.length > 0) {
      getAnimeByGenres(selectedGenres.join(', '));
    } else {
      // Jika tidak ada checkbox yang terpilih, kosongkan konten anime-info
      $('#anime-info').empty();
    }
  });
});

// Mendapatkan data anime berdasarkan dropdown "Duration" yang dipilih
$(document).ready(function() {
  // Menangani perubahan pada radio button durasi
  $('input[name="duration"]').change(function() {
    // Mendapatkan nilai durasi yang dipilih
    var duration = $('input[name="duration"]:checked').val();
    
    // Mengirim permintaan Ajax
    $.ajax({
      url: 'http://localhost:3000/anime',
      type: 'GET',
      data: { duration: duration },
      
      success: function(data) {
        $('#anime-info').empty();
        console.log(data)
        $.each(data, function(index, item) {
          $('#anime-info').append(`
            <div class="col-md-3">
              <div class="card mb-3 mt-3">
                <img src="${item.image}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${item.title}</h5>
                  <p class="card-text">${item.genres}</p>
                  <button class="btn btn-primary mx-2 w-auto detail" type="button" 
                    data-bs-toggle="modal" data-bs-target="#detailModal" data-id="${item.id}">See Detail
                  </button>
                  <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${item.id}">
                    Edit
                  </button>
                  <button type="button" class="btn btn-danger delete" data-id="${item.id}">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          `);
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
        alert('An error occurred while retrieving data');
      }
    });
  })
})

// Mendapatkan data anime berdasarkan dropdown "premiered" yang dipilih
$(document).ready(function() {
  // Menangani perubahan pada radio button musim
  $('input[name="premiered"]').change(function() {
    // Mendapatkan nilai musim yang dipilih
    var premiered = $('input[name="premiered"]:checked').val();
    
    // Mengirim permintaan Ajax
    $.ajax({
      url: 'http://localhost:3000/anime',
      type: 'GET',
      data: { premiered: premiered },
      
      success: function(data) {
        $('#anime-info').empty();
        console.log(data)
        $.each(data, function(index, item) {
          $('#anime-info').append(`
            <div class="col-md-3">
              <div class="card mb-3 mt-3">
                <img src="${item.image}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${item.title}</h5>
                  <p class="card-text">${item.genres}</p>
                  <button class="btn btn-primary mx-2 w-auto detail" type="button" 
                    data-bs-toggle="modal" data-bs-target="#detailModal" data-id="${item.id}">See Detail
                  </button>
                  <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${item.id}">
                    Edit
                  </button>
                  <button type="button" class="btn btn-danger delete" data-id="${item.id}">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          `);
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
        alert('An error occurred while retrieving data');
      }
    });
  })
})

// sorting title
$(document).ready(function () {
  // Menangani perubahan pada dropdown radio button
  $('input[name="sort"]').change(function () {
    // Mendapatkan nilai sort yang dipilih
    var sortValue = $('input[name="sort"]:checked').val();

    // Mengirim permintaan Ajax ke endpoint /anime dengan parameter sort
    $.ajax({
      url: 'http://localhost:3000/anime',
      type: 'GET',
      data: { sort: sortValue },
      success: function (data) {
        console.log(data)
        $('#anime-info').empty();
        $.each(data, function(index, item) {
          $('#anime-info').append(`
            <div class="col-md-3">
              <div class="card mb-3 mt-3">
                <img src="${item.image}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${item.title}</h5>
                  <p class="card-text">${item.genres}</p>
                  <button class="btn btn-primary mx-2 w-auto detail" type="button" 
                    data-bs-toggle="modal" data-bs-target="#detailModal" data-id="${item.id}">See Detail
                  </button>
                  <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${item.id}">
                    Edit
                  </button>
                  <button type="button" class="btn btn-danger delete" data-id="${item.id}">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          `);
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
        alert('An error occurred while retrieving data');
      }
    });
  });
});