#!/bin/sh
(set -x; 
	for f_png in *.png ; 
	do 
		f="${f_png%.png}"; 
		convert "$f_png" "$f.pnm" && potrace "$f.pnm" -s -3 --color '#16364b' -o "$f.svg"; 
		rm "$f.pnm"
		svgo -i "$f.svg" -o "$f.min.svg"
	done
)

