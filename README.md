# Our Little Cartoon World — Silva & Aku

Website anniversary 2 bulan bertema kartun yang menyatukan dunia biru musim dingin dan dunia gothic maroon.

## Isi bundle

- `index.html` — struktur seluruh episode dan teks utama
- `styles.css` — ilustrasi CSS, warna, layout responsif, dan animasi
- `app.js` — navigasi, storybook, surat, peta, flip cards, kuis, secret box, mode edit, dan musik opsional

## Menjalankan lokal

Dari folder ini:

```bash
uv run python -m http.server 4173
```

Lalu buka `http://localhost:4173`.

## Cara mengedit hadiah

1. Klik **Edit teks** di kanan atas untuk mengaktifkan teks yang bisa diklik dan diganti langsung.
2. Pilih tanggal anniversary kalian sendiri pada kartu catatan. Tanggal tidak diisi otomatis.
3. Tambahkan foto kalian lewat kartu **Tambah foto**. Foto hanya dipreview di perangkat tersebut dan tidak mengunggah ke server.
4. Perubahan teks dan tanggal disimpan di `localStorage` browser itu. Untuk mengubah versi yang dibagikan publik bagi semua orang, edit teks sumber di `index.html` / `app.js` lalu publish ulang.
5. Musik hanya dimulai setelah tombol **Musik off** ditekan, mengikuti aturan autoplay browser.

## Publish

Bundle ini tidak membutuhkan build step atau dependency eksternal. Upload tiga file tersebut ke hosting static seperti GitHub Pages, Netlify, Vercel static hosting, atau server biasa, dengan `index.html` sebagai entry point.

Ilustrasi dibuat dengan CSS/original chibi motifs agar tetap menjadi interpretasi hormat: penguin kecil berhelm biru dan karakter gothic kecil, bukan foto atau aset karakter asing.
