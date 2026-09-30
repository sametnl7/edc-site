# EDC Gayrimenkul & Motors — web sitesi

Vite + React + TypeScript, animasyonlar **GSAP (ScrollTrigger)** + **Lenis** (yumuşak kaydırma).

## Çalıştırma

```bash
npm install
npm run dev      # geliştirme: http://localhost:5173
npm run build    # üretim çıktısı: dist/
npm run preview  # build'i yerelde önizleme
```

## Dosyalar

- `src/EdcSite.tsx` — tüm site (bölümler + GSAP/Lenis kurulumu)
- `src/edc.css` — tema ve düzen (renk token'ları `.edc` altında)
- `src/EdcLogos.tsx` — orijinal EDC logoları (değiştirilmedi)

## Ayarlar

- Sahibinden portföy linkleri: `EdcSite.tsx` başındaki `PORTFOLIO` nesnesi. Boşsa butonlar İletişim'e kaydırır.
- Görseller: `IMG` nesnesindeki Unsplash adresleri temsilidir; gerçek fotoğraflarla değiştirin.
- Vurgu rengi: `edc.css` içindeki `--accent`.

## Sahneler

1. Açılış: fotoğraf destesi + sayaç, perde yukarı kalkar
2. Hero: dev başlık harf harf yükselir; kaydırınca pencere tam ekrana açılır
3. Kayan şerit: kaydırma yönüne ve hızına göre döner/eğilir
4. Kurumsal: cümle kaydırdıkça kelime kelime mürekkeplenir
5. Gayrimenkul: sabitlenen yatay galeri, kartlar gri→renkli, ilerleme çubuğu
6. Motors: sayfa karanlığa döner, "EDC MOTORS" ikiye ayrılır, görsel daireden açılır
7. Danışmanlık: yapışkan çerçevede adım adım görsel geçişi
8. Portföy / İletişim: özel imleç ("İncele"), manyetik butonlar, harf harf başlık
9. Alt bilgi: dev EDC logosu kaydırmayla yükselir

Mobilde yatay galeri dikey listeye döner. Animasyonlar işletim sistemindeki "animasyonları azalt" ayarından bağımsız olarak her zaman çalışır.
