# sentinel-device-file-management

Repository used to hold examples in various languages for using the device file management functionality.

## Examples

The examples provided are scripts that should poll at a given frequency to keep the device files in sync in the specified folder.

### NodeJS

- Navigate to examples/nodejs
- Create .env file with required configuration values (default values can be found in .env.example):

  - `SENTINEL_ENGINE_URL` - Standard SE accounts should use the default, otherwise `https://http-decoder.SUBDOMAIN.sentinelengine.ai`
  - `SENTINEL_ENGINE_FILE_FOLDER` - the folder you want to be synchronised with the remote files.
  - `SENTINEL_ENGINE_DEVICE_ID` - The deviceId to be synchronised.
  - `SENTINEL_ENGINE_DEVICE_AUTH_KEY` - A valid AuthKey for your account.

- Install dependencies: `npm i`
- Run script: `node index.js`

### Python3

- Navigate to `examples/python`.
- Create `.env` file with required configuration values:

  - `SENTINEL_URL` - Standard SE accounts should use the default, otherwise `https://http-decoder.SUBDOMAIN.sentinelengine.ai`
  - `SENTINEL_ENGINE_FILE_FOLDER` - the folder you want to be synchronised with the remote files.
  - `SENTINEL_DEVICE_ID` - The deviceId to be synchronised.
  - `SENTINEL_DEVICE_AUTH_KEY` - A valid AuthKey for your account.

- Install [Pipenv](https://github.com/pypa/pipenv):

```
python -m pip install --user pipenv
```

- Install dependencies:

```
python -m pipenv install
```

- Run script:

```
python -m pipenv run ./syncFiles.py
```