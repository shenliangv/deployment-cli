import { QuestionCollection } from 'inquirer'

const deployQuestions: QuestionCollection = [
  { type: 'input', name: 'tag', message: 'git tag(press enter to skip):' },
  {
    type: 'confirm',
    name: 'clean',
    message: 'clear the original deployed files?',
    default: false
  }
]

export default deployQuestions
