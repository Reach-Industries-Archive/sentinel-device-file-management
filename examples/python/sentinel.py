from os import getenv
from os.path import join
import requests
import json

# Class holding helper methods to interact with the SentinelEngine platform.


class Sentinel:
    def __init__(self, authKey):
        self.authkey = authKey
        self.baseurl = getenv("SENTINEL_URL")

    def syncFiles(self, deviceId, md5s):
        url = f'{self.baseurl}/device/sync'
        headers = {'Authorization': self.authkey, 'DeviceId': deviceId}
        response = requests.post(url, json=md5s, headers=headers)
        return json.loads(response.text)

    def download(self, fileInfo, syncFolder):
        response = requests.get(fileInfo["download"])
        path = join(syncFolder, fileInfo["filename"])
        with open(path, 'wb') as file:
            file.write(response.content)
