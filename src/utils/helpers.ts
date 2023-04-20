import chalk from 'chalk';

export const log = (msg: string) => {
    console.log(chalk.green(msg));
}

function logger(color: string, msg: string) {
    console.log(chalk[color](msg));

}

