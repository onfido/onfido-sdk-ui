import {spawn} from 'child_process'

export const spawnP = (command, args, options={}, optionCallback=()=>{}) => {
    return new Promise(function(resolve, reject) {

      const process = spawn(command, args, options);
      optionCallback(process)
      process.on('close', resolve);
      process.on('error', reject);
    });
}

export const spawnPrinter = (color, stdout, stderrorPrefix) => process => {
  stdout = {prefix:"", filter: ()=>true, ...stdout}

  process.stdout.on('data', data => {
    const output = data.toString()
    if (stdout.filter(output)){
      console.log(color,stdout.prefix, output)
    }
  });
  process.stderr.on('data', data => {
    console.log(color,stderrorPrefix,data.toString())
  });
}
