// Ngambil elemen form
const formulir = document.querySelector("form");
const url = "https://tugas1tcc-be2-425714712446.us-central1.run.app/api/notes/";

// Bikin trigger event submit pada elemen form
formulir.addEventListener("submit", (e) => {
  e.preventDefault();

  // Ngambil elemen input
  const elemen_penulis = document.querySelector("#penulis");
  const elemen_judul = document.querySelector("#judul");
  const elemen_isi = document.querySelector("#isi_ctt");
  const elemen_kategori = document.querySelector("#kategori");

  // Ngambil value (nim) dari elemen input
  const penulis = elemen_penulis.value;
  const judul = elemen_judul.value;
  const isi = elemen_isi.value;
  const kategori = elemen_kategori.value;

  const id = elemen_penulis.dataset.id; // <- Khusus edit

  // Ngecek apakah harus POST atau PUT
  // Kalo id kosong, jadinya POST
  if (id == "") {
    // Tambah user
    fetch(url, {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      body: JSON.stringify({
        penulis: penulis,
        judul: judul,
        isi_catatan: isi,
        kategori: kategori,
      }),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      // Converting to JSON
      .then((response) => response.json())

      // Displaying results to console
      .then((json) => console.log(json))
      .then(() => {
        elemen_penulis.value = "";
        elemen_judul.value = "";
        elemen_isi.value = "";
        elemen_kategori.value = "";
        getData();
      });
  } else {
    fetch(url + id, {
      // Adding method type
      method: "PUT",
      // Adding body or contents to send
      body: JSON.stringify({
        penulis: penulis,
        judul: judul,
        isi_catatan: isi,
        kategori: kategori,
      }),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      // Converting to JSON
      .then((response) => response.json())

      // Displaying results to console
      .then((json) => console.log(json))
      .then(() => {
        elemen_penulis.value = "";
        elemen_judul.value = "";
        elemen_isi.value = "";
        elemen_kategori.value = "";
        getData();
      });
  }
});

// GET User
async function getData() {
  let tampilan = `<tr class="fw-bold">
                            <td>NO</td>
                        <td>Penulis</td>
                        <td>Judul</td>
                        <td>Isi</td>
                        <td>kategori</td>
                        <td>Aksi</td>
                        <td></td>
                    </tr>`;
  let no = 1;
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const table = document.querySelector("#table1");
    const json = await response.json();
    console.log(json);

    for (let x in json.data.notes) {
      tampilan += tampilkanUser(no, json);
      no++;
    }
    table.innerHTML = tampilan;
    hapusUser();
    editUser();
  } catch (error) {
    console.error(error.message);
  }
}

function tampilkanUser(no, obj) {
  return `
    <tr>
      <td>${no}</td>
      <td class="penulis">${obj.data.notes[no - 1].penulis}</td>
      <td class="judul">${obj.data.notes[no - 1].judul}</td>
      <td class="isi_ctt">${obj.data.notes[no - 1].isi_catatan}</td>
      <td class="kategori">${obj.data.notes[no - 1].kategori}</td>
      <td><button data-id=${
        obj.data.notes[no - 1].note_id
      } class='btn-edit'>Edit</button></td>
      <td><button data-id=${
        obj.data.notes[no - 1].note_id
      } class='btn-hapus'>Hapus</button></td>
    </tr>
  `;
}

function hapusUser() {
  const kumpulan_tombol_hapus = document.querySelectorAll(".btn-hapus");

  kumpulan_tombol_hapus.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      try {
        const response = fetch(url + id, {
          method: "DELETE",
        }).then(() => {
          getData();
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const responseText = response.text();
        console.log(responseText); // logs 'OK'
      } catch (error) {
        console.error(error.message);
      }
    });
  });
}

function editUser() {
  const kumpulan_tombol_edit = document.querySelectorAll(".btn-edit");

  kumpulan_tombol_edit.forEach((tombol_edit) => {
    tombol_edit.addEventListener("click", () => {
      // Ngambil value yg ada di form
      const id = tombol_edit.dataset.id;
      const penulis =
        tombol_edit.parentElement.parentElement.querySelector(
          ".penulis"
        ).innerText;
      const judul =
        tombol_edit.parentElement.parentElement.querySelector(
          ".judul"
        ).innerText;
      const kategori =
        tombol_edit.parentElement.parentElement.querySelector(
          ".kategori"
        ).innerText;
      const isi =
        tombol_edit.parentElement.parentElement.querySelector(
          ".isi_ctt"
        ).innerText;

      // Ngambil [elemen] input
      const elemen_penulis = document.querySelector("#penulis");
      const elemen_judul = document.querySelector("#judul");
      const elemen_isi = document.querySelector("#isi_ctt");
      const elemen_kategori = document.querySelector("#kategori");

      // Masukkin value yang ada di baris yang dipilih ke form
      elemen_penulis.dataset.id = id;
      elemen_penulis.value = penulis;
      elemen_judul.value = judul;
      elemen_isi.value = isi;
      elemen_kategori.value = kategori;
    });
  });
}

getData();
