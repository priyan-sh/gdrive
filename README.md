# Backup your server files to Google Drive Automatically

Using Python and a cronjob, you can use Google Drive to backup files from a server automatically every month.
 
**Tutorial**: https://priyan.sh/backup-website-to-google-drive-from-server/

**Command**: sudo python3 gdrive.py backup [token location] [directory location]

Example:
```
 sudo python3 gdrive.py backup /var/token.json /var/www/
```
