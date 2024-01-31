import {program} from "commander";
import savePage from "../index.js";

program
  .name('page loader')
  .description('Page loader utility')
.option('-o, --output', 'output directory', './')
  .argument('<string>')


program.parse();

savePage(program.args[0]);
