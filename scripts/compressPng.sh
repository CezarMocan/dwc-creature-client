(set -x; 
  for f_png in *.png ; 
  do 
    f="${f_png%.png}"; 
    pngquant --quality 80 "$f_png"
    mv "$f-fs8.png" "$f.min.png"
#    convert "$f_png" "$f.pnm" && potrace "$f.pnm" -s -3 --color '#16364b' -o "$f.svg"; 
#    rm "$f.pnm"
#    svgo -i "$f.svg" -o "$f.min.svg"
  done
)