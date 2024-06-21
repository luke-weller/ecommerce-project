import { task } from "gulp";
import { exec, spawn } from "child_process";
import chalk from "chalk";

task("build", (done) => {
  exec("yarn build", (error, stdout, stderr) => {
    console.log(chalk.bold("Building the project with `yarn build`..."));
    if (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      done(error); // Stop execution and pass the error to the callback
      return;
    }
    if (stderr) {
      console.error(chalk.yellow(`stderr: ${stderr}`));
      done(new Error(stderr));
      return;
    }
    console.log(chalk.green(stdout));
    console.log(chalk.bold.green("Build finished successfully!"));
    done(); // Signal that the task is complete
  });
});

task("deploy", (done) => {
  console.log(chalk.bold("Deploying the project with `cdk deploy`..."));
  const deployProcess = spawn("cdk", ["deploy"], {
    stdio: "inherit",
    shell: true,
    cwd: "infrastructure",
  });

  deployProcess.on("close", (code) => {
    if (code === 0) {
      console.log(chalk.bold.green("Deployment finished successfully!"));
    } else {
      console.error(chalk.red(`Deployment process exited with code ${code}`));
    }
    done();
  });
});

task("synth", (done) => {
  console.log(chalk.bold("Running `cdk synth`..."));
  const synthProcess = spawn("cdk", ["synth"], {
    stdio: "inherit",
    shell: true,
    cwd: "infrastructure",
  });
  synthProcess.on("close", (code) => {
    if (code === 0) {
      console.log(chalk.bold.green("Synthesis finished successfully!"));
    } else {
      console.error(chalk.red(`Synthesis process exited with code ${code}`));
    }
    done();
  });
});

task("destroy", (done) => {
  console.log(chalk.bold("Destroying the project with `cdk destroy`..."));
  const destroyProcess = spawn("cdk", ["destroy"], {
    stdio: "inherit",
    shell: true,
    cwd: "infrastructure",
  });

  destroyProcess.on("close", (code) => {
    if (code === 0) {
      console.log(chalk.bold.green("Resources successfully destroyed!"));
    } else {
      console.error(chalk.red(`Destroy process exited with code ${code}`));
    }
    done();
  });
});

task("test", (done) => {
  console.log(chalk.bold("Running unit tests with `yarn test`..."));
  const testProcess = spawn("yarn", ["test"], {
    stdio: "inherit",
    shell: true,
  });
  testProcess.on("close", (code) => {
    if (code === 0) {
      console.log(chalk.bold.green("Unit tests finished successfully!"));
    } else {
      console.error(chalk.red(`Unit tests process exited with code ${code}`));
    }
    done();
  });
});
