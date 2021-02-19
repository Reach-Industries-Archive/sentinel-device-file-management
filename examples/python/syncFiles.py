from sentinel import Sentinel
import requests
import time
import json
from hashlib import md5
from subprocess import Popen, PIPE
from os import listdir, getenv
from os.path import isfile, join, exists
from pathlib import Path

# your Auth key generated from app.sentinelengine.ai/authkeys
AUTH_KEY = getenv("SENTINEL_AUTH_KEY")
# your Device ID
DEVICE_ID = getenv("SENTINEL_DEVICE_ID")
# The sync folder
SYNC_DIR = getenv("SENTINEL_ENGINE_FILE_FOLDER")

# Initialise a Sentinel API client
SentinelClient = Sentinel(AUTH_KEY)


def loadFile(path):
    with open(join(SYNC_DIR, path), 'rb') as file:
        return file.read()


if exists(SYNC_DIR) is False:
    print("SYNC_DIR: %s missing, creating..." % SYNC_DIR)
    Path(SYNC_DIR).mkdir(parents=True, exist_ok=True)


while True:
    # 1. Generates md5 hashes for existing files
    md5s = [{"filename": fname, "md5": (md5(loadFile(fname)).hexdigest())}
            for fname in listdir(SYNC_DIR)]

    # 2. Request list of changed files
    print("Checking for files...")
    newFiles = SentinelClient.syncFiles(DEVICE_ID, md5s)

    # 3. Download files
    for file in newFiles:
        SentinelClient.download(file, SYNC_DIR)
    print("Files in sync.")

    # 4. Remember to sleep before checking for new commands!
    time.sleep(60)


# Failing to add a pause before checking for new commands wait result in your device's requests getting throttled by SentinelEngine.
