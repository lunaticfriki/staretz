import { filesOfProject } from 'tsarch';

async function inspect() {
  const project = filesOfProject('./tsconfig.json');
  const rule = project.inFolder('src').shouldNot().dependOnFiles().inFolder('test');

  console.log('Rule keys:', Object.keys(rule));
  console.log('Rule Prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(rule)));
}

inspect();
