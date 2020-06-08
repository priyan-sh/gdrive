# Instructions: priyan.sh/backup-website-to-google-drive-from-server/
# Command: sudo python3 gdrive.py backup [token location] [directory location]

# Example: sudo python3 gdrive.py backup /var/token.json /var/www/

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import datetime
import tarfile
import os
import sys
import requests
from pathlib import Path

parentID = '1AFfxg_lpfIDbJf0IoH7XP4sZILqZ7Gen' # Change this to your Folder ID.
email = 'gdrive@signal-signal-111111.iam.gserviceaccount.com' # Change this to your Google Service Account Email ID.


def create_drive_service(token):

    SCOPES = ['https://www.googleapis.com/auth/drive']
    SERVICE_ACCOUNT_FILE = token

    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)

    return build('drive', 'v3', credentials=credentials)


def clear_past_backups(service):
    page = None
    filesObj = {}
    while True:
        files = service.files().list(
            q="mimeType='application/gzip' and name contains 'backup'",
            pageToken=page,
            fields="nextPageToken, files(id,name)"
        ).execute()

        for file in files.get('files', []):
            filesObj[file.get('id')] = file.get('name')
        page = files.get('nextPageToken', None)
        if page is None:
            break

    if not(not filesObj or len(filesObj) < 2):
        print("Two or more previous backups found.")
        latest = sorted(list(filesObj.values()))[len(filesObj)-1]

        for l in sorted(list(filesObj.values())):
            print(l)
        print("Backup to be kept: %s." % latest)
        print("Deleting all but the latest backup...")
        for file in filesObj:
            if filesObj[file] != latest:
                service.files().delete(fileId=file).execute()
                print("Backup named %s deleted." % filesObj[file])


def print_files(service):
    print(service.files().list().execute().get('files', []))


def remove_all(service):
    for file in service.files().list().execute().get('files', []):
        service.files().delete(fileId=file.get('id')).execute()


def archive(dir):
    print("Archiving directory %s." % dir)
    now = datetime.datetime.now().isoformat().replace(':', '_').split(".")[0]
    fileName = "backup_"+now+".tar.bz2"
    with tarfile.open(fileName, "w:bz2") as tar:
        tar.add(dir)
        print("Directory successfully archived. Archive name: %s." % fileName)
        return fileName


def upload(fileName, service):
    print("Beginning backup upload...")
    media = MediaFileUpload(
        fileName, mimetype="application/gzip", resumable=True)

    file = service.files().create(body={'name': fileName, 'parents': [
        parentID]}, media_body=media, fields='id').execute()
    print("Backup uploaded. Online backup file ID is %s." % file.get('id'))
    print("Setting backup permissions...")

    def callback(request_id, response, exception):
        if exception:
            # Handle error
            print(exception)
        else:
            print("Permission Id: %s" % response.get('id'))
    batch = service.new_batch_http_request(callback=callback)
    user_permission = {
        'type': 'user',
        'role': 'writer',
        'emailAddress': email
    }
    batch.add(service.permissions().create(
        fileId=file.get('id'),
        body=user_permission,
        fields='id',
    ))
    batch.execute()


def clean(file_name):
    print("Deleting temporary files...")
    os.remove(file_name)
    print("Temporary files deleted. Backup complete!")


if (len(sys.argv) > 2):
    try:
        token = sys.argv[2]
        service = create_drive_service(token)
        if(len(sys.argv) == 4 and sys.argv[1] == "backup"):

            token = sys.argv[2]
            service = create_drive_service(token)
            fileName = archive(Path(sys.argv[3]))
            clear_past_backups(service)
            upload(fileName, service)
            clean(fileName)
            date = datetime.datetime.now().strftime("%d %B, %Y (%A) at %I:%M %p")

        elif(sys.argv[1] == "clean"):
            print_files(service)
            remove_all(service)
        elif (sys.argv[1] == "upload"):
            fileName = sys.argv[3]
            clear_past_backups(service)
            upload(fileName, service)
            date = datetime.datetime.now().strftime("%d %B, %Y (%A) at %I:%M %p")
        else:
            print('''Argument format incorrect. Pass the token file location as the second argument. Specify the directory you want to backup as the third argument. If you choose backup, please specify the directory to back up as the third argument.''')
    except Exception as e:
        date = datetime.datetime.now().strftime("%d %B, %Y (%A) at %I:%M %p")
        print(e)
else:
    print('''Error: You forgot to pass the arguments, choose either 'clean' or 'backup'. Pass the token file location as the second argument. Specify the directory you want to backup as the third argument. If you chose 'clean', it will clear all backups. You don't need to pass any directory as an argument, just the token is enough.''')
