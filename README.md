# github-backup-automation
This repository contains code for automating the backup of GitHub repositories.

## Usage

1. Clone this repository:
  ```bash
  git clone https://github.com/xela-engineer/github-backup-automation.git
  ```

2. Install the required dependencies:
  ```bash
  npm install
  ```

3. Configure the backup settings in the `./src/.env` file.

4. Run the backup script with `.env`:
  ```bash
  npm run backup ???
  ```

## Configuration

In the `./src/.env` file, you can specify the following settings:

- `BACKUP_PATH`: The directory where the backups will be stored.
- `GITHUB_ACCOUNT_NAME`: Github Account Name.
- `GITHUB_PAT`: Github API token.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.