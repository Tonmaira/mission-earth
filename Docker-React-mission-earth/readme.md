<!-- สำหรับ linux **Docker container บน Linux ไม่เข้าใจ UNC path ของ Windows -->
sudo mkdir -p /mnt/rightverify
sudo mount -t cifs //10.1.1.60/RightVerify /mnt/rightverify -o username=ftprightuser,password=P@ssw0rd#01,vers=3.0