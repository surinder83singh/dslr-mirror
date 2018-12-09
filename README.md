# dslr-mirror







## printer setup
sudo apt-get install cups
sudo usermod -a -G lpadmin pi
1 go to http://localhost:631
2 add printer
3 test printer using a test image from dropdown option on ui
https://www.howtogeek.com/169679/how-to-add-a-printer-to-your-raspberry-pi-or-other-linux-computer/


### set default printer using
lpadmin -d Dai_Nippon_Printing_DS-RX1

### check default printer
lpstat -t

https://www.cups.org/doc/man-lpr.html?TOPIC=Man+Pages