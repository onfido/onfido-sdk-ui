import {spawn} from 'child_process'

export const spawnP = (command, args, {options={}, optionCallback=()=>{}}) => {
    return new Promise(function(resolve, reject) {

      const process = spawn(command, args, options);
      optionCallback(process)
      process.on('close', resolve);
      process.on('error', reject);
    });
}
